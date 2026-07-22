import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarDashboardFinanceiro } from "../services/financeiroService";
import { listarMensalidades } from "../services/mensalidadesService";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./financeiro.css";
import "./financeiro-layout.css";

const brl = (value) => Number(value || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
const inicioDoMes = (data) => new Date(data.getFullYear(), data.getMonth(), 1);
const dataLocal = (valor) => valor ? new Date(`${valor}T00:00:00`) : null;
const nomeAluno = (mensalidade) => mensalidade.aluno?.nome || mensalidade.nomeAluno || "Aluno";
const formatarData = (valor) => valor ? new Intl.DateTimeFormat("pt-BR").format(dataLocal(valor)) : "-";

export default function Financeiro() {
  const navigate = useNavigate();
  const [dashboard, setDashboard] = useState({ totalRecebido: 0, totalReceber: 0, totalPagas: 0, totalPendentes: 0, totalVencidas: 0, totalMensalidades: 0, inadimplencia: 0 });
  const [mensalidades, setMensalidades] = useState([]);
  const [periodoReceita, setPeriodoReceita] = useState(6);
  const [periodoSituacao, setPeriodoSituacao] = useState(1);

  useEffect(() => {
    buscarDashboardFinanceiro().then(setDashboard).catch(() => {});
    listarMensalidades().then((response) => setMensalidades(response.data || [])).catch(() => {});
  }, []);

  const receita = useMemo(() => {
    const hoje = new Date();
    return Array.from({ length: periodoReceita }, (_, indice) => {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - (periodoReceita - 1 - indice), 1);
      const valor = mensalidades
        .filter((m) => m.status === "PAGO" && m.pagamento && dataLocal(m.pagamento).getFullYear() === data.getFullYear() && dataLocal(m.pagamento).getMonth() === data.getMonth())
        .reduce((total, m) => total + Number(m.valor || 0), 0);
      return { label: new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit" }).format(data).replace(".", ""), valor };
    });
  }, [mensalidades, periodoReceita]);

  const situacao = useMemo(() => {
    const hoje = new Date();
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - (periodoSituacao - 1), 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1);
    const dados = mensalidades.filter((m) => {
      const vencimento = dataLocal(m.vencimento);
      return vencimento && vencimento >= inicio && vencimento < fim;
    });
    return {
      pagas: dados.filter((m) => m.status === "PAGO").length,
      pendentes: dados.filter((m) => m.status === "PENDENTE").length,
      vencidas: dados.filter((m) => m.status === "VENCIDO").length,
    };
  }, [mensalidades, periodoSituacao]);

  const ultimosPagamentos = useMemo(() => mensalidades.filter((m) => m.status === "PAGO").sort((a, b) => dataLocal(b.pagamento) - dataLocal(a.pagamento)).slice(0, 3), [mensalidades]);
  const proximosVencimentos = useMemo(() => mensalidades.filter((m) => m.status !== "PAGO" && dataLocal(m.vencimento) >= inicioDoMes(new Date())).sort((a, b) => dataLocal(a.vencimento) - dataLocal(b.vencimento)).slice(0, 3), [mensalidades]);
  const totalSituacao = situacao.pagas + situacao.pendentes + situacao.vencidas;
  const percentual = (valor) => totalSituacao ? Math.round((valor / totalSituacao) * 100) : 0;
  const p = percentual(situacao.pagas);
  const q = percentual(situacao.pendentes);

  return <div className="finance-page"><Navbar /><Sidebar /><main className="finance-main">
    <h1>Dashboard Financeiro</h1><p className="finance-subtitle">Visão geral da saúde financeira do seu studio.</p>
    <section className="f-cards">
      <Card c="green" icon="▰" title="Total Recebido" val={brl(dashboard.totalRecebido)} note="Mensalidades pagas" />
      <Card c="orange" icon="♙" title="A Receber" val={brl(dashboard.totalReceber)} note={`${dashboard.totalPendentes} mensalidades pendentes`} />
      <Card c="red" icon="△" title="Vencidas" val={dashboard.totalVencidas} note={`${brl(dashboard.totalReceber)} em atraso`} />
      <Card c="blue" icon="⌁" title="Inadimplência" val={`${Number(dashboard.inadimplencia || 0).toFixed(0)}%`} note="Percentual de mensalidades vencidas" />
    </section>
    <section className="f-grid">
      <article className="f-panel"><Head title="▥　Receita Mensal"><select value={periodoReceita} onChange={(e) => setPeriodoReceita(Number(e.target.value))} aria-label="Período da receita mensal"><option value={3}>Últimos 3 meses</option><option value={6}>Últimos 6 meses</option><option value={12}>Últimos 12 meses</option></select></Head><Bars dados={receita} /></article>
      <article className="f-panel"><Head title="▱　Situação das Mensalidades"><select value={periodoSituacao} onChange={(e) => setPeriodoSituacao(Number(e.target.value))} aria-label="Período da situação das mensalidades"><option value={1}>Este mês</option><option value={3}>Últimos 3 meses</option><option value={6}>Últimos 6 meses</option></select></Head><div className="donut-wrap"><div className="donut" style={{ background: `conic-gradient(#35b959 0 ${p}%,#ffad17 ${p}% ${p + q}%,#ef4144 ${p + q}% 100%)` }}><div>Total<b>{totalSituacao}</b></div></div><div className="donut-list"><p><i className="dot g" />Pagas<b>{situacao.pagas} ({p}%)</b></p><p><i className="dot o" />Pendentes<b>{situacao.pendentes} ({q}%)</b></p><p><i className="dot r" />Vencidas<b>{situacao.vencidas} ({percentual(situacao.vencidas)}%)</b></p></div></div></article>
      <Table title="♙　Últimos Pagamentos" rows={ultimosPagamentos} paid onViewAll={() => navigate("/mensalidades")} />
      <Table title="▣　Próximos Vencimentos" rows={proximosVencimentos} onViewAll={() => navigate("/mensalidades")} />
    </section>
  </main></div>;
}

function Card({ c, icon, title, val, note }) { return <article className={`f-card ${c}`}><i>{icon}</i><div><p>{title}　<small>ⓘ</small></p><strong>{val}</strong><span>{note}</span></div></article>; }
function Head({ title, children }) { return <header className="panel-head"><h2>{title}</h2>{children}</header>; }
function Bars({ dados }) { const maximo = Math.max(...dados.map((d) => d.valor), 1); return <div className="bar-chart"><div className="axis">{[100, 75, 50, 25, 0].map((p) => <span key={p}>{brl((maximo * p) / 100).replace(",00", "")}</span>)}</div><div className="bars">{dados.map((d, i) => <div className="bar-item" key={d.label}><b>{brl(d.valor)}</b><i className={i === dados.length - 1 ? "now" : ""} style={{ height: `${Math.max(d.valor ? (d.valor / maximo) * 100 : 0, 1)}%` }} /><span>{d.label}</span></div>)}</div><small className="legend">■　Valor Recebido (R$)</small></div>; }
function Table({ title, rows, paid, onViewAll }) { const hoje = new Date(); hoje.setHours(0, 0, 0, 0); return <article className="f-panel table-panel"><Head title={title}><button type="button" onClick={onViewAll}>Ver todos　⌄</button></Head><table><thead><tr><th>Aluno</th><th>{paid ? "Valor" : "Vencimento"}</th><th>{paid ? "Data Pagamento" : "Valor"}</th><th>{paid ? "Forma" : "Dias"}</th></tr></thead><tbody>{rows.length ? rows.map((m) => { const dias = Math.ceil((dataLocal(m.vencimento) - hoje) / 86400000); return <tr key={m.id}><td><i className="avatar">{nomeAluno(m)[0]}</i>{nomeAluno(m)}</td><td className={paid ? "money" : ""}>{paid ? brl(m.valor) : <>{formatarData(m.vencimento)}<small>{dias <= 0 ? "Vencido" : `${dias} dia${dias > 1 ? "s" : ""}`}</small></>}</td><td>{paid ? formatarData(m.pagamento) : brl(m.valor)}</td><td><mark className={paid ? "pay" : dias <= 0 ? "late" : "days"}>{paid ? "Pago" : `${Math.max(dias, 0)} dia${dias !== 1 ? "s" : ""}`}</mark></td></tr>; }) : <tr><td colSpan="4" className="empty-table">Nenhuma mensalidade encontrada.</td></tr>}</tbody></table></article>; }

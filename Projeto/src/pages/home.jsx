import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarAlunos } from "../services/api";
import { listarMensalidades } from "../services/mensalidadesService";
import {
  listarAlunosAtivos,
  listarAlunosInativos,
  listarMensalidadesPagas,
  listarMensalidadesVencidas,
} from "../services/relatorioService";
import "./home.css";

function Home() {
  const [todosAlunos, setTodosAlunos] = useState([]);
  const [alunosAtivos, setAlunosAtivos] = useState([]);
  const [alunosInativos, setAlunosInativos] = useState([]);
  const [todasMensalidades, setTodasMensalidades] = useState([]);
  const [mensalidadesPagas, setMensalidadesPagas] = useState([]);
  const [mensalidadesVencidas, setMensalidadesVencidas] = useState([]);
  const [tipoRelatorio, setTipoRelatorio] = useState("todos");
  const [carregando, setCarregando] = useState(true);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const estaVencida = (mensalidade) => {
    if (mensalidade.status === "ATRASADO" || mensalidade.status === "VENCIDO") {
      return true;
    }

    if (mensalidade.status !== "PENDENTE" || !mensalidade.vencimento) {
      return false;
    }

    const vencimento = new Date(`${mensalidade.vencimento}T00:00:00`);
    return vencimento < hoje;
  };

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const alunos = await listarAlunos();

        if (alunos.data && alunos.data.content) {
          setTodosAlunos(alunos.data.content);
          setAlunosAtivos(alunos.data.content.filter((aluno) => aluno.ativo));
          setAlunosInativos(alunos.data.content.filter((aluno) => !aluno.ativo));
        } else {
          setTodosAlunos(alunos.data || []);
          setAlunosAtivos((alunos.data || []).filter((aluno) => aluno.ativo));
          setAlunosInativos((alunos.data || []).filter((aluno) => !aluno.ativo));
        }

        try {
          const mensalidades = await listarMensalidades();
          const dadosMensalidades = mensalidades.data || [];

          setTodasMensalidades(dadosMensalidades);
          setMensalidadesPagas(
            dadosMensalidades.filter((mensalidade) => mensalidade.status === "PAGO")
          );
          setMensalidadesVencidas(dadosMensalidades.filter(estaVencida));
        } catch (erro) {
          console.error("Erro ao carregar mensalidades no dashboard:", erro);
        }

        const [ativos, inativos, pagos, vencidos] = await Promise.allSettled([
          listarAlunosAtivos(),
          listarAlunosInativos(),
          listarMensalidadesPagas(),
          listarMensalidadesVencidas(),
        ]);

        if (ativos.status === "fulfilled") {
          setAlunosAtivos(ativos.value.data || []);
        }

        if (inativos.status === "fulfilled") {
          setAlunosInativos(inativos.value.data || []);
        }

        if (pagos.status === "fulfilled") {
          setMensalidadesPagas(pagos.value.data || []);
        }

        if (vencidos.status === "fulfilled" && (vencidos.value.data || []).length > 0) {
          setMensalidadesVencidas(vencidos.value.data || []);
        }
      } catch (erro) {
        console.error("Erro ao carregar alunos no dashboard:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return "-";

    const partes = dataString.split("-");
    if (partes.length === 3) {
      return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    return dataString;
  };

  const formatarValor = (valor) => {
    const numero = Number(valor || 0);

    return numero.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const somarMensalidades = (mensalidades) => {
    return mensalidades.reduce((total, mensalidade) => {
      return total + Number(mensalidade.valor || 0);
    }, 0);
  };

  const relatorioAtual = useMemo(() => {
    const opcoes = {
      todos: {
        titulo: "Todos os Alunos",
        tipo: "alunos",
        dados: todosAlunos,
      },
      ativos: {
        titulo: "Alunos Ativos",
        tipo: "alunos",
        dados: alunosAtivos,
      },
      inativos: {
        titulo: "Alunos Inativos",
        tipo: "alunos",
        dados: alunosInativos,
      },
      mensalidades: {
        titulo: "Todas as Mensalidades",
        tipo: "mensalidades",
        dados: todasMensalidades,
      },
      pagos: {
        titulo: "Mensalidades Pagas",
        tipo: "mensalidades",
        dados: mensalidadesPagas,
      },
      vencidos: {
        titulo: "Mensalidades Vencidas",
        tipo: "mensalidades",
        dados: mensalidadesVencidas,
      },
    };

    return opcoes[tipoRelatorio];
  }, [
    todosAlunos,
    alunosAtivos,
    alunosInativos,
    todasMensalidades,
    mensalidadesPagas,
    mensalidadesVencidas,
    tipoRelatorio,
  ]);

  const recebido = somarMensalidades(mensalidadesPagas);
  const pendente = somarMensalidades(mensalidadesVencidas);

  const imprimirRelatorio = () => {
    window.print();
  };

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 dashboard-topo">
        <h2 className="mb-0">Dashboard</h2>

        <div className="d-flex gap-2 flex-wrap">
          <Link to="/alunos" className="btn btn-dark fw-bold">
            Listar Alunos
          </Link>

          <Link to="/cadastro-avaliacao" className="btn btn-warning fw-bold">
            Nova Avaliacao
          </Link>

          <Link to="/cadastro-mensalidade" className="btn btn-success fw-bold">
            Nova Mensalidade
          </Link>

          <Link to="/cadastro-aluno" className="btn btn-primary fw-bold">
            Novo Aluno
          </Link>
        </div>
      </div>

      {carregando ? (
        <p>Carregando dashboard...</p>
      ) : (
        <>
          <div className="row g-3 mb-4 dashboard-resumo">
            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 border-top border-primary border-4">
                <div className="card-body">
                  <p className="text-secondary fw-bold mb-2">Alunos Ativos</p>
                  <h3 className="fw-bold mb-0">{alunosAtivos.length}</h3>
                  <small className="text-success">cadastrados</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 border-top border-secondary border-4">
                <div className="card-body">
                  <p className="text-secondary fw-bold mb-2">Alunos Inativos</p>
                  <h3 className="fw-bold mb-0">{alunosInativos.length}</h3>
                  <small className="text-secondary">fora do plano</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 border-top border-success border-4">
                <div className="card-body">
                  <p className="text-secondary fw-bold mb-2">Mensalidades Pagas</p>
                  <h3 className="fw-bold mb-0">{mensalidadesPagas.length}</h3>
                  <small className="text-success">em dia</small>
                </div>
              </div>
            </div>

            <div className="col-12 col-md-6 col-xl-3">
              <div className="card border-0 shadow-sm h-100 border-top border-danger border-4">
                <div className="card-body">
                  <p className="text-secondary fw-bold mb-2">Mensalidades Vencidas</p>
                  <h3 className="fw-bold mb-0">{mensalidadesVencidas.length}</h3>
                  <small className="text-danger">atencao</small>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3 mb-4 dashboard-financeiro">
            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Resumo financeiro</h5>
                  <p className="text-secondary mb-2">Recebido em mensalidades pagas</p>
                  <h3 className="fw-bold text-success">{formatarValor(recebido)}</h3>
                </div>
              </div>
            </div>

            <div className="col-12 col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="fw-bold">Atenção</h5>
                  <p className="text-secondary mb-2">Valor em mensalidades vencidas</p>
                  <h3 className="fw-bold text-danger">{formatarValor(pendente)}</h3>
                </div>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3 relatorio-cabecalho">
            <h2 className="mb-0">Relatórios</h2>

            <button onClick={imprimirRelatorio} className="btn btn-dark fw-bold">
              Exportar / Imprimir
            </button>
          </div>

          <div className="d-flex gap-2 flex-wrap mb-4 relatorio-filtros">
            <button
              className={`btn fw-bold ${tipoRelatorio === "todos" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setTipoRelatorio("todos")}
            >
              Todos os Alunos
            </button>

            <button
              className={`btn fw-bold ${tipoRelatorio === "ativos" ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setTipoRelatorio("ativos")}
            >
              Alunos Ativos
            </button>

            <button
              className={`btn fw-bold ${tipoRelatorio === "inativos" ? "btn-secondary" : "btn-outline-secondary"}`}
              onClick={() => setTipoRelatorio("inativos")}
            >
              Alunos Inativos
            </button>

            <button
              className={`btn fw-bold ${tipoRelatorio === "mensalidades" ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setTipoRelatorio("mensalidades")}
            >
              Todas Mensalidades
            </button>

            <button
              className={`btn fw-bold ${tipoRelatorio === "pagos" ? "btn-success" : "btn-outline-success"}`}
              onClick={() => setTipoRelatorio("pagos")}
            >
              Mensalidades Pagas
            </button>

            <button
              className={`btn fw-bold ${tipoRelatorio === "vencidos" ? "btn-danger" : "btn-outline-danger"}`}
              onClick={() => setTipoRelatorio("vencidos")}
            >
              Mensalidades Vencidas
            </button>
          </div>

          <div className="area-impressao">
          <h3 className="titulo-relatorio-impressao">Relatório</h3>
          <h4 className="titulo-impressao">{relatorioAtual.titulo}</h4>

          <div className="table-responsive shadow-sm rounded relatorio-tabela">
            <table className="table table-striped table-hover mb-0 tabela-impressao">
              <thead className="table-dark">
                {relatorioAtual.tipo === "alunos" ? (
                  <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Profissão</th>
                    <th>Data Início</th>
                    <th>Objetivo</th>
                    <th>Status</th>
                  </tr>
                ) : (
                  <tr>
                    <th>ID</th>
                    <th>Aluno</th>
                    <th>Vencimento</th>
                    <th>Pagamento</th>
                    <th>Valor</th>
                    <th>Status</th>
                  </tr>
                )}
              </thead>

              <tbody>
                {relatorioAtual.dados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      Nenhum registro encontrado em {relatorioAtual.titulo}.
                    </td>
                  </tr>
                ) : relatorioAtual.tipo === "alunos" ? (
                  relatorioAtual.dados.map((aluno) => (
                    <tr key={aluno.id} className="align-middle">
                      <td className="fw-bold">{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.telefone || "-"}</td>
                      <td>{aluno.profissao || "-"}</td>
                      <td>{formatarData(aluno.dataInicio)}</td>
                      <td>{aluno.objetivo || "-"}</td>
                      <td>
                        {aluno.ativo ? (
                          <span className="badge bg-success">Ativo</span>
                        ) : (
                          <span className="badge bg-danger">Inativo</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  relatorioAtual.dados.map((mensalidade) => (
                    <tr key={mensalidade.id} className="align-middle">
                      <td className="fw-bold">{mensalidade.id}</td>
                      <td>{mensalidade.aluno?.nome || "-"}</td>
                      <td>{formatarData(mensalidade.vencimento)}</td>
                      <td>{formatarData(mensalidade.pagamento)}</td>
                      <td>{formatarValor(mensalidade.valor)}</td>
                      <td>
                        {mensalidade.status === "PAGO" ? (
                          <span className="badge bg-success">Pago</span>
                        ) : estaVencida(mensalidade) ? (
                          <span className="badge bg-danger">Vencido</span>
                        ) : (
                          <span className="badge bg-warning text-dark">Pendente</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;

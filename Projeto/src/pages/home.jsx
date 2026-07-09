import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { listarAlunos } from "../services/api";
import {
  listarMensalidades,
  listarMensalidadesDoAluno,
} from "../services/mensalidadesService";
import {
  listarAlunosAtivos,
  listarAlunosInativos,
} from "../services/relatorioService";
import "./home.css";
import Sidebar from "../components/Sidebar";
import { buscarDashboardFinanceiro } from "../services/financeiroService";

function Home() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem("sidebarCollapsed") === "true";
    } catch {
      return false;
    }
  });
  const carregarDashboardFinanceiro = async () => {
    try {
      const dados = await buscarDashboardFinanceiro();
      setDashboardFinanceiro(dados);
    } catch (erro) {
      console.error("Erro ao carregar dashboard financeiro", erro);
    }
  };
  useEffect(() => {
    if (sidebarCollapsed) document.body.classList.add("sidebar-collapsed");
    else document.body.classList.remove("sidebar-collapsed");
  }, [sidebarCollapsed]);
  const [dashboardFinanceiro, setDashboardFinanceiro] = useState({
    totalRecebido: 0,
    totalReceber: 0,
    totalPagas: 0,
    totalPendentes: 0,
    totalVencidas: 0,
    totalMensalidades: 0,
    inadimplencia: 0,
  });

  function toggleSidebarLocal() {
    const next = !sidebarCollapsed;
    setSidebarCollapsed(next);
    if (next) document.body.classList.add("sidebar-collapsed");
    else document.body.classList.remove("sidebar-collapsed");

    try {
      localStorage.setItem("sidebarCollapsed", next ? "true" : "false");
    } catch (error) {
      console.warn("Não foi possível salvar o estado do menu.", error);
    }
  }

  const [todosAlunos, setTodosAlunos] = useState([]);
  const [alunosAtivos, setAlunosAtivos] = useState([]);
  const [alunosInativos, setAlunosInativos] = useState([]);
  const [todasMensalidades, setTodasMensalidades] = useState([]);
  const [mensalidadesPagas, setMensalidadesPagas] = useState([]);
  const [mensalidadesVencidas, setMensalidadesVencidas] = useState([]);
  const [tipoRelatorio, setTipoRelatorio] = useState("todos");
  const [carregando, setCarregando] = useState(true);

  const normalizarStatus = (status) => {
    return (status || "").toString().trim().toUpperCase();
  };

  const estaPaga = (mensalidade) => {
    return normalizarStatus(mensalidade.status) === "PAGO";
  };

  const estaVencida = (mensalidade) => {
    const status = normalizarStatus(mensalidade.status);

    if (estaPaga(mensalidade)) {
      return false;
    }

    if (status === "ATRASADO" || status === "VENCIDO") {
      return true;
    }

    if (status === "PENDENTE" || !mensalidade.vencimento) {
      return false;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const vencimento = new Date(`${mensalidade.vencimento}T00:00:00`);
    return vencimento < hoje;
  };

  useEffect(() => {
    async function carregarDashboard() {
      try {
        const alunos = await listarAlunos();
        let dadosAlunos = [];

        if (alunos.data && alunos.data.content) {
          dadosAlunos = alunos.data.content;
        } else {
          dadosAlunos = alunos.data || [];
        }

        setTodosAlunos(dadosAlunos);
        setAlunosAtivos(dadosAlunos.filter((aluno) => aluno.ativo));
        setAlunosInativos(dadosAlunos.filter((aluno) => !aluno.ativo));

        try {
          const mensalidadesPorAluno = await Promise.all(
            dadosAlunos.map(async (aluno) => {
              try {
                const resposta = await listarMensalidadesDoAluno(aluno.id);
                const mensalidadesAluno = resposta.data || [];

                return mensalidadesAluno.map((mensalidade) => ({
                  ...mensalidade,
                  aluno,
                }));
              } catch (erro) {
                console.error(`Erro ao carregar mensalidades do aluno ${aluno.id}:`, erro);
                return [];
              }
            })
          );

          const dadosMensalidades = mensalidadesPorAluno.flat();

          setTodasMensalidades(dadosMensalidades);
          setMensalidadesPagas(dadosMensalidades.filter(estaPaga));
          setMensalidadesVencidas(dadosMensalidades.filter(estaVencida));
        } catch (erro) {
          console.error("Erro ao carregar mensalidades por aluno:", erro);

          const mensalidades = await listarMensalidades();
          const dadosMensalidades = mensalidades.data || [];

          setTodasMensalidades(dadosMensalidades);
          setMensalidadesPagas(dadosMensalidades.filter(estaPaga));
          setMensalidadesVencidas(dadosMensalidades.filter(estaVencida));
        }

        const [ativos, inativos] = await Promise.allSettled([
          listarAlunosAtivos(),
          listarAlunosInativos(),
        ]);

        if (ativos.status === "fulfilled") {
          setAlunosAtivos(ativos.value.data || []);
        }

        if (inativos.status === "fulfilled") {
          setAlunosInativos(inativos.value.data || []);
        }
      } catch (erro) {
        console.error("Erro ao carregar alunos no dashboard:", erro);
      } finally {
        setCarregando(false);
      }
    }

    carregarDashboard();
  }, []); // <- roda só uma vez ao montar, sem loop

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

  const linhasRelatorioCompleto = useMemo(() => {
    return todosAlunos.flatMap((aluno) => {
      const mensalidadesDoAluno =
        Array.isArray(aluno.mensalidades) && aluno.mensalidades.length > 0
          ? aluno.mensalidades
          : todasMensalidades.filter((mensalidade) => mensalidade.aluno?.id === aluno.id);

      if (mensalidadesDoAluno.length === 0) {
        return [{ aluno, mensalidade: null }];
      }

      return mensalidadesDoAluno.map((mensalidade) => ({
        aluno,
        mensalidade,
      }));
    });
  }, [todosAlunos, todasMensalidades]);

  const relatorioAtual = useMemo(() => {
    const opcoes = {
      todos: {
        titulo: "Todos os Alunos",
        tipo: "completo",
        dados: linhasRelatorioCompleto,
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
        titulo: "Relatorio Completo de Mensalidades",
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
    alunosAtivos,
    alunosInativos,
    todasMensalidades,
    linhasRelatorioCompleto,
    mensalidadesPagas,
    mensalidadesVencidas,
    tipoRelatorio,
  ]);

  const recebido = somarMensalidades(mensalidadesPagas);
  const pendente = somarMensalidades(mensalidadesVencidas);
  const role = localStorage.getItem("role");
  const isAdmin = role === "ADMIN";

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const paginacao = useMemo(() => {
    const totalItems = relatorioAtual?.dados?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const current = Math.min(Math.max(1, currentPage), totalPages);
    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return {
      totalItems,
      totalPages,
      current,
      pageSize,
      start,
      end,
      pageItems: (relatorioAtual?.dados || []).slice(start, end),
    };
  }, [relatorioAtual, currentPage, pageSize]);

  return (
    <>
      <div className="layout">
        <Sidebar />

        <div className="dashboard-container">
          <div className="mb-4">
            <div className="d-flex align-items-center gap-3 mb-4">
              <button
                className="sidebar-toggle"
                onClick={toggleSidebarLocal}
                aria-label="Toggle sidebar"
                title={sidebarCollapsed ? 'Abrir menu' : 'Fechar menu'}
              >
                <span style={{ fontSize: 16 }}>☰</span>
              </button>

              <h2 className="mb-0 fw-bold">Dashboard</h2>
            </div>
          </div>

          {carregando ? (
            <p>Carregando dashboard...</p>
          ) : (
            <>
              <div className="row g-3 mb-4 dashboard-resumo">
                {/* Alunos Ativos */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card dashboard-card dashboard-card-blue h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <p className="card-title-custom">Alunos Ativos</p>
                        <h2 className="card-number">{alunosAtivos.length}</h2>
                        <small className="text-success">cadastrados</small>
                      </div>
                      <div className="card-icon card-icon-blue">👥</div>
                    </div>
                    <div className="card-wave card-wave-blue"></div>
                  </div>
                </div>

                {/* Alunos Inativos */}
                <div className="col-12 col-md-6 col-xl-3">
                  <div className="card dashboard-card dashboard-card-gray h-100">
                    <div className="card-body d-flex justify-content-between align-items-center">
                      <div>
                        <p className="card-title-custom">Alunos Inativos</p>
                        <h2 className="card-number">{alunosInativos.length}</h2>
                        <small className="text-secondary">fora do plano</small>
                      </div>
                      <div className="card-icon card-icon-gray">👤</div>
                    </div>
                    <div className="card-wave card-wave-gray"></div>
                  </div>
                </div>

                {/* Mensalidades Pagas */}
                {isAdmin && (
                  <div className="col-12 col-md-6 col-xl-3">
                    <div className="card dashboard-card dashboard-card-green h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <p className="card-title-custom">Mensalidades Pagas</p>
                          <h2 className="card-number">{mensalidadesPagas.length}</h2>
                          <small className="text-success">em dia</small>
                        </div>
                        <div className="card-icon card-icon-green">💳</div>
                      </div>
                      <div className="card-wave card-wave-green"></div>
                    </div>
                  </div>
                )}

                {/* Mensalidades Vencidas */}
                {isAdmin && (
                  <div className="col-12 col-md-6 col-xl-3">
                    <div className="card dashboard-card dashboard-card-red h-100">
                      <div className="card-body d-flex justify-content-between align-items-center">
                        <div>
                          <p className="card-title-custom">Mensalidades Vencidas</p>
                          <h2 className="card-number">{mensalidadesVencidas.length}</h2>
                          <small className="text-danger">atenção</small>
                        </div>
                        <div className="card-icon card-icon-red">⚠️</div>
                      </div>
                      <div className="card-wave card-wave-red"></div>
                    </div>
                  </div>
                )}
              </div>

              {isAdmin && (
                <div className="row g-3 mb-4 dashboard-financeiro">
                  <div className="col-12 col-lg-6">
                    <div className="card dashboard-card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="fw-bold">Resumo financeiro</h5>
                        <p className="text-secondary mb-2">Recebido em mensalidades pagas</p>
                        <h3 className="fw-bold text-success">{formatarValor(recebido)}</h3>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 col-lg-6">
                    <div className="card dashboard-card shadow-sm h-100">
                      <div className="card-body">
                        <h5 className="fw-bold">Atenção</h5>
                        <p className="text-secondary mb-2">Valor em mensalidades vencidas</p>
                        <h3 className="fw-bold text-danger">{formatarValor(pendente)}</h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {isAdmin && (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3 relatorio-cabecalho">
                    <h2 className="mb-0">Relatórios</h2>
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
                      Relatorio Completo Mensalidades
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
                      <table className={`table table-striped table-hover mb-0 tabela-impressao tabela-${relatorioAtual.tipo}`}>
                        <thead className="table-dark">
                          {relatorioAtual.tipo === "completo" ? (
                            <tr>
                              <th>Nome</th>
                              <th>Telefone</th>
                              <th>Profissão</th>
                              <th>Data Início</th>
                              <th>Objetivo</th>
                              <th>Status Aluno</th>
                              <th>Vencimento</th>
                              <th>Pagamento</th>
                              <th>Valor</th>
                              <th>Status Mens.</th>
                            </tr>
                          ) : relatorioAtual.tipo === "alunos" ? (
                            <tr>
                              <th>Nome</th>
                              <th>Telefone</th>
                              <th>Profissão</th>
                              <th>Data Início</th>
                              <th>Objetivo</th>
                              <th>Status</th>
                            </tr>
                          ) : (
                            <tr>
                              <th>Aluno</th>
                              <th>Vencimento</th>
                              <th>Pagamento</th>
                              <th>Valor</th>
                              <th>Status</th>
                            </tr>
                          )}
                        </thead>

                        <tbody>
                          {paginacao.totalItems === 0 ? (
                            <tr>
                              <td
                                colSpan={
                                  relatorioAtual.tipo === "completo"
                                    ? 12
                                    : relatorioAtual.tipo === "alunos"
                                      ? 7
                                      : 6
                                }
                                className="text-center py-4"
                              >
                                Nenhum registro encontrado em {relatorioAtual.titulo}.
                              </td>
                            </tr>
                          ) : relatorioAtual.tipo === "completo" ? (
                            paginacao.pageItems.map((linha) => (
                              <tr
                                key={`${linha.aluno.id}-${linha.mensalidade?.id || "sem-mensalidade"}`}
                                className="align-middle"
                              >
                                <td>{linha.aluno.nome}</td>
                                <td>{linha.aluno.telefone || "-"}</td>
                                <td>{linha.aluno.profissao || "-"}</td>
                                <td>{formatarData(linha.aluno.dataInicio)}</td>
                                <td>{linha.aluno.objetivo || "-"}</td>

                                <td>
                                  {linha.aluno.ativo ? (
                                    <span className="badge bg-success">Ativo</span>
                                  ) : (
                                    <span className="badge bg-danger">Inativo</span>
                                  )}
                                </td>

                                <td>
                                  {linha.mensalidade
                                    ? formatarData(linha.mensalidade.vencimento)
                                    : "Sem vencimento"}
                                </td>

                                <td>
                                  {linha.mensalidade
                                    ? formatarData(linha.mensalidade.pagamento)
                                    : "Sem pagamento"}
                                </td>

                                <td>
                                  {linha.mensalidade
                                    ? formatarValor(linha.mensalidade.valor)
                                    : formatarValor(0)}
                                </td>

                                <td>
                                  {!linha.mensalidade ? (
                                    <span className="badge bg-secondary">Sem mensalidade</span>
                                  ) : estaPaga(linha.mensalidade) ? (
                                    <span className="badge bg-success">Pago</span>
                                  ) : estaVencida(linha.mensalidade) ? (
                                    <span className="badge bg-danger">Vencido</span>
                                  ) : (
                                    <span className="badge bg-warning text-dark">
                                      {linha.mensalidade.status || "Pendente"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : relatorioAtual.tipo === "alunos" ? (
                            paginacao.pageItems.map((aluno) => (
                              <tr key={aluno.id} className="align-middle">
                                <td>{aluno.nome}</td>
                                <td>{aluno.telefone || "-"}</td>
                                <td>{aluno.profissao || "-"}</td>
                                <td>{formatarData(aluno.dataInicio)}</td>
                                <td>{aluno.objetivo || "-"}</td>

                                <td>
                                  {aluno.ativo ? (
                                    <span className="badge bg-success">Ativo</span>
                                  ) : (
                                    <>
                                      <span className="badge bg-danger">Inativo</span>
                                      <Link
                                        to={`/editar-aluno/${aluno.id}`}
                                        className="btn btn-success btn-sm ms-2"
                                      >
                                        Ativa
                                      </Link>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))
                          ) : (
                            paginacao.pageItems.map((mensalidade) => (
                              <tr key={mensalidade.id} className="align-middle">
                                <td>{mensalidade.aluno?.nome || "-"}</td>
                                <td>{formatarData(mensalidade.vencimento)}</td>
                                <td>{formatarData(mensalidade.pagamento)}</td>
                                <td>{formatarValor(mensalidade.valor)}</td>
                                <td>
                                  {estaPaga(mensalidade) ? (
                                    <span className="badge bg-success">Pago</span>
                                  ) : estaVencida(mensalidade) ? (
                                    <>
                                      <span className="badge bg-danger">Vencido</span>
                                      {mensalidade.aluno?.id && (
                                        <Link
                                          to={`/alunos/${mensalidade.aluno.id}/mensalidades`}
                                          className="btn btn-success btn-sm ms-2"
                                        >
                                          Confirmar
                                        </Link>
                                      )}
                                    </>
                                  ) : (
                                    <span className="badge bg-warning text-dark">
                                      {mensalidade.status || "Pendente"}
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginação */}
                    <div className="d-flex justify-content-between align-items-center mt-3">
                      <div className="text-muted">
                        {paginacao.totalItems > 0 ? (
                          <>
                            Mostrando {paginacao.start + 1} - {Math.min(paginacao.end, paginacao.totalItems)} de {paginacao.totalItems}
                          </>
                        ) : (
                          <>Nenhum item para mostrar</>
                        )}
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <select
                          className="form-select form-select-sm"
                          style={{ width: 80 }}
                          value={pageSize}
                          onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                        </select>

                        <nav>
                          <ul className="pagination mb-0">
                            <li className={`page-item ${paginacao.current === 1 ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(Math.max(1, paginacao.current - 1))}
                                disabled={paginacao.current === 1}
                              >
                                Anterior
                              </button>
                            </li>

                            {Array.from({ length: paginacao.totalPages }).map((_, idx) => {
                              const p = idx + 1;
                              return (
                                <li key={p} className={`page-item ${p === paginacao.current ? "active" : ""}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(p)}>
                                    {p}
                                  </button>
                                </li>
                              );
                            })}

                            <li className={`page-item ${paginacao.current === paginacao.totalPages ? "disabled" : ""}`}>
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(Math.min(paginacao.totalPages, paginacao.current + 1))}
                                disabled={paginacao.current === paginacao.totalPages}
                              >
                                Próximo
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default Home;
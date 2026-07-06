import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, excluirAluno } from "../services/api.js";
import Navbar from "../components/Navbar";
import {
  showSuccess,
  showError,
  showConfirmation,
} from "../services/notificationService";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [alunoWhatsapp, setAlunoWhatsapp] = useState(null);
  const [mensagemWhatsapp, setMensagemWhatsapp] = useState("");

  useEffect(() => {
    listarAlunos()
      .then((resposta) => {
        console.log("DADOS DO SPRING BOOT:", resposta.data);

        if (resposta.data && resposta.data.content) {
          setAlunos(resposta.data.content);
        } else {
          setAlunos(resposta.data || []);
        }

        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro na requisição:", erro);
        setCarregando(false);
      });
  }, []);

  const formatarData = (dataString) => {
    if (!dataString) return "-";

    const partes = dataString.split("-");

    if (partes.length === 3) {
      return partes[2] + "/" + partes[1] + "/" + partes[0];
    }

    return dataString;
  };

  const formatarSexo = (sexo) => {
    if (!sexo) return "-";
    if (sexo === "M" || sexo === "m") return "Masculino";
    if (sexo === "F" || sexo === "f") return "Feminino";
    return sexo;
  };

  const alunosFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();

    if (!termo) {
      return alunos;
    }

    return alunos.filter((aluno) => {
      return [
        aluno.nome,
        aluno.profissao,
        aluno.telefone,
        aluno.objetivo,
        aluno.horario?.descricao,
      ]
        .filter(Boolean)
        .some((valor) => valor.toString().toLowerCase().includes(termo));
    });
  }, [alunos, busca]);
  const paginacao = useMemo(() => {
    const totalItems = alunosFiltrados.length;
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize)
    );

    const current = Math.min(
      Math.max(1, currentPage),
      totalPages
    );

    const start = (current - 1) * pageSize;
    const end = start + pageSize;

    return {
      totalItems,
      totalPages,
      current,
      start,
      end,
      pageItems: alunosFiltrados.slice(start, end),
    };
  }, [alunosFiltrados, currentPage, pageSize]);

  const deletarAluno = async (id, nome) => {
    const confirmacao = await showConfirmation(
      `Tem certeza que deseja excluir o aluno(a) ${nome}?`,
      {
        confirmText: "Excluir",
        cancelText: "Cancelar",
      }
    );

    if (!confirmacao) return;

    excluirAluno(id)
      .then((resposta) => {
        if (resposta.status === 200 || resposta.status === 204) {
          setAlunos(alunos.filter((aluno) => aluno.id !== id));
          showSuccess("Aluno excluído com sucesso!");
        }
      })
      .catch((erro) => {
        console.error("Erro ao excluir:", erro);
        showError(
          "Erro ao excluir! Verifique se este aluno possui avaliações ou mensalidades vinculadas."
        );
      });
  };

  const enviarWhatsApp = async () => {

    if (!alunoWhatsapp || !mensagemWhatsapp.trim()) {
      showError("Digite uma mensagem.");
      return;
    }

    try {

      const response = await fetch(
        `http://localhost:8080/api/whatsapp/enviar/${alunoWhatsapp.id}?mensagem=${encodeURIComponent(mensagemWhatsapp)}`,
        {
          method: "POST",
        }
      );

      const retorno = await response.text();

      console.log("RETORNO BACKEND:", retorno);

      if (!response.ok) {
        throw new Error(retorno);
      }

      showSuccess("Mensagem enviada!");

      setMensagemWhatsapp("");
      setAlunoWhatsapp(null);

      document.getElementById("btnFecharWhatsapp")?.click();

    } catch (error) {

      console.error(error);
      showError(error.message || "Erro ao enviar mensagem.");

    }
  };
  return (
    <>
      <Navbar />

      <div className="container mt-4 mb-5">

        <div className="mb-4">
          <h2 className="fw-bold mb-1">
            Alunos
          </h2>

          <p className="text-muted">
            Gerenciamento de alunos cadastrados.
          </p>
        </div>

        {!carregando && (
          <div className="row mb-4 justify-content-end">
            <div className="col-12 col-sm-8 col-md-4 col-lg-3 mb-3 ms-auto">
              <div className="input-group input-group-sm">
                <span className="input-group-text" id="buscar-aluno-label">
                  🔍
                </span>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Buscar aluno"
                  aria-label="Buscar aluno"
                  aria-describedby="buscar-aluno-label"
                  value={busca}
                  onChange={(e) => {
                    setBusca(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {carregando ? (
          <p>Carregando alunos...</p>
        ) : alunosFiltrados.length === 0 ? (
          <p>Nenhum aluno encontrado para "{busca}".</p>
        ) : (
          <>
            <div className="row mb-4">
              <div className="col-md-4">
                <div className="card shadow-sm border-primary">
                  <div className="card-body">
                    <h6>Alunos Ativos</h6>
                    <h2>
                      {alunosFiltrados.filter((a) => a.ativo).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-danger">
                  <div className="card-body">
                    <h6>Alunos Inativos</h6>
                    <h2>
                      {alunosFiltrados.filter((a) => !a.ativo).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-success">
                  <div className="card-body">
                    <h6>Total de Alunos</h6>
                    <h2>{alunosFiltrados.length}</h2>
                  </div>
                </div>
              </div>

            </div>

            <div className="card shadow">

              <div className="card-header bg-dark text-white fw-bold">
                Lista de Alunos
              </div>

              <div className="card-body p-0">

                <div className="table-responsive" style={{ overflow: 'visible' }}>

                  <table className="table table-striped table-hover mb-0">

                    <thead className="table-dark">
                      <tr>
                        <th>Nome</th>
                        <th>Data Nascimento</th>
                        <th>Sexo</th>
                        <th>Profissão</th>
                        <th>Telefone</th>
                        <th>Data Início</th>
                        <th>Objetivo</th>
                        <th>Período</th>
                        <th>Hora Treino</th>
                        <th>Ativo</th>
                        <th>Ações</th>
                      </tr>
                    </thead>

                    <tbody>

                      {paginacao.pageItems.map((aluno) => (

                        <tr key={aluno.id} className="align-middle">

                          <td>{aluno.nome}</td>

                          <td>{formatarData(aluno.dataNascimento)}</td>

                          <td>{formatarSexo(aluno.sexo)}</td>

                          <td>{aluno.profissao || "-"}</td>

                          <td>{aluno.telefone || "-"}</td>

                          <td>{formatarData(aluno.dataInicio)}</td>

                          <td>{aluno.objetivo || "-"}</td>

                          <td>
                            {aluno.horario?.descricao || "-"}
                          </td>

                          <td>
                            {aluno.horarioTreino || "-"}
                          </td>

                          <td>
                            {aluno.ativo ? (
                              <span className="badge bg-success">
                                Sim
                              </span>
                            ) : (
                              <span className="badge bg-danger">
                                Não
                              </span>
                            )}
                          </td>

                          <td className="text-center text-nowrap" style={{ minWidth: 150, width: 150 }}>

                            <div className="dropdown" style={{ position: 'static' }}>

                              <button
                                className="btn btn-outline-secondary btn-sm dropdown-toggle"
                                type="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{ minWidth: 68 }}
                              >
                                Ações
                              </button>

                              <ul className="dropdown-menu dropdown-menu-end" style={{ minWidth: 160 }}>

                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/alunos/${aluno.id}/avaliacoes`}
                                  >
                                    Avaliações
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/alunos/${aluno.id}/mensalidades`}
                                  >
                                    Mensalidades
                                  </Link>
                                </li>

                                <li>
                                  <Link
                                    className="dropdown-item"
                                    to={`/editar-aluno/${aluno.id}`}
                                  >
                                    Editar
                                  </Link>
                                </li>
                                <li>
                                  <button
                                    className="dropdown-item text-success"
                                    data-bs-toggle="modal"
                                    data-bs-target="#modalWhatsapp"
                                    onClick={() => {
                                      setAlunoWhatsapp(aluno);
                                      setMensagemWhatsapp("");
                                    }}
                                  >
                                    WhatsApp
                                  </button>
                                </li>

                                <li>
                                  <hr className="dropdown-divider" />
                                </li>

                                <li>
                                  <button
                                    className="dropdown-item text-danger"
                                    onClick={() =>
                                      deletarAluno(aluno.id, aluno.nome)
                                    }
                                  >
                                    Excluir
                                  </button>
                                </li>

                              </ul>

                            </div>

                          </td>

                        </tr>

                      ))}

                    </tbody>
                  </table>
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

              </div>
            </div>
            <div
              className="modal fade"
              id="modalWhatsapp"
              tabIndex="-1"
            >
              <div className="modal-dialog">
                <div className="modal-content">

                  <div className="modal-header">
                    <h5 className="modal-title">
                      Enviar WhatsApp
                    </h5>

                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                    ></button>
                  </div>

                  <div className="modal-body">

                    <p>
                      Aluno: <strong>{alunoWhatsapp?.nome}</strong>
                    </p>

                    <textarea
                      className="form-control"
                      rows="5"
                      value={mensagemWhatsapp}
                      onChange={(e) =>
                        setMensagemWhatsapp(e.target.value)
                      }
                      placeholder="Digite sua mensagem..."
                    />

                  </div>

                  <div className="modal-footer">

                    <button
                      id="btnFecharWhatsapp"
                      type="button"
                      className="btn btn-secondary"
                      data-bs-dismiss="modal"
                    >
                      Cancelar
                    </button>

                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={enviarWhatsApp}
                    >
                      Enviar
                    </button>

                  </div>

                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Alunos;
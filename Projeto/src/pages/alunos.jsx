import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, excluirAluno } from "../services/api.js";
import Navbar from "../components/Navbar";
import { showSuccess, showError } from "../services/notificationService";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

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

  const deletarAluno = (id, nome) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o aluno(a) ${nome}?`
    );

    if (confirmacao) {
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
                  onChange={(e) => setBusca(e.target.value)}
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

                      {alunosFiltrados.map((aluno) => (

                        <tr key={aluno.id} className="align-middle">

                          <td>{aluno.nome}</td>

                          <td>{formatarData(aluno.dataNascimento)}</td>

                          <td>{aluno.sexo || "-"}</td>

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

                </div>

              </div>

            </div>
          </>
        )}

      </div >
    </>
  );
}

export default Alunos;
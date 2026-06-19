import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, excluirAluno } from "../services/api.js";
import Navbar from "../components/Navbar";

function Alunos() {
  const [alunos, setAlunos] = useState([]);
  const [carregando, setCarregando] = useState(true);

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

  const deletarAluno = (id, nome) => {
    const confirmacao = window.confirm(
      `Tem certeza que deseja excluir o aluno(a) ${nome}?`
    );

    if (confirmacao) {
      excluirAluno(id)
        .then((resposta) => {
          if (resposta.status === 200 || resposta.status === 204) {
            setAlunos(alunos.filter((aluno) => aluno.id !== id));
            alert("Aluno excluído com sucesso!");
          }
        })
        .catch((erro) => {
          console.error("Erro ao excluir:", erro);
          alert(
            "Erro ao excluir! Verifique se este aluno possui avaliações ou mensalidades vinculadas no banco."
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

        {carregando ? (
          <p>Carregando alunos...</p>
        ) : alunos.length === 0 ? (
          <p>Nenhum aluno encontrado no banco de dados.</p>
        ) : (
          <>
            <div className="row mb-4">

              <div className="col-md-4">
                <div className="card shadow-sm border-primary">
                  <div className="card-body">
                    <h6>Alunos Ativos</h6>
                    <h2>
                      {alunos.filter(a => a.ativo).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-danger">
                  <div className="card-body">
                    <h6>Alunos Inativos</h6>
                    <h2>
                      {alunos.filter(a => !a.ativo).length}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card shadow-sm border-success">
                  <div className="card-body">
                    <h6>Total de Alunos</h6>
                    <h2>{alunos.length}</h2>
                  </div>
                </div>
              </div>

            </div>

            <div className="card shadow">

              <div className="card-header bg-dark text-white fw-bold">
                Lista de Alunos
              </div>

              <div className="card-body p-0">

                <div className="table-responsive">

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

                      {alunos.map((aluno) => (

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

                          <td>

                            <div className="d-flex justify-content-center gap-2 flex-wrap">

                              <Link
                                to={`/alunos/${aluno.id}/avaliacoes`}
                                className="btn btn-sm btn-info text-white"
                              >
                                Avaliações
                              </Link>

                              <Link
                                to={`/alunos/${aluno.id}/mensalidades`}
                                className="btn btn-sm btn-success"
                              >
                                Mensalidades
                              </Link>

                              <Link
                                to={`/editar-aluno/${aluno.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                Editar
                              </Link>

                              <button
                                onClick={() =>
                                  deletarAluno(aluno.id, aluno.nome)
                                }
                                className="btn btn-sm btn-danger"
                              >
                                Excluir
                              </button>

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
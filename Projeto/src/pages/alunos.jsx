import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, excluirAluno } from "../services/api.js";

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
    <div className="container mt-4 mb-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <h2>Listagem de Alunos</h2>

        <div className="d-flex gap-2">

          <Link
            to="/cadastro-avaliacao"
            className="btn btn-warning fw-bold"
          >
            Nova Avaliação
          </Link>

          <Link
            to="/cadastro-mensalidade"
            className="btn btn-success fw-bold"
          >
            Nova Mensalidade
          </Link>

          <Link
            to="/cadastro-aluno"
            className="btn btn-primary fw-bold"
          >
            Novo Aluno
          </Link>

        </div>

      </div>

      {carregando ? (
        <p>Carregando alunos...</p>
      ) : alunos.length === 0 ? (
        <p>Nenhum aluno encontrado no banco de dados.</p>
      ) : (

        <div className="table-responsive shadow-sm rounded">

          <table className="table table-striped table-hover mb-0">

            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Data Nascimento</th>
                <th>Sexo</th>
                <th>Profissão</th>
                <th>Telefone</th>
                <th>Data Início</th>
                <th>Objetivo</th>
                <th>Ativo</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>

            <tbody>

              {alunos.map((aluno) => (

                <tr key={aluno.id} className="align-middle">

                  <td className="fw-bold">{aluno.id}</td>

                  <td>{aluno.nome}</td>

                  <td>{formatarData(aluno.dataNascimento)}</td>

                  <td>{aluno.sexo || "-"}</td>

                  <td>{aluno.profissao || "-"}</td>

                  <td>{aluno.telefone || "-"}</td>

                  <td>{formatarData(aluno.dataInicio)}</td>

                  <td>{aluno.objetivo || "-"}</td>

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

      )}

    </div>
  );
}

export default Alunos;
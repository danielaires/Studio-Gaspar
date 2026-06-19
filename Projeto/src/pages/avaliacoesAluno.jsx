import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { listarAvaliacoesDoAluno } from "../services/api.js";

function AvaliacoesAluno() {
  const { id } = useParams(); // ID do Aluno vindo da URL
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Formatação profissional de data
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };

  useEffect(() => {
    if (!id) {
      setCarregando(false);
      return;
    }

    // Chamada ao serviço de API
    listarAvaliacoesDoAluno(id)
      .then((resposta) => {
        // Ajuste conforme sua estrutura de retorno (se usa axios, é .data)
        const dados = resposta.data || resposta;
        setAvaliacoes(Array.isArray(dados) ? dados : []);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar avaliações:", erro);
        setCarregando(false);
      });
  }, [id]);

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Avaliações do Aluno</h2>
        <Link to="/" className="btn btn-secondary fw-bold">
          Voltar
        </Link>
      </div>

      {carregando ? (
        <div className="text-center">
          <p>Carregando avaliações...</p>
        </div>
      ) : avaliacoes.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          Nenhuma avaliação encontrada para este aluno no banco de dados.
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>Data</th>
                <th>Peso (kg)</th>
                <th>Altura (m)</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>

            <tbody>
              {avaliacoes.map((aval) => (
                <tr key={aval.id} className="align-middle">
                  <td>{formatarData(aval.dataAvaliacao)}</td>
                  <td>{aval.peso?.toFixed(2) || "-"}</td>
                  <td>{aval.altura?.toFixed(2) || "-"}</td>
                  <td className="text-center">
                    <Link
                      to={`/avaliacoes/${aval.id}`}
                      className="btn btn-sm btn-info text-white fw-bold"
                    >
                      Detalhes
                    </Link>
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

export default AvaliacoesAluno;
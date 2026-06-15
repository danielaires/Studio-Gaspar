import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { listarAvaliacoesDoAluno } from "../services/api.js"; 

function AvaliacoesAluno() {
  const { id } = useParams(); 
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  // Função auxiliar para formatar a data: AAAA-MM-DD -> DD/MM/AAAA
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const [ano, mes, dia] = dataStr.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  useEffect(() => {
    listarAvaliacoesDoAluno(id)
      .then((resposta) => {
        if (resposta.data && resposta.data.content) {
          setAvaliacoes(resposta.data.content);
        } else {
          setAvaliacoes(resposta.data || []);
        }
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
          Voltar para Alunos
        </Link>
      </div>

      {carregando ? (
        <p>Carregando avaliações...</p>
      ) : avaliacoes.length === 0 ? (
        <div className="alert alert-info shadow-sm">
          Nenhuma avaliação encontrada para este aluno no banco de dados.
        </div>
      ) : (
        <div className="table-responsive shadow-sm rounded">
          <table className="table table-striped table-hover mb-0">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Data da Avaliação</th>
                <th>Peso (kg)</th>
                <th>Altura (m)</th>
                <th className="text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {avaliacoes.map((aval) => (
                <tr key={aval.id} className="align-middle">
                  <td className="fw-bold">{aval.id}</td>
                  
                  {/* CHAMADA DA FUNÇÃO DE FORMATAÇÃO AQUI */}
                  <td>{formatarData(aval.dataAvaliacao)}</td>
                  
                  <td>{aval.peso || '-'}</td>
                  <td>{aval.altura || '-'}</td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <Link to={`/avaliacoes/${aval.id}`} className="btn btn-sm btn-info text-white fw-bold">
                        Detalhes
                      </Link>
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

export default AvaliacoesAluno;
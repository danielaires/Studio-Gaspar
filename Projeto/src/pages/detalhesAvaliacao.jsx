import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarAvaliacaoPorId } from "../services/api.js";

function DetalhesAvaliacao() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [avaliacao, setAvaliacao] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    buscarAvaliacaoPorId(id)
      .then((resposta) => {
        setAvaliacao(resposta.data);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar detalhes da avaliação:", erro);
        setCarregando(false);
      });
  }, [id]);

  if (carregando) return <div className="container mt-4"><p>Carregando detalhes...</p></div>;
  if (!avaliacao) return <div className="container mt-4"><div className="alert alert-danger">Avaliação não encontrada.</div></div>;

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Ficha de Avaliação Física #{avaliacao.id}</h2>
        <button onClick={() => navigate(-1)} className="btn btn-secondary fw-bold">
          Voltar
        </button>
      </div>

      <div className="row g-4">
        {/* CARD 1: DADOS BÁSICOS */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-dark text-white fw-bold">Composição Básica</div>
            <div className="card-body">
              <p><strong>Data:</strong> {avaliacao.dataAvaliacao || "Não informada"}</p>
              <p><strong>Peso:</strong> {avaliacao.peso ? `${avaliacao.peso} kg` : "-"}</p>
              <p><strong>Altura:</strong> {avaliacao.altura ? `${avaliacao.altura} m` : "-"}</p>
            </div>
          </div>
        </div>

        {/* CARD 2: PERÍMETROS */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-primary text-white fw-bold">Perímetros (cm)</div>
            <div className="card-body">
              <p><strong>Peito:</strong> {avaliacao.peito || "-"}</p>
              <p><strong>Abdômen:</strong> {avaliacao.abdomen || "-"}</p>
              <p><strong>Glúteo:</strong> {avaliacao.gluteo || "-"}</p>
              <p><strong>Braço Esq.:</strong> {avaliacao.bracoEsquerdo || "-"}</p>
              <p><strong>Braço Dir.:</strong> {avaliacao.bracoDireito || "-"}</p>
              <p><strong>Coxa Esq.:</strong> {avaliacao.coxaEsquerda || "-"}</p>
              <p><strong>Coxa Dir.:</strong> {avaliacao.coxaDireita || "-"}</p>
              <p><strong>Panturrilha Esq.:</strong> {avaliacao.panturrilhaEsquerda || "-"}</p>
              <p><strong>Panturrilha Dir.:</strong> {avaliacao.panturrilhaDireita || "-"}</p>
            </div>
          </div>
        </div>

        {/* CARD 3: DOBRAS CUTÂNEAS */}
        <div className="col-md-4">
          <div className="card shadow-sm h-100">
            <div className="card-header bg-success text-white fw-bold">Dobras Cutâneas (mm)</div>
            <div className="card-body">
              <p><strong>Tríceps:</strong> {avaliacao.triceps || "-"}</p>
              <p><strong>Subescapular:</strong> {avaliacao.subescapular || "-"}</p>
              <p><strong>Suprailíaca:</strong> {avaliacao.suprailiaca || "-"}</p>
              <p><strong>Dobra Abdômen:</strong> {avaliacao.dobraAbdomen || "-"}</p>
            </div>
          </div>
        </div>

        {/* CARD 4: OBSERVAÇÕES */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-secondary text-white fw-bold">Observações</div>
            <div className="card-body">
              <p className="card-text text-muted" style={{ whiteSpace: "pre-line" }}>
                {avaliacao.observacao || "Nenhuma observação cadastrada para esta avaliação."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetalhesAvaliacao;
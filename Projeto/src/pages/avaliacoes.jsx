import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Avaliacoes() {
    // Pega o ID do aluno que passamos na URL
    const { id } = useParams(); 
    const navigate = useNavigate();
    
    const [avaliacao, setAvaliacao] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        // Busca a avaliação do aluno específico no backend Java
        fetch(`http://localhost:8080/avaliacoes/aluno/${id}`)
            .then(res => {
                if (!res.ok) {
                    throw new Error("Nenhuma avaliação encontrada.");
                }
                return res.json();
            })
            .then(dados => {
                console.log("Avaliação carregada:", dados);
                // Se o backend retornar uma lista, pegamos a primeira/última. 
                // Se retornar um objeto direto, usamos ele.
                setAvaliacao(Array.isArray(dados) ? dados[0] : dados);
                setCarregando(false);
            })
            .catch(erro => {
                console.error("Erro ao buscar avaliação:", erro);
                setCarregando(false);
            });
    }, [id]);

    // Tela de carregamento enquanto o fetch acontece
    if (carregando) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
                <h4 className="mt-3">Buscando avaliação...</h4>
            </div>
        );
    }

    // Tela caso o aluno ainda não tenha nenhuma avaliação cadastrada
    if (!avaliacao) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning shadow-sm" role="alert">
                    <h4 className="alert-heading">Poxa!</h4>
                    <p>Ainda não existe nenhuma avaliação cadastrada para este aluno.</p>
                </div>
                <button className="btn btn-primary px-4" onClick={() => navigate("/")}>
                    Voltar para Listagem
                </button>
            </div>
        );
    }

    // Tela principal com os dados renderizados
    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Avaliação Física</h2>
                <button className="btn btn-secondary px-4" onClick={() => navigate("/")}>
                    Voltar
                </button>
            </div>

            {/* 1. DADOS BÁSICOS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white fw-bold">
                    Dados Básicos
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6 mb-2">
                            <span className="fw-bold">Peso:</span> {avaliacao.peso} kg
                        </div>
                        <div className="col-md-6 mb-2">
                            <span className="fw-bold">Altura:</span> {avaliacao.altura} m
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. CIRCUNFERÊNCIAS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-secondary text-white fw-bold">
                    Circunferências (cm)
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-4"><span className="fw-bold">Peito:</span> {avaliacao.peito || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Abdômen:</span> {avaliacao.abdomen || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Glúteo:</span> {avaliacao.gluteo || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Braço Esq.:</span> {avaliacao.bracoEsquerdo || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Braço Dir.:</span> {avaliacao.bracoDireito || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Coxa Esq.:</span> {avaliacao.coxaEsquerda || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Coxa Dir.:</span> {avaliacao.coxaDireita || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Panturrilha Esq.:</span> {avaliacao.panturrilhaEsquerda || "-"}</div>
                        <div className="col-md-4"><span className="fw-bold">Panturrilha Dir.:</span> {avaliacao.panturrilhaDireita || "-"}</div>
                    </div>
                </div>
            </div>

            {/* 3. DOBRAS CUTÂNEAS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-info text-white fw-bold">
                    Dobras Cutâneas (mm)
                </div>
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-3"><span className="fw-bold">Tríceps:</span> {avaliacao.triceps || "-"}</div>
                        <div className="col-md-3"><span className="fw-bold">Subescapular:</span> {avaliacao.subescapular || "-"}</div>
                        <div className="col-md-3"><span className="fw-bold">Supra-ilíaca:</span> {avaliacao.suprailiaca || "-"}</div>
                        <div className="col-md-3"><span className="fw-bold">Abdômen:</span> {avaliacao.dobraAbdomen || "-"}</div>
                    </div>
                </div>
            </div>

            {/* 4. OBSERVAÇÕES */}
            {avaliacao.observacao && (
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-dark text-white fw-bold">
                        Observações
                    </div>
                    <div className="card-body">
                        <p className="mb-0">{avaliacao.observacao}</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Avaliacoes;
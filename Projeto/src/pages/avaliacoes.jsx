import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarAvaliacaoPorId } from "../services/api.js";

function Avaliacoes() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [avaliacao, setAvaliacao] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        buscarAvaliacaoPorId(id)
            .then(res => {
                setAvaliacao(res.data);
                setCarregando(false);
            })
            .catch(erro => {
                console.error("Erro ao buscar avaliação:", erro);
                setCarregando(false);
            });
    }, [id]);

    if (carregando) {
        return (
            <div className="container mt-5 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }

    if (!avaliacao) {
        return (
            <div className="container mt-5 text-center">
                <div className="alert alert-warning shadow-sm">
                    <h4>Avaliação não encontrada</h4>
                    <p>Não foi possível carregar os detalhes desta avaliação.</p>
                </div>
                <button className="btn btn-primary" onClick={() => navigate(-1)}>Voltar</button>
            </div>
        );
    }

    return (
        <div className="container mt-5 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2> Ficha de Avaliação Física</h2>

                <button
                    className="btn btn-secondary px-4"
                    onClick={() => navigate(-1)}
                >
                    Voltar
                </button>

            </div>

            {/* 1. DADOS BÁSICOS */}
            <div className="card mb-4 shadow-sm">
                <div className="card-header bg-primary text-white fw-bold">
                    Composição Básica
                </div>

                <div className="card-body">
                    <div className="row">

                        <div className="col-md-12 mb-2">
                            <strong>Data:</strong>{" "}
                            {avaliacao.dataAvaliacao
                                ? avaliacao.dataAvaliacao
                                    .split("-")
                                    .reverse()
                                    .join("/")
                                : "-"}
                        </div>

                        <div className="col-md-6 mb-2">
                            <strong>Peso:</strong> {avaliacao.peso} kg
                        </div>

                        <div className="col-md-6 mb-2">
                            <strong>Altura:</strong> {avaliacao.altura} m
                        </div>

                    </div>
                </div>
            </div>

            {/* 2. PERÍMETROS */}
            <div className="card mb-4 shadow-sm">

                <div className="card-header bg-secondary text-white fw-bold">
                    Perímetros (cm)
                </div>

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-4">
                            <strong>Peito:</strong> {avaliacao.peito || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Abdômen:</strong> {avaliacao.abdomen || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Glúteo:</strong> {avaliacao.gluteo || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Braço Esq.:</strong> {avaliacao.bracoEsquerdo || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Braço Dir.:</strong> {avaliacao.bracoDireito || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Coxa Esq.:</strong> {avaliacao.coxaEsquerda || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Coxa Dir.:</strong> {avaliacao.coxaDireita || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Panturrilha Esq.:</strong> {avaliacao.panturrilhaEsquerda || "-"}
                        </div>

                        <div className="col-md-4">
                            <strong>Panturrilha Dir.:</strong> {avaliacao.panturrilhaDireita || "-"}
                        </div>

                    </div>

                </div>

            </div>

            {/* 3. DOBRAS CUTÂNEAS */}
            <div className="card mb-4 shadow-sm">

                <div className="card-header bg-success text-white fw-bold">
                    Dobras Cutâneas (mm)
                </div>

                <div className="card-body">

                    <div className="row g-3">

                        <div className="col-md-3">
                            <strong>Tríceps:</strong> {avaliacao.triceps || "-"}
                        </div>

                        <div className="col-md-3">
                            <strong>Subescapular:</strong> {avaliacao.subescapular || "-"}
                        </div>

                        <div className="col-md-3">
                            <strong>Supra-ilíaca:</strong> {avaliacao.suprailiaca || "-"}
                        </div>

                        <div className="col-md-3">
                            <strong>Dobra Abdômen:</strong> {avaliacao.dobraAbdomen || "-"}
                        </div>

                    </div>

                </div>

            </div>

            {/* 4. OBSERVAÇÕES */}
            <div className="card mb-4 shadow-sm">

                <div className="card-header bg-dark text-white fw-bold">
                    Observações
                </div>

                <div className="card-body">

                    <p className="mb-0">
                        {avaliacao.observacao ||
                            "Nenhuma observação cadastrada para esta avaliação."}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default Avaliacoes;
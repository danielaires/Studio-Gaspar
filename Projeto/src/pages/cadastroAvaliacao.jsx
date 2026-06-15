import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarAvaliacao } from "../services/avaliacaoService"; 

function CadastroAvaliacao() {
    const navigate = useNavigate();

    // Inicia alunos como um array vazio por segurança
    const [alunos, setAlunos] = useState([]);

    const [avaliacao, setAvaliacao] = useState({
        alunoId: "",
        altura: "",
        peso: "",
        peito: "",
        abdomen: "",
        gluteo: "",
        bracoEsquerdo: "",
        bracoDireito: "",
        coxaEsquerda: "",
        coxaDireita: "",
        panturrilhaEsquerda: "",
        panturrilhaDireita: "",
        triceps: "",
        subescapular: "",
        suprailiaca: "",
        dobraAbdomen: "",
        observacao: ""
    });

    useEffect(() => {
        fetch('http://localhost:8080/alunos')
            .then(res => {
                if (!res.ok) {
                    throw new Error(`Erro HTTP! status: ${res.status}`);
                }
                return res.json();
            })
            .then(dados => {
                console.log("Alunos buscados do Java:", dados);
                // Verifica se dados é um array antes de setar o estado. 
                // Se for objeto (paginação), mude para: setAlunos(dados.content || []);
                if (Array.isArray(dados)) {
                    setAlunos(dados);
                } else if (dados && Array.isArray(dados.content)) {
                    setAlunos(dados.content);
                } else {
                    console.error("A API não retornou uma lista válida:", dados);
                    setAlunos([]);
                }
            })
            .catch(erro => {
                console.error("Erro ao buscar alunos para o Select:", erro);
                setAlunos([]); // Garante que não quebre a tela em caso de erro
            });
    }, []);

    function alterarCampo(e) {
        setAvaliacao({
            ...avaliacao,
            [e.target.name]: e.target.value
        });
    }

    function salvar(e) {
        e.preventDefault();

        if (!avaliacao.alunoId) {
            alert("Por favor, selecione um aluno para a avaliação.");
            return;
        }

        const payloadParaOJava = {
            ...avaliacao,
            aluno: { id: avaliacao.alunoId }
        };

        delete payloadParaOJava.alunoId;

        console.log("Enviando avaliação para o Java:", payloadParaOJava);

        salvarAvaliacao(payloadParaOJava)
            .then(() => {
                alert("Avaliação cadastrada com sucesso!");
                navigate("/"); 
            })
            .catch(error => {
                console.error("Erro ao salvar:", error);
                alert("Erro ao salvar a avaliação.");
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Nova Avaliação Física</h2>
            
            <form onSubmit={salvar}>
                
                {/* 1. DADOS BÁSICOS */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-primary text-white fw-bold">
                        Dados Básicos
                    </div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Aluno</label>
                                <select 
                                    className="form-select" 
                                    name="alunoId" 
                                    value={avaliacao.alunoId} 
                                    onChange={alterarCampo}
                                    required
                                >
                                    <option value="">Selecione o Aluno...</option>
                                    {/* Mapeamento seguro: só roda se alunos for um array e tiver itens */}
                                    {alunos && alunos.length > 0 ? (
                                        alunos.map(aluno => (
                                            <option key={aluno.id} value={aluno.id}>
                                                {aluno.nome}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Nenhum aluno encontrado/carregado</option>
                                    )}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Peso (kg)</label>
                                <input type="number" step="0.01" className="form-control" name="peso" onChange={alterarCampo} required />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Altura (m)</label>
                                <input type="number" step="0.01" className="form-control" name="altura" onChange={alterarCampo} required />
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
                        <div className="row g-3 mb-3">
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Peito</label>
                                <input type="number" step="0.01" className="form-control" name="peito" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Abdômen</label>
                                <input type="number" step="0.01" className="form-control" name="abdomen" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label fw-bold">Glúteo</label>
                                <input type="number" step="0.01" className="form-control" name="gluteo" onChange={alterarCampo} />
                            </div>
                        </div>

                        <div className="row g-3 mb-3">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Braço Esquerdo</label>
                                <input type="number" step="0.01" className="form-control" name="bracoEsquerdo" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">Braço Direito</label>
                                <input type="number" step="0.01" className="form-control" name="bracoDireito" onChange={alterarCampo} />
                            </div>
                        </div>

                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Coxa Esq.</label>
                                <input type="number" step="0.01" className="form-control" name="coxaEsquerda" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Coxa Dir.</label>
                                <input type="number" step="0.01" className="form-control" name="coxaDireita" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Panturrilha Esq.</label>
                                <input type="number" step="0.01" className="form-control" name="panturrilhaEsquerda" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Panturrilha Dir.</label>
                                <input type="number" step="0.01" className="form-control" name="panturrilhaDireita" onChange={alterarCampo} />
                            </div>
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
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Tríceps</label>
                                <input type="number" step="0.01" className="form-control" name="triceps" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Subescapular</label>
                                <input type="number" step="0.01" className="form-control" name="subescapular" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Supra-ilíaca</label>
                                <input type="number" step="0.01" className="form-control" name="suprailiaca" onChange={alterarCampo} />
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Abdômen</label>
                                <input type="number" step="0.01" className="form-control" name="dobraAbdomen" onChange={alterarCampo} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 4. OBSERVAÇÕES */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                        <label className="form-label fw-bold">Observações Gerais</label>
                        <textarea 
                            className="form-control" 
                            name="observacao" 
                            rows="4" 
                            maxLength="1000"
                            placeholder="Anote aqui informações relevantes, lesões, ou comentários sobre a avaliação..."
                            onChange={alterarCampo}
                        ></textarea>
                    </div>
                </div>

                {/* BOTÃO SALVAR ALINHADO À DIREITA */}
                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-success px-5 py-2">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CadastroAvaliacao;
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarAvaliacao } from "../services/avaliacaoService";

function CadastroAvaliacao() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);

    // Estado inicial com todos os campos da entidade
    const [avaliacao, setAvaliacao] = useState({
        alunoId: "",
        dataAvaliacao: new Date().toISOString().split('T')[0],
        altura: "", peso: "", peito: "", abdomen: "", gluteo: "",
        bracoEsquerdo: "", bracoDireito: "", coxaEsquerda: "", coxaDireita: "",
        panturrilhaEsquerda: "", panturrilhaDireita: "", triceps: "",
        subescapular: "", suprailiaca: "", dobraAbdomen: "", observacao: ""
    });

    useEffect(() => {
        fetch('http://localhost:8080/alunos')
            .then(res => res.json())
            .then(dados => setAlunos(Array.isArray(dados) ? dados : (dados.content || [])))
            .catch(erro => console.error("Erro ao buscar alunos:", erro));
    }, []);

    function alterarCampo(e) {
        setAvaliacao(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    function salvar(e) {
        e.preventDefault();

        // Garante que o alunoId exista e seja tratado como número para o Java
        if (!avaliacao.alunoId) {
            alert("Selecione um aluno antes de salvar.");
            return;
        }

        const payload = {
            ...avaliacao,
            aluno: { id: Number(avaliacao.alunoId) }
        };
        delete payload.alunoId;

        console.log("Enviando Payload:", payload); // Debug para conferir o ID no console (F12)

        salvarAvaliacao(payload)
            .then(() => {
                alert("Avaliação salva com sucesso!");
                navigate("/");
            })
            .catch(error => {
                console.error("Erro no envio:", error);
                alert("Erro ao salvar! Verifique o console para detalhes.");
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Nova Avaliação Física</h2>
            <form onSubmit={salvar}>
                {/* 1. DADOS BÁSICOS */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-primary text-white fw-bold">Dados Básicos</div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Aluno</label>
                                <select className="form-select" name="alunoId" value={avaliacao.alunoId} onChange={alterarCampo} required>
                                    <option value="">Selecione...</option>
                                    {alunos.map(a => <option key={a.id} value={a.id}>{a.nome}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3">
                                <label className="form-label fw-bold">Data</label>
                                <input type="date" className="form-control" name="dataAvaliacao" value={avaliacao.dataAvaliacao} onChange={alterarCampo} required />
                            </div>
                            <div className="col-md-3"><label className="fw-bold">Peso (kg)</label><input type="number" step="0.01" className="form-control" name="peso" value={avaliacao.peso} onChange={alterarCampo} required /></div>
                            <div className="col-md-3"><label className="fw-bold">Altura (m)</label><input type="number" step="0.01" className="form-control" name="altura" value={avaliacao.altura} onChange={alterarCampo} required /></div>
                        </div>
                    </div>
                </div>

                {/* 2. MEDIDAS E DOBRAS */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-secondary text-white fw-bold">Medidas e Dobras</div>
                    <div className="card-body">
                        <div className="row g-3 mb-3">
                            <div className="col-md-3"><label>Peito</label><input type="number" className="form-control" name="peito" value={avaliacao.peito} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Abdômen</label><input type="number" className="form-control" name="abdomen" value={avaliacao.abdomen} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Glúteo</label><input type="number" className="form-control" name="gluteo" value={avaliacao.gluteo} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Tríceps</label><input type="number" className="form-control" name="triceps" value={avaliacao.triceps} onChange={alterarCampo} /></div>
                        </div>
                        <div className="row g-3 mb-3">
                            <div className="col-md-3"><label>Braço Esq.</label><input type="number" className="form-control" name="bracoEsquerdo" value={avaliacao.bracoEsquerdo} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Braço Dir.</label><input type="number" className="form-control" name="bracoDireito" value={avaliacao.bracoDireito} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Coxa Esq.</label><input type="number" className="form-control" name="coxaEsquerda" value={avaliacao.coxaEsquerda} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Coxa Dir.</label><input type="number" className="form-control" name="coxaDireita" value={avaliacao.coxaDireita} onChange={alterarCampo} /></div>
                        </div>
                        <div className="row g-3">
                            <div className="col-md-3"><label>Panturrilha Esq.</label><input type="number" className="form-control" name="panturrilhaEsquerda" value={avaliacao.panturrilhaEsquerda} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Panturrilha Dir.</label><input type="number" className="form-control" name="panturrilhaDireita" value={avaliacao.panturrilhaDireita} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Subescapular</label><input type="number" className="form-control" name="subescapular" value={avaliacao.subescapular} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Suprailíaca</label><input type="number" className="form-control" name="suprailiaca" value={avaliacao.suprailiaca} onChange={alterarCampo} /></div>
                            <div className="col-md-4">
                                <label>Dobra Abdômen</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="dobraAbdomen"
                                    value={avaliacao.dobraAbdomen}
                                    onChange={alterarCampo}
                                />
                            </div>
                        </div>

                    </div>
                </div>

                {/* 3. OBSERVAÇÕES */}
                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-info text-white fw-bold">Observações</div>
                    <div className="card-body">
                        <textarea className="form-control" name="observacao" value={avaliacao.observacao} onChange={alterarCampo} rows="3"></textarea>
                    </div>
                </div>

                <button type="submit" className="btn btn-success px-5 py-2">Salvar</button>
            </form>
        </div>
    );
}
export default CadastroAvaliacao;
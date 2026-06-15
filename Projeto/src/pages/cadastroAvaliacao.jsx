import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarAvaliacao } from "../services/avaliacaoService"; 

function CadastroAvaliacao() {
    const navigate = useNavigate();
    const [alunos, setAlunos] = useState([]);
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
        // Criamos o objeto exatamente como a entidade espera
        const payload = { ...avaliacao, aluno: { id: avaliacao.alunoId } };
        delete payload.alunoId;

        salvarAvaliacao(payload)
            .then(() => { alert("Salvo com sucesso!"); navigate("/"); })
            .catch(error => {
                console.error("Erro completo:", error.response?.data || error);
                alert("Erro ao salvar! Verifique os dados.");
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <h2 className="mb-4">Nova Avaliação Física</h2>
            <form onSubmit={salvar}>
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
                            <div className="col-md-3"><label className="fw-bold">Peso</label><input type="number" step="0.01" className="form-control" name="peso" value={avaliacao.peso} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label className="fw-bold">Altura</label><input type="number" step="0.01" className="form-control" name="altura" value={avaliacao.altura} onChange={alterarCampo} /></div>
                        </div>
                    </div>
                </div>

                <div className="card mb-4 shadow-sm">
                    <div className="card-header bg-secondary text-white fw-bold">Medidas e Dobras</div>
                    <div className="card-body">
                        <div className="row g-3">
                            <div className="col-md-3"><label>Peito</label><input type="number" className="form-control" name="peito" value={avaliacao.peito} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Abdômen</label><input type="number" className="form-control" name="abdomen" value={avaliacao.abdomen} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Glúteo</label><input type="number" className="form-control" name="gluteo" value={avaliacao.gluteo} onChange={alterarCampo} /></div>
                            <div className="col-md-3"><label>Tríceps</label><input type="number" className="form-control" name="triceps" value={avaliacao.triceps} onChange={alterarCampo} /></div>
                        </div>
                    </div>
                </div>

                <button type="submit" className="btn btn-success px-5">Salvar Avaliação</button>
            </form>
        </div>
    );
}
export default CadastroAvaliacao;
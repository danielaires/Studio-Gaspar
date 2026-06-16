import { useState, useEffect } from "react";
import { salvarAluno } from "../services/alunoService";
import { listarHorarios } from "../services/horarioService"; // Certifique-se de ter este service
import { useNavigate } from "react-router-dom";

function CadastroAluno() {
    const navigate = useNavigate();
    const [horarios, setHorarios] = useState([]); // Estado para os horários
    
    const [aluno, setAluno] = useState({
        nome: "",
        dataNascimento: "",
        sexo: "",
        profissao: "",
        telefone: "",
        dataInicio: "",
        objetivo: "",
        horarioId: "", // Campo para controlar o select
        foto: "",
        ativo: true
    });

    // Carrega os horários ao abrir a tela
    useEffect(() => {
        listarHorarios()
            .then(res => setHorarios(res.data))
            .catch(err => console.error("Erro ao carregar horários:", err));
    }, []);

    function alterarCampo(e) {
        setAluno({ ...aluno, [e.target.name]: e.target.value });
    }

    function salvar(e) {
        e.preventDefault();
        
        // Estrutura necessária para o Hibernate entender a relação ManyToOne
        const payload = {
            ...aluno,
            horario: aluno.horarioId ? { id: Number(aluno.horarioId) } : null
        };
        
        // Removemos o campo auxiliar
        delete payload.horarioId;

        salvarAluno(payload)
            .then(() => {
                alert("Aluno cadastrado com sucesso!");
                navigate("/");
            })
            .catch(error => {
                console.error("Erro completo:", error);
                alert("Erro ao cadastrar aluno. Verifique o console (F12).");
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <h2>Novo Aluno</h2>
            <form onSubmit={salvar}>
                {/* Nome e Nascimento */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input className="form-control" name="nome" onChange={alterarCampo} required />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Data Nascimento</label>
                    <input type="date" className="form-control" name="dataNascimento" onChange={alterarCampo} required />
                </div>

                {/* Seleção de Horário (O ponto principal da correção) */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Horário de Treino</label>
                    <select className="form-select" name="horarioId" value={aluno.horarioId} onChange={alterarCampo} required>
                        <option value="">Selecione um horário...</option>
                        {horarios.map(h => (
                            <option key={h.id} value={h.id}>{h.descricao}</option>
                        ))}
                    </select>
                </div>

                {/* Sexo */}
                <div className="mb-3">
                    <label className="form-label d-block fw-bold">Sexo</label>
                    <div className="btn-group">
                        <input type="radio" className="btn-check" name="sexo" id="M" value="Masculino" checked={aluno.sexo === "Masculino"} onChange={alterarCampo} />
                        <label className="btn btn-outline-primary" htmlFor="M">Masculino</label>
                        <input type="radio" className="btn-check" name="sexo" id="F" value="Feminino" checked={aluno.sexo === "Feminino"} onChange={alterarCampo} />
                        <label className="btn btn-outline-primary" htmlFor="F">Feminino</label>
                    </div>
                </div>

                {/* Outros campos mantidos conforme original */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Profissão</label>
                    <input className="form-control" name="profissao" onChange={alterarCampo} />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Telefone</label>
                    <input className="form-control" name="telefone" onChange={alterarCampo} />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-bold">Data Início</label>
                    <input type="date" className="form-control" name="dataInicio" onChange={alterarCampo} required />
                </div>
                <div className="mb-4">
                    <label className="form-label d-block fw-bold">Objetivo</label>
                    <div className="d-flex flex-wrap gap-2">
                        {["Hipertrofia", "Emagrecimento", "Ganho de Massa Muscular", "Fortalecimento", "Força"].map(obj => (
                            <>
                                <input type="radio" className="btn-check" name="objetivo" id={obj} value={obj} checked={aluno.objetivo === obj} onChange={alterarCampo} />
                                <label className="btn btn-outline-secondary" htmlFor={obj}>{obj}</label>
                            </>
                        ))}
                    </div>
                </div>
                
                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-success px-5 py-2">Salvar</button>
                </div>
            </form>
        </div>
    );
}

export default CadastroAluno;
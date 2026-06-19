import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listarHorarios } from "../services/horarioService";
import api from "../services/api";

function EditarAluno() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [horarios, setHorarios] = useState([]);

    const [aluno, setAluno] = useState({
        nome: "",
        dataNascimento: "",
        sexo: "",
        profissao: "",
        telefone: "",
        dataInicio: "",
        objetivo: "",
        horarioId: "", // Campo auxiliar para o select
        foto: "",
        ativo: true
    });

    useEffect(() => {
        // 1. Carrega os horários para o select
        listarHorarios().then(res => setHorarios(res.data));

        // 2. Busca os dados do aluno para preencher o formulário
        api.get(`/alunos/${id}`)
            .then(res => {

                const dados = res.data;

                setAluno({
                    ...dados,
                    horarioId: dados.horario ? dados.horario.id : ""
                });

            })
            .catch(erro => {

                console.error("ERRO AO BUSCAR ALUNO:", erro);

                alert(erro.message);

            });
    }, [id, navigate]);

    function alterarCampo(e) {
        setAluno({ ...aluno, [e.target.name]: e.target.value });
    }

    function salvar(e) {
        e.preventDefault();

        const alunoAtualizado = {
            ...aluno,
            id: id,
            horario: aluno.horarioId ? { id: Number(aluno.horarioId) } : null,
            ativo: aluno.ativo !== undefined ? aluno.ativo : true
        };
        delete alunoAtualizado.horarioId;

        api.put(`/alunos/${id}`, alunoAtualizado)
            .then(() => {
                alert("Aluno atualizado com sucesso!");
                navigate("/");
            })
            .catch(error => console.error("Erro:", error));
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Editar Aluno</h2>
                <button onClick={() => navigate("/")} className="btn btn-outline-secondary">Voltar</button>
            </div>

            <form onSubmit={salvar}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input className="form-control" name="nome" value={aluno.nome || ""} onChange={alterarCampo} required />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Data Nascimento</label>
                    <input type="date" className="form-control" name="dataNascimento" value={aluno.dataNascimento || ""} onChange={alterarCampo} required />
                </div>

                {/* Campo Horário integrado */}
                <div className="mb-3">
                    <label className="form-label fw-bold">Horário de Treino</label>
                    <select className="form-select" name="horarioId" value={aluno.horarioId || ""} onChange={alterarCampo} required>
                        <option value="">Selecione um horário...</option>
                        {horarios.map(h => (
                            <option key={h.id} value={h.id}>{h.descricao}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label d-block fw-bold">Sexo</label>
                    <div className="btn-group">
                        <input type="radio" className="btn-check" name="sexo" id="editM" value="Masculino" checked={aluno.sexo === "Masculino"} onChange={alterarCampo} />
                        <label className="btn btn-outline-primary" htmlFor="editM">Masculino</label>
                        <input type="radio" className="btn-check" name="sexo" id="editF" value="Feminino" checked={aluno.sexo === "Feminino"} onChange={alterarCampo} />
                        <label className="btn btn-outline-primary" htmlFor="editF">Feminino</label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Profissão</label>
                    <input className="form-control" name="profissao" value={aluno.profissao || ""} onChange={alterarCampo} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Telefone</label>
                    <input className="form-control" name="telefone" value={aluno.telefone || ""} onChange={alterarCampo} />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Data Início</label>
                    <input type="date" className="form-control" name="dataInicio" value={aluno.dataInicio || ""} onChange={alterarCampo} required />
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

                <div className="mb-4">
                    <div className="form-check form-switch">
                        <input className="form-check-input" type="checkbox" id="ativoSwitch" name="ativo" checked={aluno.ativo} onChange={(e) => setAluno({ ...aluno, ativo: e.target.checked })} />
                        <label className="form-check-label fw-bold" htmlFor="ativoSwitch">Aluno Ativo</label>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">Atualizar</button>
                </div>
            </form>
        </div>
    );
}

export default EditarAluno;
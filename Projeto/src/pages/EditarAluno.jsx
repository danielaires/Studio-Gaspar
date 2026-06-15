import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function EditarAluno() {
    const navigate = useNavigate();
    
    // Pega o ID que passamos na URL pelo botão "Editar"
    const { id } = useParams(); 

    const [aluno, setAluno] = useState({
        nome: "",
        dataNascimento: "",
        sexo: "",
        profissao: "",
        telefone: "",
        dataInicio: "",
        objetivo: "",
        foto: "",
        ativo: true
    });

    // Busca os dados atuais do aluno assim que a tela abre
    useEffect(() => {
        fetch(`http://localhost:8080/alunos/${id}`)
            .then(res => {
                if (!res.ok) throw new Error("Erro ao buscar os dados do aluno");
                return res.json();
            })
            .then(dados => setAluno(dados))
            .catch(erro => {
                console.error(erro);
                alert("Erro ao carregar aluno. Verifique se o ID existe.");
                navigate("/");
            });
    }, [id, navigate]);

    function alterarCampo(e){
        setAluno({
            ...aluno,
            [e.target.name]: e.target.value
        });
    }

    function salvar(e){
        e.preventDefault();

        // Garante que o ID está no objeto e que o Ativo é um valor booleano válido
        const alunoAtualizado = {
            ...aluno,
            id: id,
            ativo: aluno.ativo !== undefined ? aluno.ativo : true
        };

        // URL CORRIGIDA: Agora envia para /alunos/{id}
        fetch(`http://localhost:8080/alunos/${id}`, {
            method: 'PUT', // Método de atualização
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(alunoAtualizado)
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro ao atualizar o aluno no servidor");
            alert("Aluno atualizado com sucesso!");
            navigate("/"); // Volta pra tela de listagem
        })
        .catch(error => {
            console.error("Erro:", error);
            alert("Erro ao atualizar aluno. Veja o console (F12).");
        });
    }

    return (
        <div className="container mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Editar Aluno</h2>
                <button onClick={() => navigate("/")} className="btn btn-outline-secondary">
                    Voltar
                </button>
            </div>
            
            <form onSubmit={salvar}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                        className="form-control"
                        name="nome"
                        value={aluno.nome || ""}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Data Nascimento</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dataNascimento"
                        value={aluno.dataNascimento || ""}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                {/* CAMPO SEXO */}
                <div className="mb-3">
                    <label className="form-label d-block fw-bold">Sexo</label>
                    <div className="btn-group" role="group">
                        <input
                            type="radio"
                            className="btn-check"
                            name="sexo"
                            id="editSexoMasculino"
                            value="Masculino"
                            checked={aluno.sexo === "Masculino"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-primary" htmlFor="editSexoMasculino">Masculino</label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="sexo"
                            id="editSexoFeminino"
                            value="Feminino"
                            checked={aluno.sexo === "Feminino"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-primary" htmlFor="editSexoFeminino">Feminino</label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Profissão</label>
                    <input
                        className="form-control"
                        name="profissao"
                        value={aluno.profissao || ""}
                        onChange={alterarCampo}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Telefone</label>
                    <input
                        className="form-control"
                        name="telefone"
                        value={aluno.telefone || ""}
                        onChange={alterarCampo}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Data Início</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dataInicio"
                        value={aluno.dataInicio || ""}
                        onChange={alterarCampo}
                        required
                    />
                </div>

                {/* CAMPO OBJETIVO */}
                <div className="mb-4">
                    <label className="form-label d-block fw-bold">Objetivo</label>
                    <div className="d-flex flex-wrap gap-2" role="group">
                        <input type="radio" className="btn-check" name="objetivo" id="editObjHipertrofia" value="Hipertrofia" checked={aluno.objetivo === "Hipertrofia"} onChange={alterarCampo} />
                        <label className="btn btn-outline-secondary" htmlFor="editObjHipertrofia">Hipertrofia</label>

                        <input type="radio" className="btn-check" name="objetivo" id="editObjEmagrecimento" value="Emagrecimento" checked={aluno.objetivo === "Emagrecimento"} onChange={alterarCampo} />
                        <label className="btn btn-outline-secondary" htmlFor="editObjEmagrecimento">Emagrecimento</label>

                        <input type="radio" className="btn-check" name="objetivo" id="editObjMassaMuscular" value="Ganho de Massa Muscular" checked={aluno.objetivo === "Ganho de Massa Muscular"} onChange={alterarCampo} />
                        <label className="btn btn-outline-secondary" htmlFor="editObjMassaMuscular">Ganho de Massa Muscular</label>

                        <input type="radio" className="btn-check" name="objetivo" id="editObjFortalecimento" value="Fortalecimento" checked={aluno.objetivo === "Fortalecimento"} onChange={alterarCampo} />
                        <label className="btn btn-outline-secondary" htmlFor="editObjFortalecimento">Fortalecimento</label>

                        <input type="radio" className="btn-check" name="objetivo" id="editObjForca" value="Força" checked={aluno.objetivo === "Força"} onChange={alterarCampo} />
                        <label className="btn btn-outline-secondary" htmlFor="editObjForca">Força</label>
                    </div>
                </div>

                {/* STATUS ATIVO/INATIVO */}
                <div className="mb-4">
                    <div className="form-check form-switch">
                        <input 
                            className="form-check-input" 
                            type="checkbox" 
                            role="switch" 
                            id="ativoSwitch"
                            name="ativo"
                            // Trava de segurança: se for nulo, marca como falso para o React não reclamar
                            checked={aluno.ativo || false} 
                            onChange={(e) => setAluno({...aluno, ativo: e.target.checked})}
                        />
                        <label className="form-check-label fw-bold" htmlFor="ativoSwitch">
                            Aluno Ativo no Sistema
                        </label>
                    </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                    <button type="submit" className="btn btn-primary px-5 py-2 fw-bold">
                        Atualizar Aluno
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditarAluno;
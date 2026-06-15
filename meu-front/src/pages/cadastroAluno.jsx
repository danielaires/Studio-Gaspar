import { useState } from "react";
import { salvarAluno } from "../services/alunoService";
import { useNavigate } from "react-router-dom";

function CadastroAluno() {
    const navigate = useNavigate();

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

    function alterarCampo(e){
        setAluno({
            ...aluno,
            [e.target.name]: e.target.value
        });
    }

    function salvar(e){
        e.preventDefault();
        
        // Validação simples para garantir que os botões foram selecionados
        if (!aluno.sexo) {
            alert("Por favor, selecione o sexo do aluno.");
            return;
        }
        if (!aluno.objetivo) {
            alert("Por favor, selecione o objetivo do aluno.");
            return;
        }

        // Forçamos o 'ativo: true' no objeto antes de mandar pro Java
        const alunoParaSalvar = {
            ...aluno,
            ativo: true
        };

        salvarAluno(alunoParaSalvar)
            .then(() => {
                alert("Aluno cadastrado com sucesso!");
                navigate("/");
            })
            .catch(error => {
                console.log(error);
                alert("Erro ao cadastrar aluno. Veja o console (F12).");
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <h2>Novo Aluno</h2>
            <form onSubmit={salvar}>
                <div className="mb-3">
                    <label className="form-label fw-bold">Nome</label>
                    <input
                        className="form-control"
                        name="nome"
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
                        onChange={alterarCampo}
                        required
                    />
                </div>

                {/* CAMPO SEXO TRANSFORMA-SE EM BOTÕES */}
                <div className="mb-3">
                    <label className="form-label d-block fw-bold">Sexo</label>
                    <div className="btn-group" role="group" aria-label="Seleção de Sexo">
                        <input
                            type="radio"
                            className="btn-check"
                            name="sexo"
                            id="sexoMasculino"
                            value="Masculino"
                            checked={aluno.sexo === "Masculino"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-primary" htmlFor="sexoMasculino">
                            Masculino
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="sexo"
                            id="sexoFeminino"
                            value="Feminino"
                            checked={aluno.sexo === "Feminino"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-primary" htmlFor="sexoFeminino">
                            Feminino
                        </label>
                    </div>
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Profissão</label>
                    <input
                        className="form-control"
                        name="profissao"
                        onChange={alterarCampo}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Telefone</label>
                    <input
                        className="form-control"
                        name="telefone"
                        onChange={alterarCampo}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label fw-bold">Data Início</label>
                    <input
                        type="date"
                        className="form-control"
                        name="dataInicio"
                        onChange={alterarCampo}
                        required
                    />
                </div>

                {/* CAMPO OBJETIVO TRANSFORMA-SE EM BOTÕES */}
                <div className="mb-4">
                    <label className="form-label d-block fw-bold">Objetivo</label>
                    <div className="d-flex flex-wrap gap-2" role="group" aria-label="Seleção de Objetivo">
                        
                        <input
                            type="radio"
                            className="btn-check"
                            name="objetivo"
                            id="objHipertrofia"
                            value="Hipertrofia"
                            checked={aluno.objetivo === "Hipertrofia"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="objHipertrofia">
                            Hipertrofia
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="objetivo"
                            id="objEmagrecimento"
                            value="Emagrecimento"
                            checked={aluno.objetivo === "Emagrecimento"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="objEmagrecimento">
                            Emagrecimento
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="objetivo"
                            id="objMassaMuscular"
                            value="Ganho de Massa Muscular"
                            checked={aluno.objetivo === "Ganho de Massa Muscular"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="objMassaMuscular">
                            Ganho de Massa Muscular
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="objetivo"
                            id="objFortalecimento"
                            value="Fortalecimento"
                            checked={aluno.objetivo === "Fortalecimento"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="objFortalecimento">
                            Fortalecimento
                        </label>

                        <input
                            type="radio"
                            className="btn-check"
                            name="objetivo"
                            id="objForca"
                            value="Força"
                            checked={aluno.objetivo === "Força"}
                            onChange={alterarCampo}
                        />
                        <label className="btn btn-outline-secondary" htmlFor="objForca">
                            Força
                        </label>
                        
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

export default CadastroAluno;
import { useState, useEffect } from "react";
import { salvarAluno } from "../services/alunoService";
import { listarHorarios } from "../services/horarioService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function CadastroAluno() {

    const navigate = useNavigate();

    const [horarios, setHorarios] = useState([]);

    const [aluno, setAluno] = useState({
        nome: "",
        dataNascimento: "",
        sexo: "",
        profissao: "",
        telefone: "",
        dataInicio: "",
        objetivo: "",
        horarioId: "",
        foto: "",
        ativo: true
    });

    useEffect(() => {

        listarHorarios()
            .then((res) => {

                setHorarios(res.data);

            })
            .catch((err) => {

                console.error(
                    "Erro ao carregar horários:",
                    err
                );

            });

    }, []);

    function alterarCampo(e) {

        setAluno({
            ...aluno,
            [e.target.name]: e.target.value
        });

    }

    function salvar(e) {

        e.preventDefault();

        const payload = {

            ...aluno,

            horario: aluno.horarioId
                ? {
                    id: Number(aluno.horarioId)
                }
                : null

        };

        delete payload.horarioId;

        salvarAluno(payload)
            .then(() => {

                alert(
                    "Aluno cadastrado com sucesso!"
                );

                navigate("/");

            })
            .catch((error) => {

                console.error(error);

                alert(
                    "Erro ao cadastrar aluno."
                );

            });
    }

    return (

        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div className="mb-4">

                    <h2 className="fw-bold mb-1">
                        Cadastro de Aluno
                    </h2>

                    <p className="text-muted">
                        Cadastro de novos alunos da academia.
                    </p>

                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow border-0">

                        <div className="card-header bg-dark text-white fw-bold">
                            Dados do Aluno
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Nome
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nome"
                                        value={aluno.nome}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Data Nascimento
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dataNascimento"
                                        value={aluno.dataNascimento}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Telefone
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="telefone"
                                        value={aluno.telefone}
                                        onChange={alterarCampo}
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Profissão
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="profissao"
                                        value={aluno.profissao}
                                        onChange={alterarCampo}
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Horário de Treino
                                    </label>

                                    <select
                                        className="form-select"
                                        name="horarioId"
                                        value={aluno.horarioId}
                                        onChange={alterarCampo}
                                        required
                                    >

                                        <option value="">
                                            Selecione um horário...
                                        </option>

                                        {horarios.map((h) => (

                                            <option
                                                key={h.id}
                                                value={h.id}
                                            >
                                                {h.descricao}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Data Início
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dataInicio"
                                        value={aluno.dataInicio}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold d-block">
                                        Sexo
                                    </label>

                                    <div className="btn-group w-100">

                                        <button
                                            type="button"
                                            className={
                                                aluno.sexo === "Masculino"
                                                    ? "btn btn-primary"
                                                    : "btn btn-outline-primary"
                                            }
                                            onClick={() =>
                                                setAluno({
                                                    ...aluno,
                                                    sexo: "Masculino"
                                                })
                                            }
                                        >
                                            Masculino
                                        </button>

                                        <button
                                            type="button"
                                            className={
                                                aluno.sexo === "Feminino"
                                                    ? "btn btn-danger"
                                                    : "btn btn-outline-danger"
                                            }
                                            onClick={() =>
                                                setAluno({
                                                    ...aluno,
                                                    sexo: "Feminino"
                                                })
                                            }
                                        >
                                            Feminino
                                        </button>

                                    </div>

                                </div>

                                <div className="col-md-12">

                                    <label className="form-label fw-bold d-block">
                                        Objetivo
                                    </label>

                                    <div className="d-flex flex-wrap gap-2">

                                        {[
                                            "Hipertrofia",
                                            "Emagrecimento",
                                            "Ganho de Massa Muscular",
                                            "Fortalecimento",
                                            "Força"
                                        ].map((obj) => (

                                            <button
                                                key={obj}
                                                type="button"
                                                className={
                                                    aluno.objetivo === obj
                                                        ? "btn btn-success rounded-pill"
                                                        : "btn btn-outline-success rounded-pill"
                                                }
                                                onClick={() =>
                                                    setAluno({
                                                        ...aluno,
                                                        objetivo: obj
                                                    })
                                                }
                                            >
                                                {obj}
                                            </button>

                                        ))}

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-3">

                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={() => navigate("/")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success px-5"
                        >
                            Salvar
                        </button>

                    </div>

                </form>

            </div>

        </>
    );
}

export default CadastroAluno;
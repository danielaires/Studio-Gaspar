import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { listarHorarios } from "../services/horarioService";
import api from "../services/api";
import { showSuccess, showError } from "../services/notificationService";

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
        horarioId: "",
        foto: "",
        ativo: true,
    });

    useEffect(() => {
        listarHorarios()
            .then((res) => setHorarios(res.data))
            .catch((erro) => console.error(erro));

        api.get(`/alunos/${id}`)
            .then((res) => {
                const dados = res.data;
                const sexoFormatado =
                    dados.sexo === "M" || dados.sexo === "m"
                        ? "Masculino"
                        : dados.sexo === "F" || dados.sexo === "f"
                        ? "Feminino"
                        : dados.sexo || "";

                setAluno({
                    ...dados,
                    sexo: sexoFormatado,
                    horarioId: dados.horario ? dados.horario.id : "",
                });
            })
            .catch((erro) => {
                console.error("ERRO AO BUSCAR ALUNO:", erro);
                showError("Erro ao carregar dados do aluno!");
            });
    }, [id]);

    function formatarTelefone(value) {
        const apenasNumeros = value.replace(/\D/g, "");

        if (apenasNumeros.length <= 2) {
            return apenasNumeros;
        }

        if (apenasNumeros.length <= 7) {
            return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
        }

        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }

    function alterarCampo(e) {
        const { name, value } = e.target;

        if (name === "telefone") {
            setAluno((prev) => ({ ...prev, telefone: formatarTelefone(value) }));
            return;
        }

        setAluno((prev) => ({ ...prev, [name]: value }));
    }

    function validarCampos() {
        if (!aluno.nome?.trim()) {
            showError("Informe o nome do aluno.");
            return false;
        }

        if (!aluno.dataNascimento) {
            showError("Informe a data de nascimento.");
            return false;
        }

        if (!aluno.sexo) {
            showError("Selecione o sexo do aluno.");
            return false;
        }

        if (!aluno.dataInicio) {
            showError("Informe a data de início do treino.");
            return false;
        }

        if (!aluno.horarioId) {
            showError("Selecione um horário de treino.");
            return false;
        }

        return true;
    }

    function salvar(e) {
        e.preventDefault();

        if (!validarCampos()) {
            return;
        }

        const alunoAtualizado = {
            ...aluno,
            id,
            horario: aluno.horarioId
                ? { id: Number(aluno.horarioId) }
                : null,
            ativo:
                aluno.ativo !== undefined
                    ? aluno.ativo
                    : true,
        };

        delete alunoAtualizado.horarioId;

        api.put(`/alunos/${id}`, alunoAtualizado)
            .then(() => {
                showSuccess("Aluno atualizado com sucesso!");
                navigate("/");
            })
            .catch((error) => {
                console.error(error);
                showError("Erro ao atualizar aluno!");
            });
    }

    return (
        <div className="container py-4">
            <div className="card shadow border-0">
                <div className="card-body p-4">

                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="fw-bold mb-0">
                            Editar Aluno
                        </h2>

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/")}
                        >
                            Voltar
                        </button>
                    </div>

                    <form onSubmit={salvar}>
                        <div className="row g-3">

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Nome
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="nome"
                                    value={aluno.nome || ""}
                                    onChange={alterarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Data de Nascimento
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="dataNascimento"
                                    value={aluno.dataNascimento || ""}
                                    onChange={alterarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Telefone
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="telefone"
                                    value={aluno.telefone || ""}
                                    onChange={alterarCampo}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Profissão
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="profissao"
                                    value={aluno.profissao || ""}
                                    onChange={alterarCampo}
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold">
                                    Horário de Treino
                                </label>

                                <select
                                    className="form-select"
                                    name="horarioId"
                                    value={aluno.horarioId || ""}
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
                                <label className="form-label fw-semibold">
                                    Data de Início
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="dataInicio"
                                    value={aluno.dataInicio || ""}
                                    onChange={alterarCampo}
                                    required
                                />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold d-block">
                                    Sexo
                                </label>

                                <div className="btn-group w-100">
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="sexo"
                                        id="masculino"
                                        value="Masculino"
                                        checked={
                                            aluno.sexo === "Masculino"
                                        }
                                        onChange={alterarCampo}
                                    />

                                    <label
                                        className="btn btn-outline-primary"
                                        htmlFor="masculino"
                                    >
                                        Masculino
                                    </label>

                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="sexo"
                                        id="feminino"
                                        value="Feminino"
                                        checked={
                                            aluno.sexo === "Feminino"
                                        }
                                        onChange={alterarCampo}
                                    />

                                    <label
                                        className="btn btn-outline-primary"
                                        htmlFor="feminino"
                                    >
                                        Feminino
                                    </label>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <label className="form-label fw-semibold d-block">
                                    Status
                                </label>

                                <div className="form-check form-switch fs-5">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="ativoSwitch"
                                        checked={aluno.ativo}
                                        onChange={(e) =>
                                            setAluno({
                                                ...aluno,
                                                ativo:
                                                    e.target.checked,
                                            })
                                        }
                                    />

                                    <label
                                        className="form-check-label"
                                        htmlFor="ativoSwitch"
                                    >
                                        Aluno Ativo
                                    </label>
                                </div>
                            </div>
                        </div>

                        <hr className="my-4" />

                        <label className="form-label fw-semibold">
                            Objetivo
                        </label>

                        <div className="d-flex flex-wrap gap-2">
                            {[
                                "Hipertrofia",
                                "Emagrecimento",
                                "Ganho de Massa Muscular",
                                "Fortalecimento",
                                "Força",
                            ].map((obj) => (
                                <div key={obj}>
                                    <input
                                        type="radio"
                                        className="btn-check"
                                        name="objetivo"
                                        id={obj}
                                        value={obj}
                                        checked={
                                            aluno.objetivo === obj
                                        }
                                        onChange={alterarCampo}
                                    />

                                    <label
                                        className="btn btn-outline-secondary rounded-pill"
                                        htmlFor={obj}
                                    >
                                        {obj}
                                    </label>
                                </div>
                            ))}
                        </div>

                        <div className="d-flex justify-content-end mt-5">
                            <button
                                type="submit"
                                className="btn btn-primary btn-lg px-5"
                            >
                                Atualizar
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}

export default EditarAluno;
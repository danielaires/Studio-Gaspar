import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarMensalidade } from "../services/mensalidadesService";
import api from "../services/api";
import Navbar from "../components/Navbar";
import { showSuccess, showError, showWarning } from "../services/notificationService";

function CadastroMensalidade() {

    const navigate = useNavigate();

    const hoje = new Date()
        .toISOString()
        .split("T")[0];

    const [alunos, setAlunos] = useState([]);

    const [mensalidade, setMensalidade] = useState({
        alunoId: "",
        valor: "",
        vencimento: hoje,
        pagamento: "",
        status: "PENDENTE"
    });

    useEffect(() => {

        api.get("/alunos")
            .then((response) => {

                setAlunos(response.data);

            })
            .catch((error) => {

                console.error(
                    "ERRO AO CARREGAR ALUNOS:",
                    error
                );

            });

    }, []);

    function alterarCampo(e) {

        const { name, value } = e.target;

        let novaMensalidade = {
            ...mensalidade,
            [name]: value
        };

        if (name === "status") {

            if (value === "PAGO") {

                novaMensalidade.pagamento = hoje;

            } else {

                novaMensalidade.pagamento = "";

            }
        }

        setMensalidade(novaMensalidade);
    }

    function salvar(e) {

        e.preventDefault();

        if (!mensalidade.alunoId) {

            showWarning("Selecione um aluno.");

            return;
        }

        const payload = {

            valor: Number(mensalidade.valor),
            vencimento: mensalidade.vencimento,
            pagamento: mensalidade.pagamento || null,
            status: mensalidade.status,

            aluno: {
                id: Number(mensalidade.alunoId)
            }
        };

        salvarMensalidade(payload)
            .then(() => {

                showSuccess("Mensalidade cadastrada com sucesso!");
                navigate("/");

            })
            .catch((err) => {

                console.error(err);
                showError("Erro ao salvar mensalidade.");

            });
    }

    return (

        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div className="mb-4">

                    <h2 className="fw-bold mb-1">
                        Cadastro de Mensalidade
                    </h2>

                    <p className="text-muted">
                        Controle financeiro e mensalidades dos alunos.
                    </p>

                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow border-0">

                        <div className="card-header bg-dark text-white fw-bold">
                            Dados da Mensalidade
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Aluno
                                    </label>

                                    <select
                                        className="form-select"
                                        name="alunoId"
                                        value={mensalidade.alunoId}
                                        onChange={alterarCampo}
                                        required
                                    >

                                        <option value="">
                                            Selecione um aluno...
                                        </option>

                                        {alunos.map((aluno) => (

                                            <option
                                                key={aluno.id}
                                                value={aluno.id}
                                            >
                                                {aluno.nome}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Valor (R$)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        className="form-control"
                                        name="valor"
                                        value={mensalidade.valor}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label fw-bold">
                                        Vencimento
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="vencimento"
                                        value={mensalidade.vencimento}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label fw-bold">
                                        Data do Pagamento
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="pagamento"
                                        value={mensalidade.pagamento}
                                        onChange={alterarCampo}
                                    />

                                </div>

                                <div className="col-md-4">

                                    <label className="form-label fw-bold">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        name="status"
                                        value={mensalidade.status}
                                        onChange={alterarCampo}
                                    >

                                        <option value="PENDENTE">
                                            Pendente
                                        </option>

                                        <option value="PAGO">
                                            Pago
                                        </option>

                                        <option value="ATRASADO">
                                            Atrasado
                                        </option>

                                    </select>

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

export default CadastroMensalidade;
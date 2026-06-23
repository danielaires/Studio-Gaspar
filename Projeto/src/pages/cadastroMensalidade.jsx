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

                <div
                    className="p-4 rounded mb-4 text-white"
                    style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                >
                    <h2 className="fw-bold mb-1"> Cadastro de Mensalidade</h2>
                    <p className="mb-0">Controle financeiro e mensalidades dos alunos</p>
                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow border-0 mb-4">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                        >
                             Dados da Mensalidade
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="alunoId"
                                            name="alunoId"
                                            value={mensalidade.alunoId}
                                            onChange={alterarCampo}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {alunos.map((aluno) => (
                                                <option key={aluno.id} value={aluno.id}>
                                                    {aluno.nome}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="alunoId"> Aluno</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            step="0.01"
                                            min="0"
                                            className="form-control"
                                            id="valor"
                                            name="valor"
                                            value={mensalidade.valor}
                                            onChange={alterarCampo}
                                            placeholder="0.00"
                                            required
                                        />
                                        <label htmlFor="valor"> Valor (R$)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="vencimento"
                                            name="vencimento"
                                            value={mensalidade.vencimento}
                                            onChange={alterarCampo}
                                            required
                                        />
                                        <label htmlFor="vencimento"> Data de Vencimento</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="pagamento"
                                            name="pagamento"
                                            value={mensalidade.pagamento}
                                            onChange={alterarCampo}
                                        />
                                        <label htmlFor="pagamento"> Data do Pagamento</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="status"
                                            name="status"
                                            value={mensalidade.status}
                                            onChange={alterarCampo}
                                        >
                                            <option value="PENDENTE"> Pendente</option>
                                            <option value="PAGO"> Pago</option>
                                            <option value="ATRASADO"> Atrasado</option>
                                        </select>
                                        <label htmlFor="status"> Status</label>
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

export default CadastroMensalidade;
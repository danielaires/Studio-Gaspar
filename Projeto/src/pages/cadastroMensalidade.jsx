
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { salvarMensalidade } from "../services/mensalidadeService";

function CadastroMensalidade() {
    const navigate = useNavigate();
    const hoje = new Date().toISOString().split("T")[0];

    const [alunos, setAlunos] = useState([]);

    const [mensalidade, setMensalidade] = useState({
        alunoId: "",
        valor: "",
        vencimento: hoje,
        pagamento: "",
        status: "PENDENTE"
    });

    useEffect(() => {
        fetch("http://localhost:8080/alunos")
            .then(res => res.json())
            .then(dados => {
                setAlunos(Array.isArray(dados) ? dados : (dados.content || []));
            })
            .catch(err => console.error(err));
    }, []);

    function alterarCampo(e) {

        const { name, value } = e.target;

        let novaMensalidade = {
            ...mensalidade,
            [name]: value
        };

        // Preenche automaticamente a data de pagamento quando marcar como pago
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
            alert("Selecione um aluno.");
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
                alert("Mensalidade cadastrada com sucesso!");
                navigate("/");
            })
            .catch((err) => {
                console.error(err);
                alert("Erro ao salvar mensalidade.");
            });
    }

    return (
        <div className="container mt-5 mb-5">

            <h2 className="mb-4">
                💰 Cadastro de Mensalidade
            </h2>

            <form onSubmit={salvar}>

                <div className="card shadow-sm">

                    <div className="card-header bg-primary text-white fw-bold">
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
                                        🟡 Pendente
                                    </option>

                                    <option value="PAGO">
                                        🟢 Pago
                                    </option>

                                    <option value="ATRASADO">
                                        🔴 Atrasado
                                    </option>
                                </select>
                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-4 d-flex justify-content-end gap-2">

                    <button
                        type="button"
                        className="btn btn-secondary px-4"
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
    );
}

export default CadastroMensalidade;


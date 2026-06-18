import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    buscarMensalidade,
    atualizarMensalidade
} from "../services/mensalidadesService";

function EditarMensalidade() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [mensalidade, setMensalidade] = useState({
        valor: "",
        vencimento: "",
        pagamento: "",
        status: "PENDENTE"
    });

    useEffect(() => {

        buscarMensalidade(id)
            .then((response) => {

                const dados = response.data;

                setMensalidade({
                    valor: dados.valor || "",
                    vencimento: dados.vencimento || "",
                    pagamento: dados.pagamento || "",
                    status: dados.status || "PENDENTE"
                });

            })
            .catch((erro) => {

                console.error(erro);

                alert("Erro ao carregar mensalidade.");

            });

    }, [id]);

    function alterarCampo(e) {

        const { name, value } = e.target;

        setMensalidade({
            ...mensalidade,
            [name]: value
        });
    }

    async function salvar(e) {

        e.preventDefault();

        try {

            await atualizarMensalidade(
                id,
                mensalidade
            );

            alert(
                "Mensalidade atualizada com sucesso!"
            );

            navigate(-1);

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao atualizar mensalidade."
            );

        }
    }

    return (

        <div className="container mt-5">

            <h2 className="mb-4">
                Editar Mensalidade
            </h2>

            <form onSubmit={salvar}>

                <div className="card shadow">

                    <div className="card-header bg-warning fw-bold">
                        Dados da Mensalidade
                    </div>

                    <div className="card-body">

                        <div className="row g-3">

                            <div className="col-md-4">

                                <label className="form-label">
                                    Valor
                                </label>

                                <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="valor"
                                    value={mensalidade.valor}
                                    onChange={alterarCampo}
                                    required
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
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

                                <label className="form-label">
                                    Pagamento
                                </label>

                                <input
                                    type="date"
                                    className="form-control"
                                    name="pagamento"
                                    value={mensalidade.pagamento || ""}
                                    onChange={alterarCampo}
                                />

                            </div>

                            <div className="col-md-4">

                                <label className="form-label">
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

                                    <option value="VENCIDO">
                                        Vencido
                                    </option>

                                </select>

                            </div>

                        </div>

                    </div>

                </div>

                <div className="mt-4 d-flex gap-2">

                    <button
                        type="submit"
                        className="btn btn-success"
                    >
                        Salvar Alterações
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        Cancelar
                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditarMensalidade;
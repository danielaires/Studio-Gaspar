import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { listarMensalidadesDoAluno } from "../services/mensalidadesService";

function MensalidadesAluno() {

    const { id } = useParams();

    const [mensalidades, setMensalidades] = useState([]);
    const [carregando, setCarregando] = useState(true);

    const formatarData = (data) => {

        if (!data) return "-";

        const partes = data.split("-");

        return `${partes[2]}/${partes[1]}/${partes[0]}`;

    };

    const formatarValor = (valor) => {

        if (valor == null) return "-";

        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    };

    const estaVencida = (mensalidade) => {

        if (mensalidade.status === "ATRASADO" || mensalidade.status === "VENCIDO") {
            return true;
        }

        if (mensalidade.status !== "PENDENTE" || !mensalidade.vencimento) {
            return false;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const vencimento = new Date(`${mensalidade.vencimento}T00:00:00`);
        return vencimento < hoje;
    };

    const renderizarStatus = (mensalidade) => {

        const status = mensalidade.status;

        if (status === "PAGO") {
            return (
                <span className="badge bg-success">
                    Pago
                </span>
            );
        }

        if (estaVencida(mensalidade)) {
            return (
                <span className="badge bg-danger">
                    Vencido
                </span>
            );
        }

        if (status === "PENDENTE") {
            return (
                <span className="badge bg-warning text-dark">
                    Pendente
                </span>
            );
        }

        if (status === "ATRASADO" || status === "VENCIDO") {
            return (
                <span className="badge bg-danger">
                    Vencido
                </span>
            );
        }

        return (
            <span className="badge bg-secondary">
                {status || "-"}
            </span>
        );
    };

    useEffect(() => {

        listarMensalidadesDoAluno(id)
            .then((resposta) => {

                const dados = resposta.data || resposta;

                setMensalidades(Array.isArray(dados) ? dados : []);

                setCarregando(false);

            })
            .catch((erro) => {

                console.log(erro);

                setCarregando(false);

            });

    }, [id]);

    return (

        <div className="container mt-4 mb-5">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Mensalidades do Aluno</h2>

                <Link
                    to="/"
                    className="btn btn-secondary fw-bold"
                >
                    Voltar
                </Link>

            </div>

            {carregando ? (

                <p>Carregando mensalidades...</p>

            ) : mensalidades.length === 0 ? (

                <div className="alert alert-info">

                    Nenhuma mensalidade encontrada.

                </div>

            ) : (

                <div className="table-responsive shadow-sm rounded">

                    <table className="table table-striped table-hover">

                        <thead className="table-dark">

                            <tr>

                                <th>ID</th>
                                <th>Vencimento</th>
                                <th>Pagamento</th>
                                <th>Valor</th>
                                <th>Status</th>

                            </tr>

                        </thead>

                        <tbody>

                            {mensalidades.map((m) => (

                                <tr key={m.id}>

                                    <td>{m.id}</td>

                                    <td>
                                        {formatarData(m.vencimento)}
                                    </td>

                                    <td>
                                        {formatarData(m.pagamento)}
                                    </td>

                                    <td>
                                        {formatarValor(m.valor)}
                                    </td>

                                    <td>
                                        {renderizarStatus(m)}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    );

}

export default MensalidadesAluno;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
    listarMensalidadesDoAluno,
    marcarComoPago,
    excluirMensalidade as excluirMensalidadeService
} from "../services/mensalidadesService";
import {
  showSuccess,
  showError,
  showInfo,
  showConfirmation,
} from "../services/notificationService";

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

    const normalizarStatus = (status) => {

        return (status || "")
            .toString()
            .trim()
            .toUpperCase();
    };

    const estaPaga = (mensalidade) => {

        return normalizarStatus(mensalidade.status) === "PAGO";
    };

    const estaVencida = (mensalidade) => {

        const status = normalizarStatus(mensalidade.status);

        if (estaPaga(mensalidade)) {
            return false;
        }

        if (status === "ATRASADO" || status === "VENCIDO") {
            return true;
        }

        if (status === "PENDENTE" || !mensalidade.vencimento) {
            return false;
        }

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const vencimento =
            new Date(`${mensalidade.vencimento}T00:00:00`);

        return vencimento < hoje;
    };

    const renderizarStatus = (mensalidade) => {

        const status =
            normalizarStatus(mensalidade.status);

        if (estaPaga(mensalidade)) {
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

        return (
            <span className="badge bg-secondary">
                {status || "-"}
            </span>
        );
    };

    const carregarMensalidades = async () => {

        try {

            const resposta =
                await listarMensalidadesDoAluno(id);

            const dados =
                resposta.data || resposta;

            setMensalidades(
                Array.isArray(dados) ? dados : []
            );

        } catch (erro) {

            console.error(erro);

        } finally {

            setCarregando(false);

        }
    };

    const pagarMensalidade = async (mensalidadeId) => {

        const confirmar = await showConfirmation(
            "Deseja marcar esta mensalidade como paga?",
            {
                confirmText: "Sim, pagar",
                cancelText: "Cancelar",
            }
        );

        if (!confirmar) return;

        try {

            await marcarComoPago(mensalidadeId);

            await carregarMensalidades();

            showSuccess("Mensalidade atualizada com sucesso!");

        } catch (erro) {

            console.error(erro);

            showError("Erro ao atualizar mensalidade.");

        }
    };

    const excluirMensalidade = async (mensalidadeId) => {

        const confirmar = await showConfirmation(
            "Deseja excluir esta mensalidade?",
            {
                confirmText: "Sim, excluir",
                cancelText: "Cancelar",
            }
        );

        if (!confirmar) return;

        try {

            await excluirMensalidadeService(
                mensalidadeId
            );

            await carregarMensalidades();

            showSuccess(
                "Mensalidade excluída com sucesso!"
            );

        } catch (erro) {

            console.error(erro);

            showError(
                "Erro ao excluir mensalidade."
            );

        }
    };

    const editarMensalidade = (mensalidadeId) => {
        showInfo(`Editar mensalidade ${mensalidadeId}`);
    };

    useEffect(() => {
        if (!id) return;

        async function carregarMensalidadesInicial() {
            await carregarMensalidades();
        }

        carregarMensalidadesInicial();
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
                                <th>Vencimento</th>
                                <th>Pagamento</th>
                                <th>Valor</th>
                                <th>Status</th>
                                <th className="text-center">Ações</th>
                            </tr>

                        </thead>

                        <tbody>

                            {mensalidades.map((m) => (

                                <tr key={m.id}>

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

                                    <td className="text-center">

                                        <div className="d-flex justify-content-center gap-2">

                                            {!estaPaga(m) ? (

                                                <button
                                                    className="btn btn-success btn-sm fw-bold"
                                                    onClick={() => pagarMensalidade(m.id)}
                                                >
                                                    Pago
                                                </button>

                                            ) : (

                                                <span className="text-success fw-bold">
                                                    ✓ Pago
                                                </span>

                                            )}

                                            <Link
                                                to={`/mensalidades/editar/${m.id}`}
                                                className="btn btn-warning btn-sm fw-bold"
                                            >
                                                Editar
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm fw-bold"
                                                onClick={() => excluirMensalidade(m.id)}
                                            >
                                                Excluir
                                            </button>

                                        </div>

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
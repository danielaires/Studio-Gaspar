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

            await excluirMensalidadeService(mensalidadeId);

            await carregarMensalidades();

            showSuccess("Mensalidade excluída com sucesso!");

        } catch (erro) {

            console.error(erro);

            showError("Erro ao excluir mensalidade.");

        }

    };

    const estaPaga = (mensalidade) => {

        return normalizarStatus(mensalidade.status) === "PAGO";

    };

    const estaVencida = (mensalidade) => {

        const status = normalizarStatus(mensalidade.status);

        if (estaPaga(mensalidade))
            return false;

        if (status === "ATRASADO" || status === "VENCIDO")
            return true;

        if (status === "PENDENTE" || !mensalidade.vencimento)
            return false;

        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        const vencimento =
            new Date(`${mensalidade.vencimento}T00:00:00`);

        return vencimento < hoje;

    };

    const renderizarStatus = (mensalidade) => {

        const status = normalizarStatus(mensalidade.status);

        if (estaPaga(mensalidade)) {

            return (
                <span className="badge bg-success rounded-pill px-3 py-2">
                    ✅ Pago
                </span>
            );

        }

        if (estaVencida(mensalidade)) {

            return (
                <span className="badge bg-danger rounded-pill px-3 py-2">
                    🔴 Vencido
                </span>
            );

        }

        if (status === "PENDENTE") {

            return (
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                    🟡 Pendente
                </span>
            );

        }

        return (

            <span className="badge bg-secondary rounded-pill px-3 py-2">

                {status || "-"}

            </span>

        );

    };

    const totalMensalidades = mensalidades.length;

    const totalPagas =
        mensalidades.filter(estaPaga).length;

    const totalPendentes =
        mensalidades.filter((m) => !estaPaga(m)).length;

    const totalRecebido =
        mensalidades
            .filter(estaPaga)
            .reduce(
                (total, m) =>
                    total + Number(m.valor || 0),
                0
            );

    const editarMensalidade = (mensalidadeId) => {
        showInfo(`Editar mensalidade ${mensalidadeId}`);
    };

    const carregarMensalidades = async () => {

        try {

            const resposta = await listarMensalidadesDoAluno(id);

            const dados = resposta.data || resposta;

            setMensalidades(
                Array.isArray(dados) ? dados : []
            );

        } catch (erro) {

            console.error("Erro ao buscar mensalidades:", erro);

            showError("Erro ao carregar mensalidades.");

        } finally {

            setCarregando(false);

        }

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

                <div>

                    <h1 className="fw-bold">
                        💳 Mensalidades do Aluno
                    </h1>

                    <p className="text-muted mb-0">
                        Controle financeiro e histórico de pagamentos
                    </p>

                </div>

                <Link
                    to="/"
                    className="btn btn-secondary btn-lg"
                >
                    Voltar
                </Link>

            </div>

            <div className="row g-3 mb-4">

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center">

                            <div className="fs-1">📄</div>

                            <small className="text-muted">
                                Total
                            </small>

                            <h2 className="fw-bold mt-2">
                                {totalMensalidades}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center">

                            <div className="fs-1 text-success">✅</div>

                            <small className="text-muted">
                                Pagas
                            </small>

                            <h2 className="fw-bold text-success mt-2">
                                {totalPagas}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center">

                            <div className="fs-1 text-warning">⏳</div>

                            <small className="text-muted">
                                Pendentes
                            </small>

                            <h2 className="fw-bold text-warning mt-2">
                                {totalPendentes}
                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body text-center">

                            <div className="fs-1 text-primary">💰</div>

                            <small className="text-muted">
                                Total Recebido
                            </small>

                            <h4 className="fw-bold text-primary mt-2">
                                {formatarValor(totalRecebido)}
                            </h4>

                        </div>

                    </div>

                </div>

            </div>

            {carregando ? (

                <div className="text-center py-5">

                    <div className="spinner-border text-primary"></div>

                    <h5 className="mt-3">
                        Carregando mensalidades...
                    </h5>

                </div>

            ) : mensalidades.length === 0 ? (

                <div className="alert alert-info shadow-sm">

                    Nenhuma mensalidade encontrada.

                </div>

            ) : (

                <div className="card shadow border-0 rounded-4">

                    <div
                        className="card-header text-white fw-bold py-3"
                        style={{
                            background:
                                "linear-gradient(135deg,#667eea,#764ba2)"
                        }}
                    >
                        📋 Histórico de Mensalidades
                    </div>

                    <div className="table-responsive">

                        <table className="table table-hover align-middle mb-0">

                            <thead className="table-light">

                                <tr>

                                    <th>📅 Vencimento</th>

                                    <th>💵 Pagamento</th>

                                    <th>💰 Valor</th>

                                    <th>Status</th>

                                    <th className="text-center">
                                        Ações
                                    </th>

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

                                        <td className="fw-bold">
                                            {formatarValor(m.valor)}
                                        </td>

                                        <td>
                                            {renderizarStatus(m)}
                                        </td>

                                        <td>

                                            <div className="d-flex justify-content-center gap-2">

                                                {!estaPaga(m) ? (

                                                    <button
                                                        className="btn btn-success btn-sm"
                                                        onClick={() => pagarMensalidade(m.id)}
                                                    >
                                                        ✓ Pagar
                                                    </button>

                                                ) : (

                                                    <button
                                                        className="btn btn-outline-success btn-sm"
                                                        disabled
                                                    >
                                                        Pago
                                                    </button>

                                                )}

                                                <Link
                                                    to={`/mensalidades/editar/${m.id}`}
                                                    className="btn btn-warning btn-sm"
                                                >
                                                    ✏ Editar
                                                </Link>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => excluirMensalidade(m.id)}
                                                >
                                                    🗑 Excluir
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            )}

        </div>

    );
}
export default MensalidadesAluno;
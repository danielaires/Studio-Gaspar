import { useEffect, useState } from "react";
import { buscarDashboardFinanceiro } from "../services/financeiroService";

export default function Financeiro() {

    const [dashboard, setDashboard] = useState({
        totalRecebido: 0,
        totalReceber: 0,
        totalPagas: 0,
        totalPendentes: 0,
        totalVencidas: 0,
        totalMensalidades: 0,
        inadimplencia: 0
    });

    useEffect(() => {
        carregarDashboard();
    }, []);

    const carregarDashboard = async () => {
        try {

            const dados = await buscarDashboardFinanceiro();

            setDashboard(dados);

        } catch (error) {
            console.error("Erro ao carregar dashboard:", error);
        }
    };

    const moeda = (valor) => {

        return Number(valor).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        });

    };

    return (

        <div className="container-fluid py-4">

            <h2 className="fw-bold mb-1">
                Dashboard Financeiro
            </h2>

            <p className="text-muted mb-4">
                Visão geral da saúde financeira do Studio Gaspar.
            </p>

            <div className="row g-4">

                {/* Total Recebido */}
                <div className="col-md-3">

                    <div className="card border-success shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Total Recebido
                            </h6>

                            <h2 className="text-success fw-bold">

                                {moeda(dashboard.totalRecebido)}

                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card border-warning shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                A Receber
                            </h6>

                            <h2 className="text-warning fw-bold">

                                {moeda(dashboard.totalReceber)}

                            </h2>

                        </div>

                    </div>

                </div>

                <div className="col-md-3">

                    <div className="card border-danger shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Mensalidades Vencidas
                            </h6>

                            <h2 className="text-danger fw-bold">

                                {dashboard.totalVencidas}

                            </h2>

                        </div>

                    </div>

                </div>

                {/* Inadimplência */}
                <div className="col-md-3">

                    <div className="card border-primary shadow-sm h-100">

                        <div className="card-body">

                            <h6 className="text-muted">
                                Inadimplência
                            </h6>

                            <h2 className="text-primary fw-bold">

                                {dashboard.inadimplencia.toFixed(2)}%

                            </h2>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}
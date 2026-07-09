import api from "./api";

export const buscarDashboardFinanceiro = async () => {
    const response = await api.get("/financeiro/dashboard");
    return response.data;
};
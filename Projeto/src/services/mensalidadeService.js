import api from "./api";

export function salvarMensalidade(mensalidade) {
    return api.post("/mensalidades", mensalidade);
}

export function listarMensalidades() {
    return api.get("/mensalidades");
}
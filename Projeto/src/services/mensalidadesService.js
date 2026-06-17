import api from "./api";

export function salvarMensalidade(mensalidade) {
    return api.post("/mensalidades", mensalidade);
}

export function listarMensalidades() {
    return api.get("/mensalidades");
}

export function listarMensalidadesDoAluno(id) {
    return api.get(`/mensalidades/aluno/${id}`);
}

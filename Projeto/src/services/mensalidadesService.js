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

export function marcarComoPago(id) {
    return api.put(`/mensalidades/${id}/pagar`);
}

export function excluirMensalidade(id) {
    return api.delete(`/mensalidades/${id}`);
}

export function buscarMensalidade(id) {
    return api.get(`/mensalidades/${id}`);
}
export function atualizarMensalidade(
    id,
    mensalidade
) {
    return api.put(
        `/mensalidades/${id}`,
        mensalidade
    );
}
import api from "./api";

export function listarAlunosAtivos() {
    return api.get("/relatorios/ativos");
}

export function listarAlunosInativos() {
    return api.get("/relatorios/inativos");
}

export function listarMensalidadesPagas() {
    return api.get("/relatorios/pagos");
}

export function listarMensalidadesVencidas() {
    return api.get("/relatorios/vencidos");
}

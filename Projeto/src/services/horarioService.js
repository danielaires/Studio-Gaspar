import api from "./api.js";

/**
 * Busca todos os horários cadastrados no sistema.
 * Ideal para popular o select no formulário de cadastro de aluno.
 */
export function listarHorarios() {
    return api.get("/horarios");
}

/**
 * Busca um horário específico pelo ID (útil para detalhes ou edição).
 */
export function buscarHorario(id) {
    return api.get(`/horarios/${id}`);
}
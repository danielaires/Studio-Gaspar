// src/services/avaliacaoService.js

import api from "./api";

export function salvarAvaliacao(avaliacao) {
    return api.post("/avaliacoes", avaliacao);
}

export function listarAvaliacoesDoAluno(alunoId) {
    return api.get(`/avaliacoes/aluno/${alunoId}`);
}

export function buscarAvaliacaoPorId(id) {
    return api.get(`/avaliacoes/${id}`);
}

export function excluirAvaliacao(id) {
    return api.delete(`/avaliacoes/${id}`);
}
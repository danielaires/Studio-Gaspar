import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

// --- FUNÇÕES DE ALUNOS ---

export function listarAlunos() {
    return api.get("/alunos");
}

export function buscarAluno(id) {
    return api.get(`/alunos/${id}`);
}

export function salvarAluno(aluno) {
    return api.post("/alunos", aluno);
}

export function atualizarAluno(id, aluno) {
    return api.put(`/alunos/${id}`, aluno);
}

export function excluirAluno(id) {
    return api.delete(`/alunos/${id}`);
}

// --- FUNÇÕES DE AVALIAÇÕES ---

export function listarAvaliacoesDoAluno(alunoId) {
    return api.get(`/avaliacoes/aluno/${alunoId}`);
}

// --- NOVA FUNÇÃO ADICIONADA AQUI ---
export function buscarAvaliacaoPorId(id) {
    return api.get(`/avaliacoes/${id}`);
}

export default api;
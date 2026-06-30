import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});
let isRefreshing = false;
let failedQueue = [];

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    console.log("TOKEN ENVIADO:", token);
    console.log("URL:", config.url);

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export function login(email, senha) {
    return api.post("/auth/login", {
        email,
        senha
    });
}

export function logout() {
    localStorage.removeItem("token");
}

export function usuarioLogado() {
    return !!localStorage.getItem("token");
}

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

export function listarAvaliacoesDoAluno(alunoId) {
    return api.get(`/avaliacoes/aluno/${alunoId}`);
}

export function buscarAvaliacaoPorId(id) {
    return api.get(`/avaliacoes/${id}`);
}

export function salvarAvaliacao(avaliacao) {
    return api.post("/avaliacoes", avaliacao);
}

export function listarMensalidades() {
    return api.get("/mensalidades");
}

export function buscarMensalidade(id) {
    return api.get(`/mensalidades/${id}`);
}

export function listarHorarios() {
    return api.get("/horarios");
}

export function listarInadimplentes() {
    return api.get("/relatorios/inadimplentes");
}

export default api;
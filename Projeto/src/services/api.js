import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080"
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

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
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("emailUsuario");
    localStorage.removeItem("role");
    localStorage.removeItem("usuario");
}

export function usuarioLogado() {
    const token = localStorage.getItem("token");

    return !!token &&
        token !== "undefined" &&
        token !== "null";
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

api.interceptors.response.use(

    (response) => response,

    async (error) => {

        const originalRequest = error.config;

        // Evita loop infinito
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // Seu backend hoje devolve 403 quando o token expira.
        if (error.response?.status === 403) {

            originalRequest._retry = true;

            try {

                const refreshToken =
                    localStorage.getItem("refreshToken");

                const response = await axios.post(
                    "http://localhost:8080/auth/refresh",
                    {
                        refreshToken
                    }
                );

                const novoAccessToken =
                    response.data.accessToken;

                localStorage.setItem(
                    "token",
                    novoAccessToken
                );

                originalRequest.headers.Authorization =
                    `Bearer ${novoAccessToken}`;

                return api(originalRequest);

            } catch (e) {

                logout();

                window.location.href = "/login";

                return Promise.reject(e);

            }

        }

        return Promise.reject(error);

    }

);
export default api;

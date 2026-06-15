import api from "./api";

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
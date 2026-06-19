import api from "./api";

export function salvarUsuario(usuario) {
    return api.post("/usuarios", usuario);
}

export function listarUsuarios() {
    return api.get("/usuarios");
}

export function excluirUsuario(id) {
    return api.delete(`/usuarios/${id}`);
}

export function buscarUsuario(id) {
    return api.get(`/usuarios/${id}`);
}

export function atualizarUsuario(id, usuario) {
    return api.put(`/usuarios/${id}`, usuario);
}
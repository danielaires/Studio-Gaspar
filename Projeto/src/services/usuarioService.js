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
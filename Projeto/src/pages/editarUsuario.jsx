import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    buscarUsuario,
    atualizarUsuario
} from "../services/usuarioService";
import { showSuccess, showError } from "../services/notificationService";

function EditarUsuario() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        senha: "",
        role: "ADMIN"
    });

    useEffect(() => {
        async function carregarUsuario() {
            try {
                const response = await buscarUsuario(id);

                setUsuario({
                    nome: response.data.nome,
                    email: response.data.email,
                    senha: "",
                    role: response.data.role,
                });
            } catch (erro) {
                console.error(erro);
                showError("Erro ao carregar usuário.");
            }
        }

        if (id) {
            carregarUsuario();
        }
    }, [id]);

    function alterarCampo(e) {

        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });

    }

    async function salvar(e) {

        e.preventDefault();

        try {

            await atualizarUsuario(
                id,
                usuario
            );

            showSuccess(
                "Usuário atualizado com sucesso!"
            );

            navigate("/usuarios");

        } catch (erro) {

            console.error(erro);

            showError(
                "Erro ao atualizar usuário."
            );

        }

    }

    return (

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Editar Usuário
                    </h2>

                    <p className="text-muted">
                        Atualização de usuários do sistema.
                    </p>

                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow border-0">

                        <div className="card-header bg-dark text-white fw-bold">
                            Dados do Usuário
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Nome
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nome"
                                        value={usuario.nome}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={usuario.email}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Nova Senha
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        name="senha"
                                        value={usuario.senha}
                                        onChange={alterarCampo}
                                        placeholder="Deixe em branco para manter a senha atual"
                                    />

                                </div>

                                <div className="col-md-6">

                                    <label className="form-label fw-bold">
                                        Perfil
                                    </label>

                                    <select
                                        className="form-select"
                                        name="role"
                                        value={usuario.role}
                                        onChange={alterarCampo}
                                    >
                                        <option value="ADMIN">
                                            ADMIN
                                        </option>

                                        <option value="USUARIO">
                                            USUÁRIO
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-3">

                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => navigate("/usuarios")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-warning fw-bold"
                        >
                            Atualizar
                        </button>

                    </div>

                </form>

            </div>

        </>

    );
}

export default EditarUsuario;
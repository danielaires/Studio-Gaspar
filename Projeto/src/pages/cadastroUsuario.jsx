import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { salvarUsuario } from "../services/usuarioService";

function CadastroUsuario() {

    const navigate = useNavigate();

    const [usuario, setUsuario] = useState({
        nome: "",
        email: "",
        senha: "",
        role: "ADMIN"
    });

    function alterarCampo(e) {

        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });

    }

    async function salvar(e) {

        e.preventDefault();

        try {

            await salvarUsuario(usuario);

            alert(
                "Usuário cadastrado com sucesso!"
            );

            navigate("/");

        } catch (erro) {

            console.error(erro);

            alert(
                "Erro ao cadastrar usuário."
            );

        }
    }

    return (

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="mb-4">

                    <h2 className="fw-bold">
                        Cadastro de Usuário
                    </h2>

                    <p className="text-muted">
                        Cadastro de novos usuários do sistema.
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
                                        Senha
                                    </label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        name="senha"
                                        value={usuario.senha}
                                        onChange={alterarCampo}
                                        required
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
                            onClick={() => navigate("/")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success"
                        >
                            Salvar
                        </button>

                    </div>

                </form>

            </div>

        </>
    );
}

export default CadastroUsuario;
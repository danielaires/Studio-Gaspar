import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { salvarUsuario } from "../services/usuarioService";
import { showSuccess, showError } from "../services/notificationService";

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

            showSuccess("Usuário cadastrado com sucesso!");

            navigate("/");

        } catch (erro) {

            console.error(erro);

            showError("Erro ao cadastrar usuário.");

        }
    }

    return (

        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div
                    className="p-4 rounded mb-4 text-white"
                    style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                >
                    <h2 className="fw-bold mb-1"> Cadastro de Usuário</h2>
                    <p className="mb-0">Cadastre novos usuários do sistema</p>
                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow border-0 mb-4">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                        >
                             Dados do Usuário
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nome"
                                            name="nome"
                                            value={usuario.nome}
                                            onChange={alterarCampo}
                                            placeholder="Digite o nome completo"
                                            required
                                        />
                                        <label htmlFor="nome"> Nome Completo</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={usuario.email}
                                            onChange={alterarCampo}
                                            placeholder="Digite o email"
                                            required
                                        />
                                        <label htmlFor="email"> Email</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="senha"
                                            name="senha"
                                            value={usuario.senha}
                                            onChange={alterarCampo}
                                            placeholder="Digite uma senha segura"
                                            required
                                        />
                                        <label htmlFor="senha"> Senha</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="role"
                                            name="role"
                                            value={usuario.role}
                                            onChange={alterarCampo}
                                        >
                                            <option value="ADMIN"> Administrador</option>
                                            <option value="USUARIO"> Usuário Comum</option>
                                        </select>
                                        <label htmlFor="role"> Perfil de Acesso</label>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-3">

                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
                            onClick={() => navigate("/")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success px-5"
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
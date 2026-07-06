import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
    listarUsuarios,
    excluirUsuario
} from "../services/usuarioService";
import { showSuccess, showError } from "../services/notificationService";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {

        carregarUsuarios();

    }, []);

    async function carregarUsuarios() {

        try {

            const response =
                await listarUsuarios();

            setUsuarios(
                response.data
            );

        } catch (erro) {

            console.error(erro);

        }
    }

    async function excluir(id, nome) {

        const confirmar = await showConfirmation(
            `Deseja excluir o usuário ${nome}?`,
            {
                confirmText: "Sim, excluir",
                cancelText: "Cancelar",
            }
        );

        if (!confirmar) return;

        try {

            await excluirUsuario(id);

            carregarUsuarios();

            showSuccess(
                "Usuário excluído com sucesso!"
            );

        } catch (erro) {

            console.error(erro);

            showError(
                "Erro ao excluir usuário."
            );

        }
    }

    return (

        <>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <div>

                        <h2 className="fw-bold mb-1">
                            Usuários
                        </h2>

                        <p className="text-muted mb-0">
                            Usuários cadastrados no sistema.
                        </p>

                    </div>

                    <Link
                        to="/cadastro-usuario"
                        className="btn btn-success"
                    >
                        + Novo Usuário
                    </Link>

                </div>

                <div className="card shadow border-0">

                    <div className="card-header bg-dark text-white fw-bold">
                        Lista de Usuários
                    </div>

                    <div className="card-body p-0">

                        <div className="table-responsive">

                            <table className="table table-hover mb-0">

                               <thead className="table-dark text-center">

                                    <tr>
                                        <th>Nome</th>
                                        <th>Email</th>
                                        <th>Perfil</th>
                                        <th className="text-center">
                                            Ações
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {usuarios.map((usuario) => (

                                        <tr key={usuario.id} className="text-center align-middle">

                                            <td>
                                                {usuario.nome}
                                            </td>

                                            <td>
                                                {usuario.email}
                                            </td>

                                            <td>

                                                <span className="badge bg-primary">

                                                    {usuario.role}

                                                </span>

                                            </td>

                                            <td className="text-center">

                                                <div className="d-flex justify-content-center gap-2">

                                                    <Link
                                                        to={`/usuarios/editar/${usuario.id}`}
                                                        className="btn btn-warning btn-sm fw-bold"
                                                    >
                                                        Editar
                                                    </Link>

                                                    <button
                                                        className="btn btn-danger btn-sm fw-bold"
                                                       onClick={() => excluir(usuario.id, usuario.nome)}
                                                    >
                                                        Excluir
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>

        </>
    );
}

export default Usuarios;
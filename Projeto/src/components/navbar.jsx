import { Link } from "react-router-dom";
import { logout } from "../services/api";

function Navbar() {

    function sair() {

        logout();
        window.location.href = "/login";
    }

    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">

            <div className="container">

                <Link
                    className="navbar-brand fw-bold"
                    to="/"
                >
                    🏋️ Studio Gaspar
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#menuNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div
                    className="collapse navbar-collapse"
                    id="menuNavbar"
                >

                    <ul className="navbar-nav me-auto">

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/"
                            >
                                Dashboard
                            </Link>
                        </li>

                        <li className="nav-item dropdown">

                            <a
                                className="nav-link dropdown-toggle"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Alunos
                            </a>

                            <ul className="dropdown-menu">

                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/alunos"
                                    >
                                        Listar Alunos
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/cadastro-aluno"
                                    >
                                        Cadastrar Aluno
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        className="dropdown-item"
                                        to="/horarios"
                                    >
                                        Horários
                                    </Link>
                                </li>

                            </ul>

                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/cadastro-avaliacao"
                            >
                                Avaliações
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/cadastro-mensalidade"
                            >
                                Mensalidades
                            </Link>
                        </li>

                    </ul>

                    <div className="dropdown">

                        <button
                            className="btn btn-outline-light dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                        >
                            👤 Admin
                        </button>

                        <ul className="dropdown-menu dropdown-menu-end">

                            <li>
                                <Link
                                    className="dropdown-item"
                                    to="/usuarios"
                                >
                                    Lista de Usuários
                                </Link>
                            </li>

                            <li>
                                <Link
                                    className="dropdown-item"
                                    to="/cadastro-usuario"
                                >
                                    Cadastrar Usuário
                                </Link>
                            </li>

                            <li>
                                <hr className="dropdown-divider" />
                            </li>

                            <li>
                                <button
                                    className="dropdown-item text-danger"
                                    onClick={sair}
                                >
                                    Sair
                                </button>
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;
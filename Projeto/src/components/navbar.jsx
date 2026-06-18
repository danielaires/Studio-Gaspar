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

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/alunos"
                            >
                                Alunos
                            </Link>
                        </li>

                        <li className="nav-item">
                            <Link
                                className="nav-link"
                               to="/usuarios"
                            >
                                Usuários
                            </Link>
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
                        <li className="nav-item">
                            <Link
                                className="nav-link"
                                to="/cadastro-usuario"
                            >
                                Usuários
                            </Link>
                        </li>

                    </ul>

                    <button
                        className="btn btn-outline-light btn-sm"
                        onClick={sair}
                    >
                        Sair
                    </button>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;
import { Link } from "react-router-dom";

function Sidebar() {

    return (

        <div
            className="bg-dark text-white p-3"
            style={{ width: "230px", minHeight: "100vh" }}
        >

            <h4>Studio Gaspar</h4>

            <hr />

            <ul className="nav flex-column">

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/">
                        Dashboard
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/alunos">
                        Alunos
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/horarios">
                        Horários
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/avaliacoes">
                        Avaliações
                    </Link>
                </li>

                <li className="nav-item">
                    <Link className="nav-link text-white" to="/mensalidades">
                        Mensalidades
                    </Link>
                </li>

            </ul>

        </div>

    );

}

export default Sidebar;
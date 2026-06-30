import { Link } from "react-router-dom";
import logo from "../assets/logo_gaspar.png";
import "./sidebar.css";

function Sidebar() {

  const nome = localStorage.getItem("nomeUsuario");
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("emailUsuario");

  const avatar = nome
    ? nome.charAt(0).toUpperCase()
    : "U";

  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-header">

          <div className="logo-container">
            <img
              src={logo}
              alt="Studio Gaspar"
              className="logo-sidebar"
            />
          </div>

          <h2 className="sidebar-title">
            Studio Gaspar
          </h2>

        </div>

        <div className="sidebar-menu">

          <Link to="/" className="menu-item">
            <span className="menu-icon"></span>
            <span>Dashboard</span>
          </Link>

          <Link to="/alunos" className="menu-item">
            <span className="menu-icon"></span>
            <span>Alunos</span>
          </Link>

          <Link to="/avaliacoes" className="menu-item">
            <span className="menu-icon"></span>
            <span>Avaliações</span>
          </Link>

          <Link to="/mensalidades" className="menu-item">
            <span className="menu-icon"></span>
            <span>Mensalidades</span>
          </Link>

          <Link to="/relatorio" className="menu-item">
            <span className="menu-icon"></span>
            <span>Relatórios</span>
          </Link>

        </div>

      </div>

      <div className="usuario-sidebar">

        <div className="avatar">
          {avatar}
        </div>

        <div>
          <strong>{nome || "Usuário"}</strong>

          <small className="d-block text-light opacity-75">
            {email || role}
          </small>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
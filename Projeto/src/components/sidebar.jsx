import { Link } from "react-router-dom";
import logo from "../assets/logo_gaspar.png";
import "./sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">

      <div>

        <div className="sidebar-logo">
          <img
            src={logo}
            alt="Studio Gaspar"
            className="logo-sidebar"
          />

          <h5 className="fw-bold text-center mt-2">
            Studio Gaspar
          </h5>
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
          A
        </div>

        <div>
          <strong>Administrador</strong>
          <small className="d-block text-light opacity-75">
            admin@studiogaspar.com
          </small>
        </div>
      </div>

    </aside>
  );
}

export default Sidebar;
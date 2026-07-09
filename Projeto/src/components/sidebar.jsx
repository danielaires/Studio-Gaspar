import { Link } from "react-router-dom";
import logo from "../assets/logo_gaspar.png";
import "./sidebar.css";

function Sidebar() {

  const nome = localStorage.getItem("nomeUsuario") || "Usuário";
  const role = localStorage.getItem("role");
  const email = localStorage.getItem("emailUsuario");

  // deterministic emoji picker based on name
  const emojiPalette = [
    "😀",
    "😄",
    "😃",
    "😊",
    "😉",
    "🤩",
    "😎",
    "🤠",
    "🤓",
    "🧐",
    "😇",
    "🙂",
    "🙃",
    "😺",
    "👋",
  ];

  function pickEmojiFromName(n) {
    if (!n) return "🙂";
    const code = n.charCodeAt(0) || 0;
    return emojiPalette[code % emojiPalette.length];
  }

  const avatarEmoji = pickEmojiFromName(nome);

  const menu = [
    { to: "/", label: "Dashboard", icon: "📊" },
    { to: "/alunos", label: "Alunos", icon: "👥" },
    { to: "/avaliacoes", label: "Avaliações", icon: "📋" },
    { to: "/mensalidades", label: "Mensalidades", icon: "💳" },
    { to: "/financeiro", label: "Financeiro", icon: "💰" },

    { to: "/relatorio", label: "Relatórios", icon: "📈" },
  ];

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

          <h2 className="sidebar-title">Studio Gaspar</h2>

        </div>

        <div className="sidebar-menu">

          {menu.map((item) => (
            <Link key={item.to} to={item.to} className="menu-item">
              <span className="menu-icon" aria-hidden>
                {item.icon}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}

        </div>

      </div>

      <div className="usuario-sidebar">

        <div className="avatar" title={nome} aria-label={`Avatar de ${nome}`}>
          {avatarEmoji}
        </div>

        <div>
          <strong>{nome}</strong>

          <small className="d-block text-light opacity-75">
            {email || role}
          </small>
        </div>

      </div>

    </aside>
  );
}

export default Sidebar;
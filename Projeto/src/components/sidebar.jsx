import { Link } from "react-router-dom";
import logo from "../assets/logo_gaspar.png";
import "./sidebar.css";
const menu=[['/','📊','Dashboard'],['/alunos','👥','Alunos'],['/avaliacoes','📋','Avaliações'],['/mensalidades','💳','Mensalidades'],['/financeiro','💰','Financeiro'],['/relatorio','📈','Relatórios']];
export default function Sidebar(){const nome=localStorage.getItem('nomeUsuario')||'Usuário';return <aside className="sidebar"><div><div className="sidebar-header"><div className="logo-container"><img src={logo} alt="Studio Gaspar" className="logo-sidebar"/></div><h2 className="sidebar-title">Studio Gaspar</h2></div><div className="sidebar-menu">{menu.map(x=><Link key={x[0]} to={x[0]} className="menu-item"><span className="menu-icon">{x[1]}</span><span>{x[2]}</span></Link>)}</div></div><div className="usuario-sidebar"><div className="avatar">👤</div><div><strong>{nome}</strong></div></div></aside>}

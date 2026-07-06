import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import logo from "../assets/logo_gaspar.png";
import "./login.css";

function Icon({ name }) {
  const paths = {
    users: (
      <>
        <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
        <path d="M3 21v-2a6 6 0 0 1 12 0v2" />
        <path d="M16 11a3 3 0 0 0 0-6" />
        <path d="M18 21v-2a5 5 0 0 0-2-4" />
      </>
    ),
    activity: <path d="M3 12h4l3-8 4 16 3-8h4" />,
    check: (
      <>
        <path d="M5 4h14v16H5z" />
        <path d="m8 13 2.5 2.5L16 10" />
      </>
    ),
    file: (
      <>
        <path d="M6 3h9l3 3v15H6z" />
        <path d="M15 3v4h3" />
        <path d="M9 12h6" />
        <path d="M9 16h6" />
      </>
    ),
    email: (
      <>
        <path d="M4 6h16v12H4z" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    lock: (
      <>
        <path d="M6 10h12v10H6z" />
        <path d="M8 10V8a4 4 0 0 1 8 0v2" />
        <path d="M12 14v2" />
      </>
    ),
    eye: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
      </>
    ),
    eyeOff: (
      <>
        <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" />
        <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
        <path d="M4 20 20 4" />
      </>
    ),
    arrow: (
      <>
        <path d="M5 12h14" />
        <path d="m13 6 6 6-6 6" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3 19 6v5c0 5-3 8-7 10-4-2-7-5-7-10V6z" />
        <path d="m9.5 12 1.8 1.8 3.7-4" />
      </>
    ),
  };

  return (
    <svg className="login-icon" viewBox="0 0 24 24" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const remembered = localStorage.getItem("emailLembrado");
    if (remembered) {
      setEmail(remembered);
      setLembrar(true);
    }
  }, []);

  useEffect(() => {
    if (lembrar) {
      if (email) {
        localStorage.setItem("emailLembrado", email);
      }
    } else {
      localStorage.removeItem("emailLembrado");
    }
  }, [lembrar, email]);

  const realizarLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await login(email, senha);
      const { accessToken, refreshToken, nome, role } = response.data;

      if (!accessToken) {
        throw new Error("Token de acesso não retornado pelo servidor.");
      }

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken || "");
      localStorage.setItem("nomeUsuario", nome || "");
      localStorage.setItem("emailUsuario", email);
      localStorage.setItem("role", role || "");
      localStorage.setItem(
        "usuario",
        JSON.stringify({
          nome,
          email,
          role,
        })
      );

      if (!lembrar) {
        localStorage.removeItem("emailLembrado");
      } else {
        localStorage.setItem("emailLembrado", email);
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error(error);
      alert("Email ou senha inv\u00e1lidos.");
    }
  };

  return (
    <main className="login-page">
      <section className="login-hero" aria-label="Gaspar Fitness">
        <img
          className="login-logo"
          src={logo}
          alt="Gaspar Fitness"
        />

        <div className="login-slogan">
          <strong>SUPERE SEUS LIMITES.</strong>
          <span>{"SEJA SUA MELHOR VERS\u00c3O."}</span>
        </div>

        <p>
          {"Sistema completo para gest\u00e3o de alunos, treinos, avalia\u00e7\u00f5es e muito mais."}
        </p>

        <div className="login-features">
          <div>
            <Icon name="users" />
            <span>{"Gest\u00e3o de alunos"}</span>
          </div>
          <div>
            <Icon name="activity" />
            <span>Treinos</span>
          </div>
          <div>
            <Icon name="check" />
            <span>{"Avalia\u00e7\u00f5es"}</span>
          </div>
          <div>
            <Icon name="file" />
            <span>{"Relat\u00f3rios"}</span>
          </div>
        </div>
      </section>

      <section className="login-card" aria-labelledby="login-title">
        <img
          className="login-card-logo"
          src={logo}
          alt="Gaspar Fitness"
        />

        <h1 id="login-title">Bem-vindo</h1>
        <p>{"Fa\u00e7a login para continuar"}</p>

        <form onSubmit={realizarLogin} className="login-form">
          <label className="login-field" aria-label="E-mail">
            <span>
              <Icon name="email" />
            </span>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          <label className="login-field" aria-label="Senha">
            <span>
              <Icon name="lock" />
            </span>
            <input
              type={mostrarSenha ? "text" : "password"}
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
            <button
              type="button"
              className="login-eye"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              <Icon name={mostrarSenha ? "eyeOff" : "eye"} />
            </button>
          </label>

          <div className="login-options">
            <label>
              <input
                type="checkbox"
                checked={lembrar}
                onChange={(e) => setLembrar(e.target.checked)}
              />
              <span>Lembrar-me</span>
            </label>

            <button type="button">Esqueceu sua senha?</button>
          </div>

          <button type="submit" className="login-submit">
            Entrar
            <Icon name="arrow" />
          </button>
        </form>

        <div className="login-secure">
          <span />
          <Icon name="shield" />
          <p>{"Seus dados est\u00e3o protegidos com seguran\u00e7a"}</p>
          <span />
        </div>
      </section>

      <footer className="login-footer">
        {"\u00a9 2025 "}
        <strong>Gaspar Fitness.</strong>
        {" Todos os direitos reservados."}
      </footer>
    </main>
  );
}

export default Login;

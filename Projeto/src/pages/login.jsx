import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

function Login() {

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const navigate = useNavigate();

  const realizarLogin = async (e) => {
    e.preventDefault();

    try {

      const response = await login(
        email,
        senha
      );

      console.log(
        "LOGIN RESPONSE:",
        response.data
      );

      localStorage.setItem(
        "token",
        response.data.token
      );

      console.log(
        "TOKEN SALVO:",
        localStorage.getItem("token")
      );

      navigate("/");

    } catch (error) {

      console.error(
        "ERRO LOGIN:",
        error
      );

      alert("Email ou senha inválidos");

    }
  };

  return (
    <div className="container mt-5">

      <div className="card p-4 shadow">

        <h2 className="mb-4">
          Studio Gaspar
        </h2>

        <form onSubmit={realizarLogin}>

          <div className="mb-3">
            <label>Email</label>

            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
            />
          </div>

          <div className="mb-3">
            <label>Senha</label>

            <input
              type="password"
              className="form-control"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
            />
          </div>

          <button
            className="btn btn-primary w-100"
            type="submit"
          >
            Entrar
          </button>

        </form>

      </div>

    </div>
  );
}

export default Login;
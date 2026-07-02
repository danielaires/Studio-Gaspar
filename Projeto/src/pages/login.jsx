import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import logo from "../assets/logo_gaspar.png";

function Login() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);

    const navigate = useNavigate();

    const realizarLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await login(
                email,
                senha
            );

            localStorage.setItem(
                "token",
                response.data.accessToken
            );

            localStorage.setItem(
                "refreshToken",
                response.data.refreshToken
            );

            localStorage.setItem(
                "nomeUsuario",
                response.data.nome
            );
            localStorage.setItem(
                "emailUsuario",
                response.data.email
            );

            localStorage.setItem(
                "role",
                response.data.role
            );

            navigate("/");

        } catch (error) {

            console.error(error);

            alert(
                "Email ou senha inválidos."
            );

        }

    };

    return (

        <div
            className="vh-100 d-flex align-items-center justify-content-center"
            style={{
                background:
                    "linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4F46E5 100%)"
            }}
        >

            <div
                className="card border-0 shadow-lg"
                style={{
                    width: "430px",
                    borderRadius: "20px"
                }}
            >

                <div className="card-body p-4 p-md-5">

                    <div className="text-center mb-4">

                        <img
                            src={logo}
                            alt="Gaspar Fitness"
                            style={{
                                width: "180px",
                                objectFit: "contain"
                            }}
                        />

                        <h4 className="fw-bold text-dark mb-1">
                            Bem-vindo
                        </h4>

                    </div>

                    <form onSubmit={realizarLogin}>

                        <div className="mb-3">

                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="Digite seu e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                        </div>

                        <div className="mb-4 position-relative">

                            <input
                                type={mostrarSenha ? "text" : "password"}
                                className="form-control form-control-lg pe-5"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                            />

                            <button
                                type="button"
                                className="btn border-0 bg-transparent position-absolute top-50 end-0 translate-middle-y me-2"
                                onClick={() => setMostrarSenha(!mostrarSenha)}
                            >
                                <i
                                    className={
                                        mostrarSenha
                                            ? "bi bi-eye-slash"
                                            : "bi bi-eye"
                                    }
                                ></i>
                            </button>

                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100 fw-bold"
                        >
                            Entrar
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default Login;
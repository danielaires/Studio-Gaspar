import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import logo from "../assets/logo_gaspar.png";

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
                    "linear-gradient(135deg, #f8f9fa, #e9ecef)"
            }}
        >

            <div
                className="card shadow-lg border-0"
                style={{
                    width: "450px",
                    borderRadius: "15px"
                }}
            >

                <div className="card-body p-5">

                    <div className="text-center mb-4">

                        <img
                            src={logo}
                            alt="Gaspar Fitness"
                            style={{
                                width: "180px",
                                objectFit: "contain"
                            }}
                        />

                        <p className="text-muted mt-2">
                            Sistema de Gestão
                        </p>

                    </div>

                    <form onSubmit={realizarLogin}>

                        <div className="mb-3">

                            <label className="form-label fw-bold">
                                Email
                            </label>

                            <input
                                type="email"
                                className="form-control form-control-lg"
                                placeholder="Digite seu email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="mb-4">

                            <label className="form-label fw-bold">
                                Senha
                            </label>

                            <input
                                type="password"
                                className="form-control form-control-lg"
                                placeholder="Digite sua senha"
                                value={senha}
                                onChange={(e) =>
                                    setSenha(
                                        e.target.value
                                    )
                                }
                                required
                            />

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
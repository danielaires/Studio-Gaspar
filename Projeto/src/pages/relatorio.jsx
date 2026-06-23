import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listarAlunos } from "../services/alunoService";

function Relatorio() {
    const [alunos, setAlunos] = useState([]);

    useEffect(() => {
        carregarDados();
    }, []);

    async function carregarDados() {
        try {
            const response = await listarAlunos();
            setAlunos(response.data);
        } catch (error) {
            console.error("Erro ao carregar relatório", error);
        }
    }

    return (
        <>
            <Navbar />

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-3 nao-imprimir">

                    <div>
                        <h2 className="fw-bold">Relatório Geral</h2>
                        <p className="text-muted mb-0">
                            Todos os alunos cadastrados
                        </p>
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={() => window.print()}
                    >
                        Imprimir Relatório
                    </button>

                </div>

               <div className="nao-imprimir d-none">
                    <h2>STUDIO GASPAR</h2>
                    <h4>Relatório Geral de Alunos</h4>
                    <p>
                        Emitido em{" "}
                        {new Date().toLocaleDateString("pt-BR")}
                    </p>
                </div>

                <div className="card shadow">

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-bordered table-striped">

                                <thead className="table-dark">

                                    <tr>
                                        <th>Nome</th>
                                        <th>Telefone</th>
                                        <th>Profissão</th>
                                        <th>Data Início</th>
                                        <th>Objetivo</th>
                                        <th>Status</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {alunos.map((aluno) => (

                                        <tr key={aluno.id}>

                                            <td>{aluno.nome}</td>
                                            <td>{aluno.telefone}</td>
                                            <td>{aluno.profissao}</td>

                                            <td>
                                                {new Date(
                                                    aluno.dataInicio
                                                ).toLocaleDateString("pt-BR")}
                                            </td>

                                            <td>{aluno.objetivo}</td>

                                            <td>
                                                {aluno.ativo
                                                    ? "Ativo"
                                                    : "Inativo"}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Relatorio;
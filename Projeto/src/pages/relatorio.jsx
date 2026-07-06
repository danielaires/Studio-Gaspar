import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listarAlunos } from "../services/alunoService";

function Relatorio() {
    const [alunos, setAlunos] = useState([]);
    const [pesquisa, setPesquisa] = useState("");
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [registrosPorPagina, setRegistrosPorPagina] = useState(10);

    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await listarAlunos();
                setAlunos(response.data);
            } catch (error) {
                console.error("Erro ao carregar relatório", error);
            }
        }

        carregarDados();
    }, []);

    const alunosFiltrados = alunos.filter((aluno) =>
        aluno.nome.toLowerCase().includes(pesquisa.toLowerCase())
    );

    const indiceInicial =
        (paginaAtual - 1) * registrosPorPagina;

    const indiceFinal =
        indiceInicial + registrosPorPagina;

    const alunosPaginados =
        alunosFiltrados.slice(indiceInicial, indiceFinal);

    const totalPaginas =
        Math.ceil(alunosFiltrados.length / registrosPorPagina);

    const alunosParaImpressao = alunosFiltrados;

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

            <div id="relatorio-impressao" className="container mt-4">

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
                <div className="row mb-3">

                    <div className="col-md-8">

                        <input
                            className="form-control"
                            placeholder="Pesquisar aluno..."
                            value={pesquisa}
                            onChange={(e) => {
                                setPesquisa(e.target.value);
                                setPaginaAtual(1);
                            }}
                        />

                    </div>

                    <div className="col-md-4">

                        <select
                            className="form-select"
                            value={registrosPorPagina}
                            onChange={(e) => {

                                setRegistrosPorPagina(
                                    Number(e.target.value)
                                );

                                setPaginaAtual(1);

                            }}
                        >

                            <option value={10}>10 registros</option>
                            <option value={20}>20 registros</option>
                            <option value={50}>50 registros</option>

                        </select>

                    </div>

                </div>

                <div className="nao-imprimir d-none">
                    <h2>STUDIO GASPAR</h2>
                    <h4>Relatório Geral de Alunos</h4>
                    <p>
                        Emitido em{" "}
                        {new Date().toLocaleDateString("pt-BR")}
                    </p>
                </div>

                <div id="printable" className="somente-impressao">
                    <h2>STUDIO GASPAR</h2>
                    <h4>Relatório Geral de Alunos</h4>
                    <p>Emitido em {new Date().toLocaleDateString("pt-BR")}</p>
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
                                {alunosParaImpressao.map((aluno) => (
                                    <tr key={`print-${aluno.id}`}>
                                        <td>{aluno.nome}</td>
                                        <td>{aluno.telefone}</td>
                                        <td>{aluno.profissao}</td>
                                        <td>{new Date(aluno.dataInicio).toLocaleDateString("pt-BR")}</td>
                                        <td>{aluno.objetivo}</td>
                                        <td>{aluno.ativo ? "Ativo" : "Inativo"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="card shadow nao-imprimir">

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

                                    {alunosPaginados.map((aluno) => (

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
                            <div className="d-flex justify-content-between align-items-center mt-3">

                                <span className="text-muted">

                                    Mostrando {indiceInicial + 1} -

                                    {" "}

                                    {Math.min(indiceFinal, alunosFiltrados.length)}

                                    {" "}de{" "}

                                    {alunosFiltrados.length}

                                </span>

                                <nav>

                                    <ul className="pagination mb-0">

                                        <li className={`page-item ${paginaAtual === 1 ? "disabled" : ""}`}>

                                            <button
                                                className="page-link"
                                                onClick={() => setPaginaAtual(paginaAtual - 1)}
                                            >
                                                Anterior
                                            </button>

                                        </li>

                                        {Array.from(
                                            { length: totalPaginas },
                                            (_, index) => (

                                                <li
                                                    key={index}
                                                    className={`page-item ${paginaAtual === index + 1 ? "active" : ""
                                                        }`}
                                                >

                                                    <button
                                                        className="page-link"
                                                        onClick={() => setPaginaAtual(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </button>

                                                </li>

                                            )
                                        )}

                                        <li className={`page-item ${paginaAtual === totalPaginas ? "disabled" : ""}`}>

                                            <button
                                                className="page-link"
                                                onClick={() => setPaginaAtual(paginaAtual + 1)}
                                            >
                                                Próximo
                                            </button>

                                        </li>

                                    </ul>

                                </nav>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    );
}

export default Relatorio;
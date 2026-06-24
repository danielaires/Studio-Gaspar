import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { listarAlunos, listarAvaliacoesDoAluno } from "../services/api.js";
import Navbar from "../components/Navbar";
 
function Avaliacoes() {
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
 
    const formatarData = (dataString) => {
        if (!dataString) return "-";
        const partes = dataString.split("-");
        if (partes.length === 3) return `${partes[2]}/${partes[1]}/${partes[0]}`;
        return dataString;
    };
 
    useEffect(() => {
        // Busca todos os alunos e depois as avaliações de cada um
        listarAlunos()
            .then(async (resposta) => {
                const alunos = resposta.data?.content || resposta.data || [];
 
                const todasAvaliacoes = [];
 
                await Promise.all(
                    alunos.map((aluno) =>
                        listarAvaliacoesDoAluno(aluno.id)
                            .then((res) => {
                                const dados = res.data || [];
                                dados.forEach((aval) => {
                                    todasAvaliacoes.push({
                                        ...aval,
                                        nomeAluno: aluno.nome,
                                        alunoId: aluno.id,
                                    });
                                });
                            })
                            .catch(() => {}) // ignora se aluno não tem avaliações
                    )
                );
 
                // Ordena por data mais recente
                todasAvaliacoes.sort((a, b) =>
                    new Date(b.dataAvaliacao) - new Date(a.dataAvaliacao)
                );
 
                setAvaliacoes(todasAvaliacoes);
                setCarregando(false);
            })
            .catch((erro) => {
                console.error("Erro ao carregar avaliações:", erro);
                setCarregando(false);
            });
    }, []);
 
    const avaliacoesFiltradas = useMemo(() => {
        const termo = busca.trim().toLowerCase();
        if (!termo) return avaliacoes;
        return avaliacoes.filter((aval) =>
            [aval.nomeAluno, aval.dataAvaliacao]
                .filter(Boolean)
                .some((v) => v.toString().toLowerCase().includes(termo))
        );
    }, [avaliacoes, busca]);
 
    const paginacao = useMemo(() => {
        const totalItems = avaliacoesFiltradas.length;
        const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
        const current = Math.min(Math.max(1, currentPage), totalPages);
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        return {
            totalItems,
            totalPages,
            current,
            start,
            end,
            pageItems: avaliacoesFiltradas.slice(start, end),
        };
    }, [avaliacoesFiltradas, currentPage, pageSize]);
 
    return (
        <>
            <Navbar />
 
            <div className="container mt-4 mb-5">
 
                <div className="mb-4">
                    <h2 className="fw-bold mb-1">Avaliações</h2>
                    <p className="text-muted">Listagem de todas as avaliações físicas registradas.</p>
                </div>
 
                {!carregando && (
                    <div className="row mb-4 justify-content-end">
                        <div className="col-12 col-sm-8 col-md-4 col-lg-3 mb-3 ms-auto">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">🔍</span>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar por aluno ou data"
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
 
                {carregando ? (
                    <p>Carregando avaliações...</p>
                ) : avaliacoesFiltradas.length === 0 ? (
                    <p>Nenhuma avaliação encontrada{busca ? ` para "${busca}"` : ""}.</p>
                ) : (
                    <>
                        {/* Cards de resumo */}
                        <div className="row mb-4">
                            <div className="col-md-6">
                                <div className="card shadow-sm border-primary">
                                    <div className="card-body">
                                        <h6>Total de Avaliações</h6>
                                        <h2>{avaliacoes.length}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card shadow-sm border-success">
                                    <div className="card-body">
                                        <h6>Alunos Avaliados</h6>
                                        <h2>
                                            {new Set(avaliacoes.map((a) => a.alunoId)).size}
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
 
                        <div className="card shadow">
                            <div className="card-header bg-dark text-white fw-bold">
                                Lista de Avaliações
                            </div>
 
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover mb-0">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Aluno</th>
                                                <th>Data</th>
                                                <th>Peso (kg)</th>
                                                <th>Altura (m)</th>
                                                <th className="text-center">Ações</th>
                                            </tr>
                                        </thead>
 
                                        <tbody>
                                            {paginacao.pageItems.map((aval) => (
                                                <tr key={aval.id} className="align-middle">
                                                    <td>{aval.nomeAluno}</td>
                                                    <td>{formatarData(aval.dataAvaliacao)}</td>
                                                    <td>{aval.peso ?? "-"}</td>
                                                    <td>{aval.altura ?? "-"}</td>
                                                    <td className="text-center">
                                                        <Link
                                                            to={`/avaliacoes/${aval.id}`}
                                                            className="btn btn-sm btn-info text-white fw-bold me-2"
                                                        >
                                                            Detalhes
                                                        </Link>
                                                        <Link
                                                            to={`/alunos/${aval.alunoId}/avaliacoes`}
                                                            className="btn btn-sm btn-outline-secondary"
                                                        >
                                                            Ver Histórico
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
 
                                    {/* Paginação */}
                                    <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">
                                        <div className="text-muted">
                                            {paginacao.totalItems > 0 ? (
                                                <>Mostrando {paginacao.start + 1} - {Math.min(paginacao.end, paginacao.totalItems)} de {paginacao.totalItems}</>
                                            ) : (
                                                <>Nenhum item para mostrar</>
                                            )}
                                        </div>
 
                                        <div className="d-flex align-items-center gap-2">
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: 80 }}
                                                value={pageSize}
                                                onChange={(e) => {
                                                    setPageSize(Number(e.target.value));
                                                    setCurrentPage(1);
                                                }}
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={25}>25</option>
                                                <option value={50}>50</option>
                                            </select>
 
                                            <nav>
                                                <ul className="pagination mb-0">
                                                    <li className={`page-item ${paginacao.current === 1 ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setCurrentPage(Math.max(1, paginacao.current - 1))}
                                                            disabled={paginacao.current === 1}
                                                        >
                                                            Anterior
                                                        </button>
                                                    </li>
 
                                                    {Array.from({ length: paginacao.totalPages }).map((_, idx) => {
                                                        const p = idx + 1;
                                                        return (
                                                            <li key={p} className={`page-item ${p === paginacao.current ? "active" : ""}`}>
                                                                <button className="page-link" onClick={() => setCurrentPage(p)}>
                                                                    {p}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
 
                                                    <li className={`page-item ${paginacao.current === paginacao.totalPages ? "disabled" : ""}`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() => setCurrentPage(Math.min(paginacao.totalPages, paginacao.current + 1))}
                                                            disabled={paginacao.current === paginacao.totalPages}
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
                )}
            </div>
        </>
    );
}
 
export default Avaliacoes;
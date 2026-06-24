import { useState, useEffect, useMemo } from "react";
import { listarAlunos } from "../services/api";
import { listarMensalidadesDoAluno } from "../services/mensalidadesService";
import Navbar from "../components/Navbar";

function Mensalidades() {
    const [mensalidades, setMensalidades] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [busca, setBusca] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const formatarData = (dataString) => {
        if (!dataString) return "-";

        const partes = dataString.split("-");

        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }

        return dataString;
    };

    useEffect(() => {
        listarAlunos()
            .then(async (resposta) => {
                const alunos =
                    resposta.data?.content ||
                    resposta.data ||
                    [];

                const todasMensalidades = [];

                await Promise.all(
                    alunos.map((aluno) =>
                        listarMensalidadesDoAluno(aluno.id)
                            .then((res) => {
                                const dados =
                                    res.data || [];

                                dados.forEach((mens) => {
                                    todasMensalidades.push({
                                        ...mens,
                                        nomeAluno:
                                            aluno.nome,
                                        alunoId:
                                            aluno.id,
                                    });
                                });
                            })
                            .catch(() => {})
                    )
                );

                todasMensalidades.sort(
                    (a, b) =>
                        new Date(b.vencimento) -
                        new Date(a.vencimento)
                );

                setMensalidades(
                    todasMensalidades
                );

                setCarregando(false);
            })
            .catch((erro) => {
                console.error(
                    "Erro ao carregar mensalidades:",
                    erro
                );

                setCarregando(false);
            });
    }, []);

    const mensalidadesFiltradas = useMemo(() => {
        const termo =
            busca.trim().toLowerCase();

        if (!termo) return mensalidades;

        return mensalidades.filter((mens) =>
            [
                mens.nomeAluno,
                mens.vencimento,
                mens.valor,
            ]
                .filter(Boolean)
                .some((valor) =>
                    valor
                        .toString()
                        .toLowerCase()
                        .includes(termo)
                )
        );
    }, [mensalidades, busca]);

    const paginacao = useMemo(() => {
        const totalItems =
            mensalidadesFiltradas.length;

        const totalPages = Math.max(
            1,
            Math.ceil(totalItems / pageSize)
        );

        const current = Math.min(
            Math.max(1, currentPage),
            totalPages
        );

        const start =
            (current - 1) * pageSize;

        const end = start + pageSize;

        return {
            totalItems,
            totalPages,
            current,
            start,
            end,
            pageItems:
                mensalidadesFiltradas.slice(
                    start,
                    end
                ),
        };
    }, [
        mensalidadesFiltradas,
        currentPage,
        pageSize,
    ]);

    const totalPagas =
        mensalidades.filter(
            (m) => m.paga
        ).length;

    const totalPendentes =
        mensalidades.length -
        totalPagas;

    const totalAlunosAtivos =
        new Set(
            mensalidades.map(
                (m) => m.alunoId
            )
        ).size;

    return (
        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div className="mb-4">
                    <h2 className="fw-bold mb-1">
                        Mensalidades
                    </h2>

                    <p className="text-muted">
                        Listagem de todas as
                        mensalidades registradas.
                    </p>
                </div>

                {!carregando && (
                    <div className="row mb-4 justify-content-end">
                        <div className="col-12 col-sm-8 col-md-4 col-lg-3 mb-3 ms-auto">
                            <div className="input-group input-group-sm">
                                <span className="input-group-text">
                                    🔍
                                </span>

                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Buscar aluno"
                                    value={busca}
                                    onChange={(e) => {
                                        setBusca(
                                            e.target
                                                .value
                                        );

                                        setCurrentPage(
                                            1
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {carregando ? (
                    <p>
                        Carregando
                        mensalidades...
                    </p>
                ) : mensalidadesFiltradas.length ===
                  0 ? (
                    <p>
                        Nenhuma
                        mensalidade
                        encontrada
                        {busca
                            ? ` para "${busca}"`
                            : ""}
                        .
                    </p>
                ) : (
                    <>
                        <div className="row mb-4">

                            <div className="col-md-4">
                                <div className="card shadow-sm border-primary">
                                    <div className="card-body">
                                        <h6>
                                            Total de
                                            Mensalidades
                                        </h6>

                                        <h2>
                                            {
                                                mensalidades.length
                                            }
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card shadow-sm border-success">
                                    <div className="card-body">
                                        <h6>
                                            Pagas
                                        </h6>

                                        <h2>
                                            {
                                                totalPagas
                                            }
                                        </h2>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-4">
                                <div className="card shadow-sm border-info">
                                    <div className="card-body">
                                        <h6>
                                            Alunos
                                            Ativos
                                        </h6>

                                        <h2>
                                            {
                                                totalAlunosAtivos
                                            }
                                        </h2>
                                    </div>
                                </div>
                            </div>

                        </div>

                        <div className="card shadow">

                            <div className="card-header bg-dark text-white fw-bold">
                                Lista de
                                Mensalidades
                            </div>

                            <div className="card-body p-0">

                                <div className="table-responsive">

                                    <table className="table table-striped table-hover mb-0">

                                        <thead className="table-dark">
                                            <tr>
                                                <th>
                                                    Aluno
                                                </th>

                                                <th>
                                                    Vencimento
                                                </th>

                                                <th>
                                                    Valor
                                                </th>

                                                <th>
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paginacao.pageItems.map(
                                                (
                                                    mens
                                                ) => (
                                                    <tr
                                                        key={
                                                            mens.id
                                                        }
                                                        className="align-middle"
                                                    >
                                                        <td>
                                                            {
                                                                mens.nomeAluno
                                                            }
                                                        </td>

                                                        <td>
                                                            {formatarData(
                                                                mens.vencimento
                                                            )}
                                                        </td>

                                                        <td>
                                                            R${" "}
                                                            {Number(
                                                                mens.valor ||
                                                                    0
                                                            ).toFixed(
                                                                2
                                                            )}
                                                        </td>

                                                        <td>
                                                            {mens.paga ? (
                                                                <span className="badge bg-success">
                                                                    Paga
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-danger">
                                                                    Pendente
                                                                </span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>

                                    </table>

                                    <div className="d-flex justify-content-between align-items-center mt-3 px-3 pb-3">

                                        <div className="text-muted">
                                            {paginacao.totalItems >
                                            0 ? (
                                                <>
                                                    Mostrando{" "}
                                                    {paginacao.start +
                                                        1}{" "}
                                                    -{" "}
                                                    {Math.min(
                                                        paginacao.end,
                                                        paginacao.totalItems
                                                    )}{" "}
                                                    de{" "}
                                                    {
                                                        paginacao.totalItems
                                                    }
                                                </>
                                            ) : (
                                                <>
                                                    Nenhum
                                                    item
                                                    para
                                                    mostrar
                                                </>
                                            )}
                                        </div>

                                        <div className="d-flex align-items-center gap-2">

                                            <select
                                                className="form-select form-select-sm"
                                                style={{
                                                    width: 80,
                                                }}
                                                value={
                                                    pageSize
                                                }
                                                onChange={(
                                                    e
                                                ) => {
                                                    setPageSize(
                                                        Number(
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    );

                                                    setCurrentPage(
                                                        1
                                                    );
                                                }}
                                            >
                                                <option value={5}>
                                                    5
                                                </option>
                                                <option value={10}>
                                                    10
                                                </option>
                                                <option value={25}>
                                                    25
                                                </option>
                                                <option value={50}>
                                                    50
                                                </option>
                                            </select>

                                            <nav>
                                                <ul className="pagination mb-0">

                                                    <li className={`page-item ${
                                                        paginacao.current ===
                                                        1
                                                            ? "disabled"
                                                            : ""
                                                    }`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    Math.max(
                                                                        1,
                                                                        paginacao.current -
                                                                            1
                                                                    )
                                                                )
                                                            }
                                                        >
                                                            Anterior
                                                        </button>
                                                    </li>

                                                    {Array.from({
                                                        length:
                                                            paginacao.totalPages,
                                                    }).map(
                                                        (
                                                            _,
                                                            idx
                                                        ) => {
                                                            const p =
                                                                idx +
                                                                1;

                                                            return (
                                                                <li
                                                                    key={
                                                                        p
                                                                    }
                                                                    className={`page-item ${
                                                                        p ===
                                                                        paginacao.current
                                                                            ? "active"
                                                                            : ""
                                                                    }`}
                                                                >
                                                                    <button
                                                                        className="page-link"
                                                                        onClick={() =>
                                                                            setCurrentPage(
                                                                                p
                                                                            )
                                                                        }
                                                                    >
                                                                        {
                                                                            p
                                                                        }
                                                                    </button>
                                                                </li>
                                                            );
                                                        }
                                                    )}

                                                    <li className={`page-item ${
                                                        paginacao.current ===
                                                        paginacao.totalPages
                                                            ? "disabled"
                                                            : ""
                                                    }`}>
                                                        <button
                                                            className="page-link"
                                                            onClick={() =>
                                                                setCurrentPage(
                                                                    Math.min(
                                                                        paginacao.totalPages,
                                                                        paginacao.current +
                                                                            1
                                                                    )
                                                                )
                                                            }
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

export default Mensalidades;
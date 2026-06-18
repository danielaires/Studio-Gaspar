import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { salvarAvaliacao } from "../services/avaliacaoService";

function CadastroAvaliacao() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);

    const [avaliacao, setAvaliacao] = useState({
        alunoId: "",
        dataAvaliacao: new Date().toISOString().split("T")[0],
        altura: "",
        peso: "",
        peito: "",
        abdomen: "",
        gluteo: "",
        bracoEsquerdo: "",
        bracoDireito: "",
        coxaEsquerda: "",
        coxaDireita: "",
        panturrilhaEsquerda: "",
        panturrilhaDireita: "",
        triceps: "",
        subescapular: "",
        suprailiaca: "",
        dobraAbdomen: "",
        observacao: ""
    });

    useEffect(() => {

        api.get("/alunos")
            .then((response) => {

                setAlunos(response.data);

            })
            .catch((erro) => {

                console.error(
                    "Erro ao buscar alunos:",
                    erro
                );

            });

    }, []);

    function alterarCampo(e) {

        setAvaliacao({
            ...avaliacao,
            [e.target.name]: e.target.value
        });

    }

    function salvar(e) {

        e.preventDefault();

        if (!avaliacao.alunoId) {

            alert("Selecione um aluno.");

            return;
        }

        const payload = {
            ...avaliacao,
            aluno: {
                id: Number(avaliacao.alunoId)
            }
        };

        delete payload.alunoId;

        salvarAvaliacao(payload)
            .then(() => {

                alert(
                    "Avaliação salva com sucesso!"
                );

                navigate("/");

            })
            .catch((erro) => {

                console.error(erro);

                alert(
                    "Erro ao salvar avaliação."
                );

            });

    }

    return (

        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div className="mb-4">

                    <h2 className="fw-bold mb-1">
                        Nova Avaliação Física
                    </h2>

                    <p className="text-muted">
                        Avaliação física e acompanhamento do aluno.
                    </p>

                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header bg-dark text-white fw-bold">
                            Dados Básicos
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-3">

                                    <label className="form-label fw-bold">
                                        Aluno
                                    </label>

                                    <select
                                        className="form-select"
                                        name="alunoId"
                                        value={avaliacao.alunoId}
                                        onChange={alterarCampo}
                                        required
                                    >
                                        <option value="">
                                            Selecione...
                                        </option>

                                        {alunos.map((aluno) => (

                                            <option
                                                key={aluno.id}
                                                value={aluno.id}
                                            >
                                                {aluno.nome}
                                            </option>

                                        ))}

                                    </select>

                                </div>

                                <div className="col-md-3">

                                    <label className="form-label fw-bold">
                                        Data
                                    </label>

                                    <input
                                        type="date"
                                        className="form-control"
                                        name="dataAvaliacao"
                                        value={avaliacao.dataAvaliacao}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-3">

                                    <label className="form-label fw-bold">
                                        Peso (kg)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="peso"
                                        value={avaliacao.peso}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                                <div className="col-md-3">

                                    <label className="form-label fw-bold">
                                        Altura (m)
                                    </label>

                                    <input
                                        type="number"
                                        step="0.01"
                                        className="form-control"
                                        name="altura"
                                        value={avaliacao.altura}
                                        onChange={alterarCampo}
                                        required
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header bg-dark text-white fw-bold">
                            Medidas Corporais
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-3">
                                    <label>Peito</label>
                                    <input type="number" className="form-control" name="peito" value={avaliacao.peito} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Abdômen</label>
                                    <input type="number" className="form-control" name="abdomen" value={avaliacao.abdomen} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Glúteo</label>
                                    <input type="number" className="form-control" name="gluteo" value={avaliacao.gluteo} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Tríceps</label>
                                    <input type="number" className="form-control" name="triceps" value={avaliacao.triceps} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Braço Esquerdo</label>
                                    <input type="number" className="form-control" name="bracoEsquerdo" value={avaliacao.bracoEsquerdo} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Braço Direito</label>
                                    <input type="number" className="form-control" name="bracoDireito" value={avaliacao.bracoDireito} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Coxa Esquerda</label>
                                    <input type="number" className="form-control" name="coxaEsquerda" value={avaliacao.coxaEsquerda} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Coxa Direita</label>
                                    <input type="number" className="form-control" name="coxaDireita" value={avaliacao.coxaDireita} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Panturrilha Esquerda</label>
                                    <input type="number" className="form-control" name="panturrilhaEsquerda" value={avaliacao.panturrilhaEsquerda} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Panturrilha Direita</label>
                                    <input type="number" className="form-control" name="panturrilhaDireita" value={avaliacao.panturrilhaDireita} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Subescapular</label>
                                    <input type="number" className="form-control" name="subescapular" value={avaliacao.subescapular} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-3">
                                    <label>Suprailíaca</label>
                                    <input type="number" className="form-control" name="suprailiaca" value={avaliacao.suprailiaca} onChange={alterarCampo}/>
                                </div>

                                <div className="col-md-4">
                                    <label>Dobra Abdômen</label>
                                    <input type="number" className="form-control" name="dobraAbdomen" value={avaliacao.dobraAbdomen} onChange={alterarCampo}/>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4">

                        <div className="card-header bg-dark text-white fw-bold">
                            Observações
                        </div>

                        <div className="card-body">

                            <textarea
                                className="form-control"
                                rows="4"
                                name="observacao"
                                value={avaliacao.observacao}
                                onChange={alterarCampo}
                            />

                        </div>

                    </div>

                    <div className="d-flex justify-content-end gap-3">

                        <button
                            type="button"
                            className="btn btn-secondary px-4"
                            onClick={() => navigate("/")}
                        >
                            Cancelar
                        </button>

                        <button
                            type="submit"
                            className="btn btn-success px-5"
                        >
                            Salvar
                        </button>

                    </div>

                </form>

            </div>

        </>
    );
}

export default CadastroAvaliacao;
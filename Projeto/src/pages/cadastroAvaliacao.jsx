import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { salvarAvaliacao } from "../services/avaliacaoService";
import { showSuccess, showError, showWarning } from "../services/notificationService";

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

            showWarning("Selecione um aluno.");

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

                showSuccess("Avaliação salva com sucesso!");
                navigate("/");

            })
            .catch((erro) => {

                console.error(erro);
                showError("Erro ao salvar avaliação.");

            });

    }

    return (

        <>
            <Navbar />

            <div className="container mt-4 mb-5">

                <div
                    className="p-4 rounded mb-4 text-white"
                    style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                >
                    <h2 className="fw-bold mb-1"> Nova Avaliação Física</h2>
                    <p className="mb-0">Registre as medidas e métricas do acompanhamento</p>
                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                        >
                             Dados Básicos
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <select
                                            className="form-select"
                                            id="alunoId"
                                            name="alunoId"
                                            value={avaliacao.alunoId}
                                            onChange={alterarCampo}
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {alunos.map((aluno) => (
                                                <option key={aluno.id} value={aluno.id}>
                                                    {aluno.nome}
                                                </option>
                                            ))}
                                        </select>
                                        <label htmlFor="alunoId"> Aluno</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dataAvaliacao"
                                            name="dataAvaliacao"
                                            value={avaliacao.dataAvaliacao}
                                            onChange={alterarCampo}
                                            required
                                        />
                                        <label htmlFor="dataAvaliacao"> Data</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id="peso"
                                            name="peso"
                                            value={avaliacao.peso}
                                            onChange={alterarCampo}
                                            placeholder="0.00"
                                            required
                                        />
                                        <label htmlFor="peso"> Peso (kg)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="number"
                                            step="0.01"
                                            className="form-control"
                                            id="altura"
                                            name="altura"
                                            value={avaliacao.altura}
                                            onChange={alterarCampo}
                                            placeholder="0.00"
                                            required
                                        />
                                        <label htmlFor="altura"> Altura (m)</label>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                        >
                             Medidas Corporais
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="peito" name="peito" placeholder="0" value={avaliacao.peito} onChange={alterarCampo}/>
                                        <label htmlFor="peito">Peito (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="abdomen" name="abdomen" placeholder="0" value={avaliacao.abdomen} onChange={alterarCampo}/>
                                        <label htmlFor="abdomen"> Abdômen (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="gluteo" name="gluteo" placeholder="0" value={avaliacao.gluteo} onChange={alterarCampo}/>
                                        <label htmlFor="gluteo"> Glúteo (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="triceps" name="triceps" placeholder="0" value={avaliacao.triceps} onChange={alterarCampo}/>
                                        <label htmlFor="triceps"> Tríceps (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="bracoEsquerdo" name="bracoEsquerdo" placeholder="0" value={avaliacao.bracoEsquerdo} onChange={alterarCampo}/>
                                        <label htmlFor="bracoEsquerdo"> Braço Esquerdo (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="bracoDireito" name="bracoDireito" placeholder="0" value={avaliacao.bracoDireito} onChange={alterarCampo}/>
                                        <label htmlFor="bracoDireito"> Braço Direito (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="coxaEsquerda" name="coxaEsquerda" placeholder="0" value={avaliacao.coxaEsquerda} onChange={alterarCampo}/>
                                        <label htmlFor="coxaEsquerda"> Coxa Esquerda (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="coxaDireita" name="coxaDireita" placeholder="0" value={avaliacao.coxaDireita} onChange={alterarCampo}/>
                                        <label htmlFor="coxaDireita"> Coxa Direita (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="panturrilhaEsquerda" name="panturrilhaEsquerda" placeholder="0" value={avaliacao.panturrilhaEsquerda} onChange={alterarCampo}/>
                                        <label htmlFor="panturrilhaEsquerda"> Panturrilha Esq (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="panturrilhaDireita" name="panturrilhaDireita" placeholder="0" value={avaliacao.panturrilhaDireita} onChange={alterarCampo}/>
                                        <label htmlFor="panturrilhaDireita"> Panturrilha Dir (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="subescapular" name="subescapular" placeholder="0" value={avaliacao.subescapular} onChange={alterarCampo}/>
                                        <label htmlFor="subescapular"> Subescapular (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="suprailiaca" name="suprailiaca" placeholder="0" value={avaliacao.suprailiaca} onChange={alterarCampo}/>
                                        <label htmlFor="suprailiaca"> Suprailíaca (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="dobraAbdomen" name="dobraAbdomen" placeholder="0" value={avaliacao.dobraAbdomen} onChange={alterarCampo}/>
                                        <label htmlFor="dobraAbdomen"> Dobra Abdominal (cm)</label>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                        >
                             Observações
                        </div>

                        <div className="card-body">

                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    id="observacao"
                                    style={{minHeight: '120px'}}
                                    name="observacao"
                                    value={avaliacao.observacao}
                                    onChange={alterarCampo}
                                    placeholder="Digite observações..."
                                ></textarea>
                                <label htmlFor="observacao"> Observações</label>
                            </div>

                        </div>

                    </div>

                    <div className="mt-4 d-flex justify-content-end gap-3">

                        <button
                            type="button"
                            className="btn btn-outline-secondary px-4"
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
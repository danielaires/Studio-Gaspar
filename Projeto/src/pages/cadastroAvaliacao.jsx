import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import api from "../services/api";
import { salvarAvaliacao } from "../services/avaliacaoService";
import { showSuccess, showError, showWarning } from "../services/notificationService";
import "./avaliacaoFotos.css";

const MAXIMO_FOTOS = 4;
const TAMANHO_MAXIMO_FOTO = 4 * 1024 * 1024;

function CadastroAvaliacao() {

    const navigate = useNavigate();

    const [alunos, setAlunos] = useState([]);
    const [fotos, setFotos] = useState([]);

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
                console.error("Erro ao buscar alunos:", erro);
            });

    }, []);

    const calcularIMC = () => {
        const peso = parseFloat(avaliacao.peso);
        const altura = parseFloat(avaliacao.altura);

        if (isNaN(peso) || isNaN(altura) || altura <= 0) {
            return null;
        }

        return (peso / (altura * altura)).toFixed(2);
    };

    const classificarIMC = () => {

        const imc = Number(calcularIMC());

        if (!imc) return null;

        if (imc < 18.5)
            return {
                texto: "Abaixo do peso",
                cor: "warning",
                icone: "⚠️"
            };

        if (imc < 25)
            return {
                texto: "Peso Normal",
                cor: "success",
                icone: "🟢"
            };

        if (imc < 30)
            return {
                texto: "Sobrepeso",
                cor: "warning",
                icone: "🟡"
            };

        if (imc < 35)
            return {
                texto: "Obesidade Grau I",
                cor: "danger",
                icone: "🔴"
            };

        if (imc < 40)
            return {
                texto: "Obesidade Grau II",
                cor: "danger",
                icone: "🔴"
            };

        return {
            texto: "Obesidade Grau III",
            cor: "dark",
            icone: "⚫"
        };
    };

    const resultadoIMC = classificarIMC();
    function alterarCampo(e) {

        setAvaliacao({
            ...avaliacao,
            [e.target.name]: e.target.value
        });

    }

    function lerArquivoComoDataUrl(arquivo) {
        return new Promise((resolve, reject) => {
            const leitor = new FileReader();
            leitor.onload = () => resolve(leitor.result);
            leitor.onerror = () => reject(new Error("Não foi possível ler a foto."));
            leitor.readAsDataURL(arquivo);
        });
    }

    async function adicionarFotos(e) {
        const arquivos = Array.from(e.target.files || []);
        e.target.value = "";

        const vagas = MAXIMO_FOTOS - fotos.length;
        if (!vagas) {
            showWarning("A avaliação pode ter no máximo 4 fotos.");
            return;
        }

        const arquivosValidos = arquivos.slice(0, vagas).filter((arquivo) => {
            if (!arquivo.type.startsWith("image/")) {
                showWarning("Selecione apenas arquivos de imagem.");
                return false;
            }
            if (arquivo.size > TAMANHO_MAXIMO_FOTO) {
                showWarning("Cada foto deve ter no máximo 4 MB.");
                return false;
            }
            return true;
        });

        try {
            const novasFotos = await Promise.all(arquivosValidos.map(lerArquivoComoDataUrl));
            setFotos((fotosAtuais) => [...fotosAtuais, ...novasFotos]);
            if (arquivos.length > vagas) showWarning("Foram adicionadas somente as fotos que cabem no limite de 4.");
        } catch (erro) {
            console.error(erro);
            showError("Não foi possível adicionar uma das fotos.");
        }
    }

    function removerFoto(indice) {
        setFotos((fotosAtuais) => fotosAtuais.filter((_, fotoIndice) => fotoIndice !== indice));
    }

    function salvar(e) {

        e.preventDefault();

        if (!avaliacao.alunoId) {

            showWarning("Selecione um aluno.");
            return;

        }

        const payload = {
            ...avaliacao,
            fotos,
            imc: calcularIMC(), // opcional (caso exista no backend)
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
                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                    <h2 className="fw-bold mb-1"> Nova Avaliação Física</h2>
                    <p className="mb-0">Registre as medidas e métricas do acompanhamento</p>
                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
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
                                            className="form-control"
                                            id="altura"
                                            name="altura"
                                            value={avaliacao.altura}
                                            onChange={alterarCampo}
                                            step="0.001"
                                            min="0"
                                            max="3"
                                            placeholder="Ex: 1.80"
                                            required
                                        />
                                        <label htmlFor="altura"> Altura (m)</label>
                                    </div>
                                </div>

                            </div>

                            {resultadoIMC && (
                                <div className="col-12">
                                    <div className={`alert alert-${resultadoIMC.cor} shadow-sm mt-2`}>

                                        <h5 className="mb-3">
                                            📊 Resultado da Avaliação Física
                                        </h5>

                                        <div className="row text-center">

                                            <div className="col-md-4">
                                                <h6>IMC</h6>
                                                <h3 className="fw-bold">
                                                    {calcularIMC()}
                                                </h3>
                                            </div>

                                            <div className="col-md-4">
                                                <h6>Status</h6>
                                                <h4>
                                                    {resultadoIMC.icone} {resultadoIMC.texto}
                                                </h4>
                                            </div>

                                            <div className="col-md-4">
                                                <h6>Faixa Saudável</h6>
                                                <h5>18.5 até 24.9</h5>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="card shadow-sm mb-4 border-0">
                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            📷 Fotos da avaliação
                        </div>

                        <div className="card-body">
                            <p className="text-muted mb-3">Adicione até 4 fotos (frente, costas e laterais). Cada arquivo pode ter até 4 MB.</p>
                            <div className="avaliacao-fotos-grade">
                                {fotos.map((foto, indice) => (
                                    <div className="avaliacao-foto" key={foto}>
                                        <img src={foto} alt={`Foto ${indice + 1} da avaliação`} />
                                        <button type="button" className="btn btn-danger btn-sm avaliacao-foto-remover" onClick={() => removerFoto(indice)} aria-label={`Remover foto ${indice + 1}`}>×</button>
                                    </div>
                                ))}
                                {fotos.length < MAXIMO_FOTOS && (
                                    <label className="avaliacao-foto-adicionar">
                                        <span className="fs-3">＋</span>
                                        <span>Adicionar foto</span>
                                        <input type="file" accept="image/*" multiple onChange={adicionarFotos} />
                                    </label>
                                )}
                            </div>
                            <small className="text-muted d-block mt-3">{fotos.length} de {MAXIMO_FOTOS} fotos adicionadas</small>
                        </div>
                    </div>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            Medidas Corporais
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="peito" name="peito" placeholder="0" value={avaliacao.peito} onChange={alterarCampo} />
                                        <label htmlFor="peito">Peito (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="abdomen" name="abdomen" placeholder="0" value={avaliacao.abdomen} onChange={alterarCampo} />
                                        <label htmlFor="abdomen"> Abdômen (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="gluteo" name="gluteo" placeholder="0" value={avaliacao.gluteo} onChange={alterarCampo} />
                                        <label htmlFor="gluteo"> Glúteo (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="triceps" name="triceps" placeholder="0" value={avaliacao.triceps} onChange={alterarCampo} />
                                        <label htmlFor="triceps"> Tríceps (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="bracoEsquerdo" name="bracoEsquerdo" placeholder="0" value={avaliacao.bracoEsquerdo} onChange={alterarCampo} />
                                        <label htmlFor="bracoEsquerdo"> Braço Esquerdo (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="bracoDireito" name="bracoDireito" placeholder="0" value={avaliacao.bracoDireito} onChange={alterarCampo} />
                                        <label htmlFor="bracoDireito"> Braço Direito (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="coxaEsquerda" name="coxaEsquerda" placeholder="0" value={avaliacao.coxaEsquerda} onChange={alterarCampo} />
                                        <label htmlFor="coxaEsquerda"> Coxa Esquerda (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="coxaDireita" name="coxaDireita" placeholder="0" value={avaliacao.coxaDireita} onChange={alterarCampo} />
                                        <label htmlFor="coxaDireita"> Coxa Direita (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="panturrilhaEsquerda" name="panturrilhaEsquerda" placeholder="0" value={avaliacao.panturrilhaEsquerda} onChange={alterarCampo} />
                                        <label htmlFor="panturrilhaEsquerda"> Panturrilha Esq (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="panturrilhaDireita" name="panturrilhaDireita" placeholder="0" value={avaliacao.panturrilhaDireita} onChange={alterarCampo} />
                                        <label htmlFor="panturrilhaDireita"> Panturrilha Dir (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="subescapular" name="subescapular" placeholder="0" value={avaliacao.subescapular} onChange={alterarCampo} />
                                        <label htmlFor="subescapular"> Subescapular (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="suprailiaca" name="suprailiaca" placeholder="0" value={avaliacao.suprailiaca} onChange={alterarCampo} />
                                        <label htmlFor="suprailiaca"> Suprailíaca (cm)</label>
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="form-floating">
                                        <input type="number" className="form-control" id="dobraAbdomen" name="dobraAbdomen" placeholder="0" value={avaliacao.dobraAbdomen} onChange={alterarCampo} />
                                        <label htmlFor="dobraAbdomen"> Dobra Abdominal (cm)</label>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="card shadow-sm mb-4 border-0">

                        <div
                            className="card-header text-white fw-bold p-3"
                            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                        >
                            Observações
                        </div>

                        <div className="card-body">

                            <div className="form-floating">
                                <textarea
                                    className="form-control"
                                    id="observacao"
                                    style={{ minHeight: '120px' }}
                                    name="observacao"
                                    value={avaliacao.observacao}
                                    onChange={alterarCampo}
                                    placeholder="Digite observações..."
                                ></textarea>
                                <label htmlFor="observacao"></label>
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

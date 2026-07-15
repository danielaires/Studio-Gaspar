import { useState, useEffect } from "react";
import { salvarAluno } from "../services/alunoService";
import { listarHorarios } from "../services/horarioService";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { showSuccess, showError } from "../services/notificationService";
import "./cadastroAluno.css";

function CadastroAluno() {

    const navigate = useNavigate();

    const [horarios, setHorarios] = useState([]);

    const [aluno, setAluno] = useState({
        nome: "",
        dataNascimento: "",
        sexo: "",
        profissao: "",
        telefone: "",
        dataInicio: "",
        objetivo: "",
        horarioId: "",
        horarioTreino: "",
        foto: "",
        ativo: true
    });

    useEffect(() => {

        listarHorarios()
            .then((res) => {

                setHorarios(res.data);

            })
            .catch((err) => {

                console.error(
                    "Erro ao carregar horários:",
                    err
                );

            });

    }, []);

    function formatarTelefone(value) {
        const apenasNumeros = value.replace(/\D/g, "");

        if (apenasNumeros.length <= 2) {
            return apenasNumeros;
        }

        if (apenasNumeros.length <= 7) {
            return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2)}`;
        }

        return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`;
    }

    function alterarCampo(e) {
        const { name, value } = e.target;

        if (name === "telefone") {
            setAluno({
                ...aluno,
                telefone: formatarTelefone(value)
            });
            return;
        }

        setAluno({
            ...aluno,
            [name]: value
        });
    }

    function alterarFoto(e) {
        const arquivo = e.target.files?.[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {
            showError("Selecione um arquivo de imagem.");
            e.target.value = "";
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            showError("A foto deve ter no máximo 5 MB.");
            e.target.value = "";
            return;
        }

        const leitor = new FileReader();
        leitor.onload = () => setAluno((dados) => ({
            ...dados,
            foto: leitor.result
        }));
        leitor.readAsDataURL(arquivo);
    }

    function salvar(e) {

        e.preventDefault();

        const payload = {

            ...aluno,

            horario: aluno.horarioId
                ? {
                    id: Number(aluno.horarioId)
                }
                : null

        };

        delete payload.horarioId;

        salvarAluno(payload)
            .then(() => {

                showSuccess("Aluno cadastrado com sucesso!");
                navigate("/");

            })
            .catch((error) => {

                console.error(error);
                showError("Erro ao cadastrar aluno.");

            });
    }

    return (

        <>
            <Navbar />

            <div className="container mt-5 mb-5">

                <div className="mb-5">
                    <div className="d-flex align-items-center gap-3 mb-2">
                        <div style={{ width: '5px', height: '40px', backgroundColor: '#0d6efd', borderRadius: '3px' }}></div>
                        <h1 className="fw-bold mb-0">Cadastro de Aluno</h1>
                    </div>
                    <p className="text-muted ms-4">Adicione um novo aluno à academia</p>
                </div>

                <form onSubmit={salvar}>

                    <div className="card shadow-lg border-0">

                        <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                            <h5 className="mb-0 text-white fw-bold"> Informações Pessoais</h5>
                        </div>

                        <div className="card-body p-4">

                            <div className="row g-3">

                                <div className="col-12">
                                    <label className="form-label fw-bold">Foto do aluno</label>
                                    <div className="d-flex align-items-center gap-3">
                                        {aluno.foto ? (
                                            <img
                                                src={aluno.foto}
                                                alt="Prévia da foto do aluno"
                                                className="foto-aluno-preview"
                                            />
                                        ) : (
                                            <div className="foto-aluno-preview foto-aluno-placeholder">
                                                Sem foto
                                            </div>
                                        )}
                                        <div>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={alterarFoto}
                                            />
                                            <small className="text-muted">JPG, PNG ou WEBP, até 5 MB.</small>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="nome"
                                            name="nome"
                                            value={aluno.nome}
                                            onChange={alterarCampo}
                                            placeholder="Nome completo"
                                            required
                                        />
                                        <label htmlFor="nome"> Nome Completo</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="date"
                                            className="form-control"
                                            id="dataNascimento"
                                            name="dataNascimento"
                                            value={aluno.dataNascimento}
                                            onChange={alterarCampo}
                                            required
                                        />
                                        <label htmlFor="dataNascimento"> Data de Nascimento</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="tel"
                                            className="form-control"
                                            id="telefone"
                                            name="telefone"
                                            value={aluno.telefone}
                                            onChange={alterarCampo}
                                            placeholder="(00) 99999-9999"
                                        />
                                        <label htmlFor="telefone"> Telefone</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="form-floating">
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="profissao"
                                            name="profissao"
                                            value={aluno.profissao}
                                            onChange={alterarCampo}
                                            placeholder="Profissão"
                                        />
                                        <label htmlFor="profissao"> Profissão</label>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold"> Sexo</label>
                                    <div className="btn-group w-100" role="group">
                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="sexo"
                                            id="masculino"
                                            value="Masculino"
                                            checked={aluno.sexo === 'Masculino'}
                                            onChange={alterarCampo}
                                        />
                                        <label className="btn btn-outline-primary" htmlFor="masculino">Masculino</label>

                                        <input
                                            type="radio"
                                            className="btn-check"
                                            name="sexo"
                                            id="feminino"
                                            value="Feminino"
                                            checked={aluno.sexo === 'Feminino'}
                                            onChange={alterarCampo}
                                        />
                                        <label className="btn btn-outline-primary" htmlFor="feminino">Feminino</label>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="card shadow-lg border-0 mt-4">
                        <div className="card-header bg-gradient" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                            <h5 className="mb-0 text-white fw-bold"> Informações de Treino</h5>
                        </div>

                        <div className="card-body p-4">
                            <div className="row g-3">

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Data de Início</label>
                                    <div className="input-group">
                                        <span className="input-group-text"></span>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dataInicio"
                                            value={aluno.dataInicio}
                                            onChange={alterarCampo}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold">Objetivo</label>
                                    <div className="input-group">
                                        <span className="input-group-text"></span>
                                        <select
                                            className="form-select"
                                            name="objetivo"
                                            value={aluno.objetivo}
                                            onChange={alterarCampo}
                                            required
                                        >
                                            <option value="">Selecione um objetivo...</option>
                                            <option value="Hipertrofia">Hipertrofia</option>
                                            <option value="Emagrecimento">Emagrecimento</option>
                                            <option value="Ganho de Massa Muscular">Ganho de Massa Muscular</option>
                                            <option value="Fortalecimento">Fortalecimento</option>
                                            <option value="Força">Força</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold"> Período</label>
                                    <select
                                        className="form-select form-select-lg"
                                        name="horarioId"
                                        value={aluno.horarioId}
                                        onChange={alterarCampo}
                                        required
                                    >
                                        <option value="">Selecione um período...</option>
                                        {horarios.map((h) => (
                                            <option key={h.id} value={h.id}>{h.descricao}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label fw-bold"> Hora do Treino</label>
                                    <select
                                        className="form-select form-select-lg"
                                        name="horarioTreino"
                                        value={aluno.horarioTreino}
                                        onChange={alterarCampo}
                                    >
                                        <option value="">Selecione a hora...</option>
                                        <option value="06:00 às 07:00">06:00 às 07:00</option>
                                        <option value="07:00 às 08:00">07:00 às 08:00</option>
                                        <option value="08:00 às 09:00">08:00 às 09:00</option>
                                        <option value="09:00 às 10:00">09:00 às 10:00</option>
                                        <option value="10:00 às 11:00">10:00 às 11:00</option>
                                        <option value="14:00 às 15:00">14:00 às 15:00</option>
                                        <option value="15:00 às 16:00">15:00 às 16:00</option>
                                        <option value="16:00 às 17:00">16:00 às 17:00</option>
                                        <option value="17:00 às 18:00">17:00 às 18:00</option>
                                        <option value="18:00 às 19:00">18:00 às 19:00</option>
                                        <option value="19:00 às 20:00">19:00 às 20:00</option>
                                        <option value="20:00 às 21:00">20:00 às 21:00</option>
                                        <option value="21:00 às 22:00">21:00 às 22:00</option>
                                    </select>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="d-flex gap-3 mt-5 justify-content-end">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="btn btn-light btn-lg px-5"
                        >
                             Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-success btn-lg px-5"
                        >
                             Cadastrar 
                        </button>
                    </div>
                </form>

            </div>

        </>
    );
}

export default CadastroAluno;

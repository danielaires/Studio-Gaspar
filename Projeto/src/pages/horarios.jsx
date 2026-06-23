import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listarResumoHorarios } from "../services/horarioService";

function Horarios() {
    const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        carregarHorarios();
    }, []);

    async function carregarHorarios() {
        try {
            const response = await listarResumoHorarios();
            setHorarios(response.data);
        } catch (error) {
            console.error("Erro ao carregar horários:", error);
        }
    }

    return (
        <>
            <Navbar />

            <div className="container py-4">

                {/* Título */}
                <div className="mb-4">
                    <h2 className="fw-bold text-dark">
                         Gestão de Horários
                    </h2>
                    <p className="text-muted mb-0">
                        Visualize os períodos cadastrados e a quantidade de alunos por horário.
                    </p>
                </div>

                {/* Cards Resumo */}
                <div className="row mb-4">

                    {horarios.map((horario) => (
                        <div className="col-md-4 mb-3" key={horario.descricao}>
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body text-center">

                                    <h5 className="fw-bold text-primary">
                                        {horario.descricao}
                                    </h5>

                                    <p className="text-muted mb-2">
                                        {horario.faixaHorario}
                                    </p>

                                    <span className="badge bg-primary fs-6 px-3 py-2">
                                        {horario.totalAlunos} Alunos
                                    </span>

                                </div>
                            </div>
                        </div>
                    ))}

                </div>

            </div>
        </>
    );
}

export default Horarios;
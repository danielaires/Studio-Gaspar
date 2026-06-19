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

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header bg-white">
                        <h4 className="mb-0 fw-bold text-dark">
                            Horários Cadastrados
                        </h4>
                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-striped table-hover">

                                <thead className="table-light">

                                    <tr>
                                        <th className="text-center">Horário</th>
                                        <th className="text-center">Alunos</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {horarios.map((horario) => (

                                      <tr key={horario.descricao}>

                                            <td className="text-center fw-semibold">
                                                {horario.descricao}
                                            </td>

                                            <td className="text-center fw-bold">
                                                {horario.totalAlunos}
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

export default Horarios;
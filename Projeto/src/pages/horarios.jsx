import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { listarHorarios } from "../services/horarioService";

function Horarios() {

    const [horarios, setHorarios] = useState([]);

    useEffect(() => {
        carregarHorarios();
    }, []);

    async function carregarHorarios() {

        try {

            const response = await listarHorarios();

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

                    <div className="card-header bg-dark text-white">
                        <h4 className="mb-0"> Horários Cadastrados</h4>
                    </div>

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-striped table-hover">

                                <thead>

                                    <tr>

                                        <th>Descrição</th>
                                        <th>Hora Início</th>
                                        <th>Hora Fim</th>
                                    </tr>

                                </thead>

                                <tbody>

                                    {horarios.map((horario) => (

                                        <tr key={horario.id}>
                                            <td>{horario.descricao}</td>
                                            <td>{horario.horaInicio}</td>
                                            <td>{horario.horaFim}</td>
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
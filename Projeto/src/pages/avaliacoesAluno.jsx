import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { listarAvaliacoesDoAluno } from "../services/api.js";

function AvaliacoesAluno() {
  const { id } = useParams(); // ID do Aluno vindo da URL
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [carregando, setCarregando] = useState(() => !id);

  // Formatação profissional de data
  const formatarData = (dataStr) => {
    if (!dataStr) return '-';
    const data = new Date(dataStr);
    return data.toLocaleDateString('pt-BR');
  };
  // Calcula o IMC
  const calcularIMC = (peso, altura) => {

    if (!peso || !altura) return "-";

    return (peso / (altura * altura)).toFixed(2);

  };

  // Classifica o IMC
  const classificarIMC = (imc) => {

    if (imc === "-") {
      return {
        texto: "-",
        cor: "secondary"
      };
    }

    imc = Number(imc);

    if (imc < 18.5)
      return {
        texto: "Abaixo do Peso",
        cor: "warning"
      };

    if (imc < 25)
      return {
        texto: "Normal",
        cor: "success"
      };

    if (imc < 30)
      return {
        texto: "Sobrepeso",
        cor: "warning"
      };

    if (imc < 35)
      return {
        texto: "Obesidade I",
        cor: "danger"
      };

    if (imc < 40)
      return {
        texto: "Obesidade II",
        cor: "danger"
      };

    return {
      texto: "Obesidade III",
      cor: "dark"
    };

  };

  useEffect(() => {
    if (!id) return;

    // Chamada ao serviço de API
    listarAvaliacoesDoAluno(id)
      .then((resposta) => {
        // Ajuste conforme sua estrutura de retorno (se usa axios, é .data)
        const dados = resposta.data || resposta;
        setAvaliacoes(Array.isArray(dados) ? dados : []);
        setCarregando(false);
      })
      .catch((erro) => {
        console.error("Erro ao buscar avaliações:", erro);
        setCarregando(false);
      });
  }, [id]);

  return (
    <div className="container mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="fw-bold">
            📋 Avaliações do Aluno
          </h1>

          <p className="text-muted mb-0">
            Histórico completo das avaliações físicas
          </p>

        </div>

        <Link
          to="/"
          className="btn btn-secondary btn-lg"
        >
          Voltar
        </Link>

      </div>
     {carregando ? (

  <div className="text-center mt-5">

    <div className="spinner-border text-primary mb-3"></div>

    <h5>Carregando avaliações...</h5>

  </div>

) : avaliacoes.length === 0 ? (

  <div className="alert alert-info shadow-sm">

    Nenhuma avaliação encontrada para este aluno.

  </div>

) : (

  <div className="card shadow border-0">

    <div
      className="card-header text-white fw-bold py-3"
      style={{
        background: "linear-gradient(135deg,#667eea,#764ba2)"
      }}
    >
      📋 Histórico de Avaliações
    </div>

    <div className="table-responsive">

      <table className="table table-hover align-middle mb-0">

        <thead className="table-light">

          <tr>

            <th>📅 Data</th>

            <th>⚖ Peso</th>

            <th>📏 Altura</th>

            <th>❤️ IMC</th>

            <th>Status</th>

            <th className="text-center">Ações</th>

          </tr>

        </thead>

        <tbody>

          {avaliacoes.map((aval) => {

            const imc = calcularIMC(
              aval.peso,
              aval.altura
            );

            const status = classificarIMC(imc);

                         return (

                <tr key={aval.id}>

                  <td>
                    {formatarData(aval.dataAvaliacao)}
                  </td>

                  <td>
                    {aval.peso?.toFixed(2)} kg
                  </td>

                  <td>
                    {aval.altura?.toFixed(2)} m
                  </td>

                  <td className="fw-bold text-success">
                    {imc}
                  </td>

                  <td>

                    <span
                      className={`badge bg-${status.cor}`}
                    >
                      {status.texto}
                    </span>

                  </td>

                  <td className="text-center">

                    <Link
                      to={`/avaliacoes/${aval.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      👁 Detalhes
                    </Link>

                  </td>

                </tr>

              );

            })}

          </tbody>

        </table>

      </div>

    </div>

)}

    </div>

  );

}

export default AvaliacoesAluno;
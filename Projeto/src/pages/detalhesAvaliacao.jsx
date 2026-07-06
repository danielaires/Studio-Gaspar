import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { buscarAvaliacaoPorId } from "../services/api.js";

function DetalhesAvaliacao() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [avaliacao, setAvaliacao] = useState(null);
  const [carregando, setCarregando] = useState(true);


  const formatarData = (dataStr) => {

    if (!dataStr) return "-";

    const [ano, mes, dia] = dataStr.split("-");

    return `${dia}/${mes}/${ano}`;

  };


  const calcularIMC = () => {

    if (!avaliacao?.peso || !avaliacao?.altura)
      return "-";

    return (
      avaliacao.peso /
      (avaliacao.altura * avaliacao.altura)
    ).toFixed(2);

  };

  const classificarIMC = () => {

    const imc = Number(calcularIMC());

    if (isNaN(imc))
      return {
        texto: "-",
        cor: "secondary"
      };

    if (imc < 18.5)
      return {
        texto: "Abaixo do Peso",
        cor: "warning"
      };

    if (imc < 25)
      return {
        texto: "Peso Normal",
        cor: "success"
      };

    if (imc < 30)
      return {
        texto: "Sobrepeso",
        cor: "warning"
      };

    if (imc < 35)
      return {
        texto: "Obesidade Grau I",
        cor: "danger"
      };

    if (imc < 40)
      return {
        texto: "Obesidade Grau II",
        cor: "danger"
      };

    return {
      texto: "Obesidade Grau III",
      cor: "dark"
    };

  };

  const statusIMC = classificarIMC();
  useEffect(() => {

    buscarAvaliacaoPorId(id)
      .then((resposta) => {

        setAvaliacao(resposta.data);
        setCarregando(false);

      })
      .catch((erro) => {

        console.error("Erro ao buscar detalhes da avaliação:", erro);
        setCarregando(false);

      });

  }, [id]);

  if (carregando) {

    return (

      <div className="container mt-5 text-center">

        <div className="spinner-border text-primary mb-3"></div>

        <h5>Carregando avaliação...</h5>

      </div>

    );

  }

  if (!avaliacao) {

    return (

      <div className="container mt-5">

        <div className="alert alert-danger">

          Avaliação não encontrada.

        </div>

      </div>

    );

  }

  return (

    <div className="container mt-4 mb-5">

      <div className="d-flex justify-content-between align-items-center mb-4">

        <div>

          <h1 className="fw-bold">

            📋 Ficha de Avaliação Física

          </h1>

          <p className="text-muted mb-0">

            Dados completos da avaliação física do aluno

          </p>

        </div>

        <button
          className="btn btn-secondary btn-lg"
          onClick={() => navigate(-1)}
        >

          Voltar

        </button>

      </div>

      <div className="card shadow border-0 mb-4">

        <div
          className="card-header text-white fw-bold py-3"
          style={{
            background:
              "linear-gradient(135deg,#667eea,#764ba2)"
          }}
        >

          📊 Resumo da Avaliação

        </div>

        <div className="card-body py-4">

          <div className="row text-center">

            <div className="col-md-3 border-end">

              <div className="fs-1 mb-2">

                ⚖️

              </div>

              <small className="text-muted">

                Peso

              </small>

              <h2 className="fw-bold mt-2">

                {avaliacao.peso} kg

              </h2>

            </div>

            <div className="col-md-3 border-end">

              <div className="fs-1 mb-2">

                📏

              </div>

              <small className="text-muted">

                Altura

              </small>

              <h2 className="fw-bold mt-2">

                {avaliacao.altura} m

              </h2>

            </div>

            <div className="col-md-3 border-end">

              <div className="fs-1 mb-2">

                ❤️

              </div>

              <small className="text-muted">

                IMC

              </small>

              <h2 className="fw-bold text-success mt-2">

                {calcularIMC()}

              </h2>

            </div>

            <div className="col-md-3">

              <div className="fs-1 mb-2">

                🏆

              </div>

              <small className="text-muted">

                Status

              </small>

              <br />

              <span
                className={`badge bg-${statusIMC.cor} fs-6 px-4 py-2 mt-2`}
              >

                {statusIMC.texto}

              </span>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow border-0 mb-4">

        <div
          className="card-header text-white fw-bold py-3"
          style={{
            background: "linear-gradient(135deg,#2563eb,#1d4ed8)"
          }}
        >
          📏 Medidas Corporais
        </div>

        <div className="card-body p-0">

          <div className="row g-0">

            <div className="col-md-6">

              <table className="table table-hover mb-0 align-middle">

                <tbody>

                  <tr>
                    <td>🫁 Peito</td>
                    <td className="fw-bold text-end">{avaliacao.peito || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🩺 Abdômen</td>
                    <td className="fw-bold text-end">{avaliacao.abdomen || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🍑 Glúteo</td>
                    <td className="fw-bold text-end">{avaliacao.gluteo || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>💪 Tríceps</td>
                    <td className="fw-bold text-end">{avaliacao.triceps || "-"} mm</td>
                  </tr>

                  <tr>
                    <td>📏 Subescapular</td>
                    <td className="fw-bold text-end">{avaliacao.subescapular || "-"} mm</td>
                  </tr>

                  <tr>
                    <td>📐 Suprailíaca</td>
                    <td className="fw-bold text-end">{avaliacao.suprailiaca || "-"} mm</td>
                  </tr>

                  <tr>
                    <td>📋 Dobra Abdominal</td>
                    <td className="fw-bold text-end">{avaliacao.dobraAbdomen || "-"} mm</td>
                  </tr>

                </tbody>

              </table>

            </div>

            <div className="col-md-6 border-start">

              <table className="table table-hover mb-0 align-middle">

                <tbody>

                  <tr>
                    <td>💪 Braço Direito</td>
                    <td className="fw-bold text-end">{avaliacao.bracoDireito || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>💪 Braço Esquerdo</td>
                    <td className="fw-bold text-end">{avaliacao.bracoEsquerdo || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🦵 Coxa Direita</td>
                    <td className="fw-bold text-end">{avaliacao.coxaDireita || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🦵 Coxa Esquerda</td>
                    <td className="fw-bold text-end">{avaliacao.coxaEsquerda || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🦶 Panturrilha Direita</td>
                    <td className="fw-bold text-end">{avaliacao.panturrilhaDireita || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>🦶 Panturrilha Esquerda</td>
                    <td className="fw-bold text-end">{avaliacao.panturrilhaEsquerda || "-"} cm</td>
                  </tr>

                  <tr>
                    <td>📅 Data da Avaliação</td>
                    <td className="fw-bold text-end">
                      {formatarData(avaliacao.dataAvaliacao)}
                    </td>
                  </tr>

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </div>

      <div className="card shadow border-0">

        <div
          className="card-header text-white fw-bold py-3"
          style={{
            background: "linear-gradient(135deg,#6b7280,#374151)"
          }}
        >
          📝 Observações
        </div>

        <div className="card-body p-4">

          {avaliacao.observacao ? (

            <p
              className="fs-5 text-secondary mb-0"
              style={{
                whiteSpace: "pre-line",
                lineHeight: "1.8"
              }}
            >
              {avaliacao.observacao}
            </p>

          ) : (

            <div className="text-center py-5">

              <div
                style={{
                  fontSize: "60px"
                }}
              >
                📝
              </div>

              <h5 className="text-muted mt-3">

                Nenhuma observação cadastrada

              </h5>

              <p className="text-secondary">

                O professor não adicionou observações para esta avaliação.

              </p>

            </div>

          )}

        </div>

      </div>
    </div>
  );
}
export default DetalhesAvaliacao;
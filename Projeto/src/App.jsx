// Importações do React Router
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importações das páginas
import Alunos from "./pages/Alunos";
import CadastroAluno from "./pages/CadastroAluno";
import CadastroAvaliacao from "./pages/CadastroAvaliacao";
import CadastroMensalidade from "./pages/CadastroMensalidade";
import EditarAluno from "./pages/editarAluno";
import AvaliacoesAluno from "./pages/AvaliacoesAluno";
import DetalhesAvaliacao from "./pages/DetalhesAvaliacao";
import MensalidadesAluno from "./pages/MensalidadesAluno"; // NOVO

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Home */}
        <Route path="/" element={<Alunos />} />

        {/* Alunos */}
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/editar-aluno/:id" element={<EditarAluno />} />

        {/* Avaliações */}
        <Route
          path="/cadastro-avaliacao"
          element={<CadastroAvaliacao />}
        />

        <Route
          path="/alunos/:id/avaliacoes"
          element={<AvaliacoesAluno />}
        />

        <Route
          path="/avaliacoes/:id"
          element={<DetalhesAvaliacao />}
        />

        {/* Mensalidades */}
        <Route
          path="/cadastro-mensalidade"
          element={<CadastroMensalidade />}
        />

        {/* NOVA ROTA */}
        <Route
          path="/alunos/:id/mensalidades"
          element={<MensalidadesAluno />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
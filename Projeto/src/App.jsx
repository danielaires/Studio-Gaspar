import { BrowserRouter, Routes, Route } from "react-router-dom";

import Alunos from "./pages/Alunos";
import CadastroAluno from "./pages/CadastroAluno";
import CadastroAvaliacao from "./pages/CadastroAvaliacao";
import CadastroMensalidade from "./pages/CadastroMensalidade";
import EditarAluno from "./pages/editarAluno";
import AvaliacoesAluno from "./pages/AvaliacoesAluno";
import DetalhesAvaliacao from "./pages/DetalhesAvaliacao";
import MensalidadesAluno from "./pages/MensalidadesAluno";
import Home from "./pages/home";
import Login from "./pages/Login";
import PrivateRoute from "./routes/PrivateRoute";
import EditarMensalidade from "./pages/EditarMensalidade";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Home */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

        {/* Alunos */}
        <Route
          path="/alunos"
          element={
            <PrivateRoute>
              <Alunos />
            </PrivateRoute>
          }
        />

        <Route
          path="/cadastro-aluno"
          element={
            <PrivateRoute>
              <CadastroAluno />
            </PrivateRoute>
          }
        />

        <Route
          path="/editar-aluno/:id"
          element={
            <PrivateRoute>
              <EditarAluno />
            </PrivateRoute>
          }
        />

        {/* Avaliações */}
        <Route
          path="/cadastro-avaliacao"
          element={
            <PrivateRoute>
              <CadastroAvaliacao />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos/:id/avaliacoes"
          element={
            <PrivateRoute>
              <AvaliacoesAluno />
            </PrivateRoute>
          }
        />

        <Route
          path="/avaliacoes/:id"
          element={
            <PrivateRoute>
              <DetalhesAvaliacao />
            </PrivateRoute>
          }
        />

        {/* Mensalidades */}
        <Route
          path="/cadastro-mensalidade"
          element={
            <PrivateRoute>
              <CadastroMensalidade />
            </PrivateRoute>
          }
        />

        <Route
          path="/alunos/:id/mensalidades"
          element={
            <PrivateRoute>
              <MensalidadesAluno />
            </PrivateRoute>
          }
        />
        <Route
          path="/mensalidades/editar/:id"
          element={
            <PrivateRoute>
              <EditarMensalidade />
            </PrivateRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
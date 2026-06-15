// 1. Importações do React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Importações das suas páginas
import Alunos from './pages/Alunos';
import CadastroAluno from './pages/CadastroAluno';
import CadastroAvaliacao from './pages/CadastroAvaliacao';
import EditarAluno from './pages/EditarAluno';
import AvaliacoesAluno from './pages/AvaliacoesAluno';

// --- NOVA IMPORTAÇÃO ADICIONADA AQUI ---
import DetalhesAvaliacao from './pages/DetalhesAvaliacao'; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Alunos />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-avaliacao" element={<CadastroAvaliacao />} />
        <Route path="/editar-aluno/:id" element={<EditarAluno />} />
        <Route path="/alunos/:id/avaliacoes" element={<AvaliacoesAluno />} /> 
        
        {/* --- NOVA ROTA DE DETALHES ADICIONADA AQUI --- */}
        <Route path="/avaliacoes/:id" element={<DetalhesAvaliacao />} /> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
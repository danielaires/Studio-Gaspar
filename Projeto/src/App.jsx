// 1. Importações do React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// 2. Importações das suas páginas (Verifique se as pastas estão com esse nome mesmo)
import Alunos from './pages/Alunos';
import CadastroAluno from './pages/CadastroAluno';
import CadastroAvaliacao from './pages/CadastroAvaliacao';
import EditarAluno from './pages/EditarAluno';
import Avaliacoes from './pages/Avaliacoes'; // Adicionado aqui

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Alunos />} />
        <Route path="/cadastro-aluno" element={<CadastroAluno />} />
        <Route path="/cadastro-avaliacao" element={<CadastroAvaliacao />} />
        <Route path="/editar-aluno/:id" element={<EditarAluno />} />
        <Route path="/alunos/:id/avaliacoes" element={<Avaliacoes />} /> {/* Adicionado aqui */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Alunos, Instrutores, Planos, Treinos, Frequencias, Pagamentos, Despesas } from './pages/Pages';
import { Reports } from './pages/Reports';
import './styles.css';

type Perfil = 'ADMIN' | 'INSTRUTOR' | 'ALUNO';
function Private() {
  const token = localStorage.getItem('fitmanager_token');
  const usuario = JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null') as { perfil?: Perfil } | null;
  if (!token || !usuario) return <Navigate to="/login" replace />;
  const perfil = usuario.perfil;
  return <Layout><Routes>
    <Route path="/" element={<Dashboard />} />
    <Route path="/alunos" element={perfil !== 'ALUNO' ? <Alunos /> : <Navigate to="/" replace />} />
    <Route path="/instrutores" element={perfil === 'ADMIN' ? <Instrutores /> : <Navigate to="/" replace />} />
    <Route path="/planos" element={<Planos />} />
    <Route path="/treinos" element={<Treinos />} />
    <Route path="/frequencias" element={<Frequencias />} />
    <Route path="/pagamentos" element={<Pagamentos />} />
    <Route path="/despesas" element={perfil === 'ADMIN' ? <Despesas /> : <Navigate to="/" replace />} />
    <Route path="/relatorios" element={perfil === 'ADMIN' ? <Reports /> : <Navigate to="/" replace />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes></Layout>;
}
export default function App() {
  return <BrowserRouter><Routes><Route path="/login" element={<Login />} /><Route path="*" element={<Private />} /></Routes></BrowserRouter>;
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import {
  Alunos,
  Instrutores,
  Planos,
  Treinos,
  Frequencias,
  Pagamentos,
} from './pages/Pages';
import './styles.css';

function Private() {
  const isAuthenticated = localStorage.getItem('fitmanager_token');

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/alunos" element={<Alunos />} />
        <Route path="/instrutores" element={<Instrutores />} />
        <Route path="/planos" element={<Planos />} />
        <Route path="/treinos" element={<Treinos />} />
        <Route path="/frequencias" element={<Frequencias />} />
        <Route path="/pagamentos" element={<Pagamentos />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Private />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App(){return <AppRoutes/>}

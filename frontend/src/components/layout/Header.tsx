import { useNavigate } from 'react-router-dom';

export function Header() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    nav('/login');
  };

  return (
    <header>
      <div>
        <strong>FitManager</strong>
        <span>Sistema de Gestão para Academias</span>
      </div>
      <button onClick={handleLogout}>
        Sair
      </button>
    </header>
  );
}

import { useNavigate } from 'react-router-dom';
export function Header() {
  const nav = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null') as { nome?: string; perfil?: string } | null;
  function sair() {
    localStorage.removeItem('fitmanager_token');
    localStorage.removeItem('fitmanager_usuario');
    nav('/login', { replace: true });
  }
  return <header>
    <div className="header-brand"><span className="brand-mark small">FM</span><div><strong>FitManager</strong><span>Gestão para academias</span></div></div>
    <div className="header-actions"><span className="user-label">{usuario?.nome} · {usuario?.perfil}</span><button onClick={sair}>Sair</button></div>
  </header>;
}

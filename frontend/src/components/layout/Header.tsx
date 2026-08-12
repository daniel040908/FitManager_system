import { useNavigate } from 'react-router-dom';
export function Header(){const nav=useNavigate(); return <header><div><strong>FitManager</strong><span>Sistema de Gestão para Academias</span></div><button onClick={()=>{localStorage.clear();nav('/login')}}>Sair</button></header>}

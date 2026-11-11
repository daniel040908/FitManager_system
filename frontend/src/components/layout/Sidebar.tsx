import { NavLink } from 'react-router-dom';
const links = [
  { to: '/', label: 'Visão geral', roles: ['ADMIN', 'INSTRUTOR', 'ALUNO'] },
  { to: '/alunos', label: 'Alunos', roles: ['ADMIN', 'INSTRUTOR'] },
  { to: '/instrutores', label: 'Instrutores', roles: ['ADMIN'] },
  { to: '/planos', label: 'Planos', roles: ['ADMIN', 'INSTRUTOR', 'ALUNO'] },
  { to: '/treinos', label: 'Treinos', roles: ['ADMIN', 'INSTRUTOR', 'ALUNO'] },
  { to: '/frequencias', label: 'Frequências', roles: ['ADMIN', 'INSTRUTOR', 'ALUNO'] },
  { to: '/pagamentos', label: 'Pagamentos', roles: ['ADMIN', 'ALUNO'] },
  { to: '/despesas', label: 'Despesas', roles: ['ADMIN'] },
  { to: '/relatorios', label: 'Relatórios', roles: ['ADMIN'] }
];
export function Sidebar() {
  const usuario = JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null') as { perfil?: string } | null;
  return <aside><nav aria-label="Navegação principal">{links.filter((link) => link.roles.includes(usuario?.perfil || '')).map(({ to, label }) =>
    <NavLink key={to} to={to} end={to === '/'}>{label}</NavLink>)}</nav></aside>;
}

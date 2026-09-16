import { NavLink } from 'react-router-dom';

export function Sidebar() {
  const menuItems = [
    ['/', 'Dashboard'],
    ['/alunos', 'Alunos'],
    ['/instrutores', 'Instrutores'],
    ['/planos', 'Planos'],
    ['/treinos', 'Treinos'],
    ['/frequencias', 'Frequências'],
    ['/pagamentos', 'Pagamentos'],
  ];

  return (
    <aside>
      <nav>
        {menuItems.map(([to, label]) => (
          <NavLink key={to} to={to}>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

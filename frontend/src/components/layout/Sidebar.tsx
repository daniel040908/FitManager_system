import { NavLink } from 'react-router-dom';
export function Sidebar(){return <aside><nav>{[['/','Dashboard'],['/alunos','Alunos'],['/instrutores','Instrutores'],['/planos','Planos'],['/treinos','Treinos'],['/frequencias','Frequências'],['/pagamentos','Pagamentos']].map(([to,label])=><NavLink key={to} to={to}>{label}</NavLink>)}</nav></aside>}

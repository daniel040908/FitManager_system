import { useEffect, useState } from 'react';
import { get } from '../services/api';
import { Card } from '../components/ui/Card';

type Stats = { alunos: number; planos: number; treinos: number; frequencias: number; pagamentos: number };
export function Dashboard() {
  const usuario = JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null') as { nome?: string; perfil?: string } | null;
  const [stats, setStats] = useState<Stats>({ alunos: 0, planos: 0, treinos: 0, frequencias: 0, pagamentos: 0 });
  const [erro, setErro] = useState('');
  useEffect(() => {
    const perfil = usuario?.perfil;
    const consultas: [keyof Stats, string][] = [
      ['alunos', '/api/alunos'], ['planos', '/api/planos'], ['treinos', '/api/treinos'],
      ['frequencias', '/api/frequencias'], ['pagamentos', '/api/pagamentos']
    ];
    const permitidas = consultas.filter(([key]) => {
      if (perfil === 'ALUNO') return ['treinos', 'frequencias', 'pagamentos', 'planos', 'alunos'].includes(key);
      if (perfil === 'INSTRUTOR') return ['alunos', 'planos', 'treinos', 'frequencias'].includes(key);
      return true;
    });
    Promise.all(permitidas.map(async ([key, path]) => [key, await get<unknown[]>(path)] as const))
      .then((results) => setStats((current) => ({ ...current, ...Object.fromEntries(results.map(([key, values]) => [key, values.length])) })))
      .catch((error) => setErro(error instanceof Error ? error.message : 'Não foi possível carregar os indicadores.'));
  }, []);
  const cards = usuario?.perfil === 'ALUNO'
    ? [['Meus treinos', stats.treinos], ['Minhas frequências', stats.frequencias], ['Meus pagamentos', stats.pagamentos], ['Planos disponíveis', stats.planos]]
    : usuario?.perfil === 'INSTRUTOR'
      ? [['Alunos', stats.alunos], ['Treinos atribuídos', stats.treinos], ['Frequências', stats.frequencias], ['Planos', stats.planos]]
      : [['Alunos', stats.alunos], ['Planos', stats.planos], ['Treinos', stats.treinos], ['Frequências', stats.frequencias], ['Pagamentos', stats.pagamentos]];
  return <>
    <div className="page-heading"><div><h1>Visão geral</h1><p>Bem-vindo(a), {usuario?.nome || 'ao FitManager'}.</p></div></div>
    {erro && <div className="alert">{erro}</div>}
    <div className="grid">{cards.map(([label, value]) => <Card key={String(label)}><span className="metric-label">{label}</span><strong className="metric">{value}</strong></Card>)}</div>
    <Card><h2>FitManager</h2><p className="muted">Acompanhe os cadastros e as atividades da academia em um único ambiente.</p></Card>
  </>;
}

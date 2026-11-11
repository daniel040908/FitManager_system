import { useEffect, useState } from 'react';
import { get } from '../services/api';
import { Card } from '../components/ui/Card';

type Report = {
  alunos: { ativos: number; inativos: number };
  totalTreinos: number;
  totalFrequencias: number;
  financeiro: {
    receitasPagas: number; despesas: number; saldo: number;
    pagamentosPendentes: { quantidade: number; valor: number };
    pagamentosAtrasados: { quantidade: number; valor: number };
  };
  ultimasFrequencias: { id: number; horario: string; aluno: { usuario: { nome: string } } }[];
};
const money = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0);
export function Reports() {
  const [report, setReport] = useState<Report | null>(null);
  const [erro, setErro] = useState('');
  useEffect(() => { get<Report>('/api/relatorios/geral').then(setReport).catch((e) => setErro(e instanceof Error ? e.message : 'Erro ao carregar relatório.')); }, []);
  if (erro) return <div className="alert">{erro}</div>;
  if (!report) return <p className="muted">Carregando relatório...</p>;
  const metrics = [
    ['Alunos ativos', report.alunos.ativos], ['Alunos inativos', report.alunos.inativos],
    ['Treinos cadastrados', report.totalTreinos], ['Frequências registradas', report.totalFrequencias],
    ['Receitas pagas', money(report.financeiro.receitasPagas)], ['Despesas registradas', money(report.financeiro.despesas)],
    ['Saldo acumulado', money(report.financeiro.saldo)], ['Pagamentos pendentes', `${report.financeiro.pagamentosPendentes.quantidade} · ${money(report.financeiro.pagamentosPendentes.valor)}`],
    ['Pagamentos atrasados', `${report.financeiro.pagamentosAtrasados.quantidade} · ${money(report.financeiro.pagamentosAtrasados.valor)}`]
  ];
  return <>
    <div className="page-heading"><div><h1>Relatórios</h1><p>Indicadores consolidados a partir dos registros do sistema.</p></div></div>
    <div className="grid">{metrics.map(([label, value]) => <Card key={String(label)}><span className="metric-label">{label}</span><strong className="report-value">{value}</strong></Card>)}</div>
    <Card><h2>Frequências recentes</h2>{report.ultimasFrequencias.length ? <div className="records-list">{report.ultimasFrequencias.map((item) => <div className="record" key={item.id}><strong>{item.aluno.usuario.nome}</strong><span>{new Date(item.horario).toLocaleString('pt-BR')}</span></div>)}</div> : <p className="muted">Ainda não há frequências registradas.</p>}</Card>
  </>;
}

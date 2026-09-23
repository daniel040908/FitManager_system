import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart3, Building2, CalendarCheck2, Check, ChevronDown, CircleDollarSign,
  ClipboardList, Dumbbell, FileBarChart, Home, Mail, MapPin,
  Phone, Plus, ReceiptText, RotateCcw, ShieldCheck, Trash2, TrendingDown, TrendingUp, User,
  UserRound, Users, WalletCards, X,
} from "lucide-react";
import athlete from "@/assets/fitmanager-athlete.jpg";
import { useFmData } from "@/lib/fm-store";

type Screen = "signup" | "quiz" | "ready" | "dashboard" | "students" | "attendance" | "finance" | "reports" | "profile" | "academy" | "security" | "new-student" | "student-list" | "expense" | "new-report";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { tone?: "primary" | "orange" | "green" | "outline"; compact?: boolean };
export function Button({ tone = "primary", compact, className = "", ...props }: ButtonProps) {
  return <button className={`fm-button fm-button-${tone} ${compact ? "fm-button-compact" : ""} ${className}`} {...props} />;
}

const navItems = [
  ["/dashboard", "Dashboard", Home], ["/alunos", "Alunos", Users], ["/frequencia", "Frequência", CalendarCheck2],
  ["/financeiro", "Financeiro", CircleDollarSign], ["/relatorios", "Relatórios", BarChart3],
] as const;

function Brand({ asButton }: { asButton?: boolean }) {
  const inner = <><span className="fm-brand-mark"><Dumbbell size={19} /></span><span><b>Fit<span>Manager</span></b><small>Gestão de Academias</small></span></>;
  if (!asButton) return <div className="fm-brand">{inner}</div>;
  return <Link className="fm-brand fm-brand-button" to="/" title="Voltar para o início">{inner}</Link>;
}

function Header() {
  const [open, setOpen] = useState(false);
  const { resetAll } = useFmData();
  return <header className="fm-header"><Brand asButton /><div className="fm-user-wrap"><Button aria-label="Abrir menu do perfil" className="fm-user" tone="outline" onClick={() => setOpen(!open)}><span className="fm-avatar"><UserRound size={17}/></span><span><b>Admin</b><small>Administrador</small></span><ChevronDown size={20}/></Button>{open && <div className="fm-popover"><Link to="/perfil">Meu perfil</Link><Link to="/perfil/academia">Informações</Link><Link to="/perfil/seguranca">Segurança</Link><button type="button" className="fm-popover-reset" onClick={() => { resetAll(); setOpen(false); }}><RotateCcw size={13}/>Limpar dados</button></div>}</div></header>;
}

function BottomNav() {
  return <nav className="fm-bottom-nav" aria-label="Navegação principal">{navItems.map(([to,label,Icon]) => <Link key={to} to={to} activeProps={{ className: "fm-nav-active" }}><Icon size={19}/><span>{label}</span></Link>)}</nav>;
}

function Shell({ children }: { children: ReactNode }) { return <div className="fm-stage"><div className="fm-phone"><Header/><main className="fm-main">{children}</main><BottomNav/></div></div>; }
function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) { return <div className="fm-title-row"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</div>; }
function Field({ label, number, ...props }: React.InputHTMLAttributes<HTMLInputElement> & {label: string; number?: number}) { return <label className="fm-field"><span>{number && <i>{number}</i>}{label}</span><input {...props}/></label>; }
function Empty({ icon, title, text }: {icon: ReactNode; title: string; text: string}) { return <div className="fm-empty"><span>{icon}</span><b>{title}</b><p>{text}</p></div>; }

/** Valor editável: o usuário digita os próprios números. */
function Metric({ icon, label, valueKey, placeholder = "—", foot, tone = "blue" }: { icon: ReactNode; label: string; valueKey: string; placeholder?: string; foot?: string; tone?: string }) {
  const { data, setValue } = useFmData();
  return <section className={`fm-metric fm-tone-${tone}`}>
    <div className="fm-metric-icon">{icon}</div>
    <div><small>{label}</small>
      <input className="fm-metric-input" aria-label={label} placeholder={placeholder} value={data.values[valueKey] ?? ""} onChange={(e) => setValue(valueKey, e.target.value)} />
      {foot && <span>{foot}</span>}
    </div>
  </section>;
}

function EditableRow({ label, valueKey, group = "academy", placeholder }: { label: string; valueKey: string; group?: "academy" | "profile"; placeholder?: string }) {
  const { data, setField } = useFmData();
  return <div><span>{label}</span><input className="fm-inline-input" aria-label={label} placeholder={placeholder ?? "Preencher"} value={data[group][valueKey] ?? ""} onChange={(e) => setField(group, valueKey, e.target.value)} /></div>;
}

function Signup() {
  const nav = useNavigate();
  function submit(e: FormEvent) { e.preventDefault(); nav({ to: "/onboarding" }); }
  return <div className="fm-stage"><div className="fm-auth"><div className="fm-auth-copy"><Brand asButton/><h1>Crie sua conta</h1><p>Preencha os dados abaixo e comece sua jornada.</p><form onSubmit={submit}><Field label="Nome completo" name="name" required/><Field label="E-mail" name="email" type="email" required/><Field label="Senha" name="password" type="password" required/><Button tone="orange" type="submit">Criar conta</Button></form></div><img src={athlete} width={768} height={1280} alt="Atleta em uma academia"/></div></div>;
}

const quizFields: [string, "academy", string][] = [
  ["Qual o nome da sua academia?", "academy", "name"],
  ["Em qual região está sua academia?", "academy", "region"],
  ["Em qual cidade está sua academia?", "academy", "city"],
  ["Quantas pessoas do sexo feminino tem na sua academia?", "academy", "female"],
  ["Quantas pessoas do sexo masculino tem na sua academia?", "academy", "male"],
];

function Quiz() {
  const nav = useNavigate();
  const { data, setField } = useFmData();
  function submit(e: FormEvent) { e.preventDefault(); nav({to:"/onboarding/pronto"}); }
  return <div className="fm-stage"><div className="fm-onboarding"><div className="fm-onboarding-head"><Brand asButton/></div><main><div className="fm-intro"><span><ClipboardList/></span><div><h1>Vamos conhecer sua academia</h1><p>Responda as perguntas para personalizar sua academia.</p></div></div><form onSubmit={submit}>{quizFields.map(([label, group, key], i)=>
    <Field key={key} label={label} number={i+1} value={data[group][key] ?? ""} onChange={(e) => setField(group, key, e.target.value)} />)}
    <Button type="submit">Próximo <span aria-hidden>›</span></Button></form></main></div></div>;
}

function Ready() {
  const { data } = useFmData();
  const a = data.academy;
  const total = [a['female'], a['male']].map((v) => Number(v) || 0).reduce((x, y) => x + y, 0);
  const show = (v?: string) => (v && v.trim() ? v : "—");
  return <div className="fm-stage"><div className="fm-onboarding"><div className="fm-onboarding-head"><Brand asButton/></div><main className="fm-ready"><span className="fm-check"><Check size={34}/></span><h1>Tudo pronto!</h1><p>Confira os dados informados antes de finalizar o cadastro.</p><div className="fm-summary"><div><Building2/><span><small>Nome da academia</small><b>{show(a['name'])}</b></span></div><div className="fm-summary-split"><span><MapPin/><em><small>Região</small><b>{show(a['region'])}</b></em></span><span><Users/><em><small>Total de alunos</small><b>{total || "—"}</b></em></span></div><div><Building2/><span><small>Cidade</small><b>{show(a['city'])}</b></span></div><div><Users/><span><small>Alunas / Alunos</small><b>{show(a['female'])} / {show(a['male'])}</b></span></div></div><Link className="fm-link-button fm-outline" to="/onboarding">Voltar</Link><Link className="fm-link-button fm-green" to="/dashboard">Finalizar</Link></main></div></div>;
}

function Dashboard() { return <Shell><PageTitle title="Dashboard" subtitle="Seja bem-vindo!"/><div className="fm-grid-2"><Metric icon={<Users/>} label="Alunos cadastrados" valueKey="students-total" tone="orange"/><Metric icon={<User/>} label="Alunos ativos" valueKey="students-active" tone="green"/><Metric icon={<CalendarCheck2/>} label="Presenças hoje" valueKey="checkins-today" tone="blue"/><Metric icon={<CircleDollarSign/>} label="Faturamento mensal" valueKey="revenue-month" placeholder="R$ 0,00" tone="purple"/></div></Shell>; }
function Students() { return <Shell><PageTitle title="Alunos" subtitle="Gerencie os alunos da sua academia" action={<Link className="fm-pill-action" to="/alunos/novo"><Plus/>Novo Aluno</Link>}/><div className="fm-grid-2"><Metric icon={<UserRound/>} label="Alunas (Feminino)" valueKey="female" tone="pink"/><Metric icon={<UserRound/>} label="Alunos (Masculino)" valueKey="male" tone="blue"/></div><div className="fm-large-panel"/><Link className="fm-link-button" to="/alunos/lista">Ver alunos</Link></Shell>; }
function Attendance() { return <Shell><PageTitle title="Frequência" subtitle="Gerencie a frequência dos alunos da sua academia"/><div className="fm-stack"><Metric icon={<Users/>} label="Presença Hoje" valueKey="present-today" tone="green"/><Metric icon={<X/>} label="Falta Hoje" valueKey="absent-today" tone="pink"/><Metric icon={<Users/>} label="Alunos Ativos" valueKey="students-active" foot="Total de alunos" tone="purple"/></div></Shell>; }
function Finance() { return <Shell><PageTitle title="Financeiro" subtitle="Gerencie as finanças da sua academia" action={<Link className="fm-pill-action" to="/financeiro/despesas/nova"><Plus/>nova despesa</Link>}/><div className="fm-grid-3"><Metric icon={<TrendingUp/>} label="Receitas" valueKey="income" placeholder="R$ 0,00" tone="green"/><Metric icon={<TrendingDown/>} label="Despesas" valueKey="expenses" placeholder="R$ 0,00" tone="pink"/><Metric icon={<WalletCards/>} label="Lucro Líquido" valueKey="profit" placeholder="R$ 0,00" tone="blue"/></div><div className="fm-twin"><section><h2>Movimentações</h2><Empty icon={<ReceiptText/>} title="Nenhuma movimentação" text="As entradas e saídas aparecerão aqui."/></section><section><h2>A receber</h2><Empty icon={<WalletCards/>} title="Nenhum valor a receber" text="Os valores a receber aparecerão aqui."/></section></div></Shell>; }
function Reports() { return <Shell><PageTitle title="Relatórios" subtitle="Veja relatórios dos alunos da sua academia" action={<Link className="fm-pill-action" to="/relatorios/novo"><Plus/>Novo Relatório</Link>}/><div className="fm-grid-3"><Metric icon={<Users/>} label="Total de alunos" valueKey="students-total" tone="purple"/><Metric icon={<CircleDollarSign/>} label="Receitas" valueKey="income" placeholder="R$ 0,00" tone="green"/><Metric icon={<CalendarCheck2/>} label="Frequência Média" valueKey="attendance-avg" placeholder="0%" tone="orange"/></div><h2 className="fm-section-title">Relatórios disponíveis</h2><Empty icon={<FileBarChart/>} title="Nenhum relatório disponível" text="Crie um novo relatório para começar a acompanhar os dados da sua academia."/></Shell>; }

function Profile() {
  const { data, setField } = useFmData();
  const p = data.profile;
  return <Shell><PageTitle title="Perfil"/><section className="fm-profile"><div className="fm-photo"><UserRound size={48}/></div>
    <input className="fm-profile-name" aria-label="Seu nome" placeholder="Seu nome" value={p['name'] ?? ""} onChange={(e) => setField("profile", "name", e.target.value)} />
    <strong>Administrador</strong>
    <ul>
      <li><Mail/><input className="fm-inline-input" aria-label="E-mail" placeholder="seu@email.com" value={p['email'] ?? ""} onChange={(e) => setField("profile","email",e.target.value)} /></li>
      <li><Phone/><input className="fm-inline-input" aria-label="Telefone" placeholder="(00) 00000-0000" value={p['phone'] ?? ""} onChange={(e) => setField("profile","phone",e.target.value)} /></li>
      <li><CalendarCheck2/><input className="fm-inline-input" aria-label="Membro desde" placeholder="Desde --/--/----" value={p['since'] ?? ""} onChange={(e) => setField("profile","since",e.target.value)} /></li>
    </ul>
    <Link className="fm-link-button" to="/perfil/academia">Editar perfil</Link><Link className="fm-link-button fm-outline" to="/perfil/seguranca">Alterar Senha</Link></section></Shell>;
}

function Academy() { return <Shell><PageTitle title="Informações"/><section className="fm-info-card"><h2><Building2/> Informações da academia</h2>
  <EditableRow label="Nome da Academia" valueKey="name"/><EditableRow label="CNPJ" valueKey="cnpj"/><EditableRow label="Endereço" valueKey="address"/><EditableRow label="Plano Contratado" valueKey="plan"/><EditableRow label="Vencimento do Plano" valueKey="planDue"/>
</section><Link className="fm-link-button fm-short" to="/perfil">Voltar</Link></Shell>; }

function Security() { return <Shell><PageTitle title="Informações"/><section className="fm-info-card"><h2><ShieldCheck/> Segurança da conta</h2><div><span>Senha</span><b>••••••</b></div><EditableRow label="Autenticação em dois fatores (2FA)" group="profile" valueKey="twofa" placeholder="Ativado / Desativado"/><EditableRow label="E-mail de recuperação" group="profile" valueKey="recovery" placeholder="seu@email.com"/></section><form className="fm-form-panel"><Field label="Alterar senha" type="password"/><Field label="Alterar E-mail" type="email"/><Button type="button">Confirmar alterações</Button></form></Shell>; }

function NewStudent() {
  const { addStudent } = useFmData();
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", age: "", height: "", weight: "", gender: "female" as "female" | "male" });
  function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    addStudent(form);
    nav({ to: "/alunos/lista" });
  }
  return <Shell><PageTitle title="Cadastre"/><form className="fm-form-spaced" onSubmit={submit}>
    <Field label="Nome completo:" number={1} value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})}/>
    <Field label="Qual a idade?" number={2} value={form.age} onChange={(e)=>setForm({...form, age: e.target.value})}/>
    <Field label="Qual sua altura?" number={3} value={form.height} onChange={(e)=>setForm({...form, height: e.target.value})}/>
    <Field label="Qual seu peso?" number={4} value={form.weight} onChange={(e)=>setForm({...form, weight: e.target.value})}/>
    <label className="fm-field"><span><i>5</i>Sexo</span>
      <select className="fm-select" value={form.gender} onChange={(e)=>setForm({...form, gender: e.target.value as "female" | "male"})}><option value="female">Feminino</option><option value="male">Masculino</option></select>
    </label>
    <Button type="submit">Salvar</Button></form></Shell>;
}

function StudentList() {
  const { data, removeStudent } = useFmData();
  return <Shell><PageTitle title="Seu aluno" action={<Link className="fm-pill-action" to="/alunos/novo"><Plus/>Novo Aluno</Link>}/>
    {data.students.length === 0
      ? <Empty icon={<Users/>} title="Nenhum aluno cadastrado" text="Cadastre seus alunos para vê-los nesta lista."/>
      : <div className="fm-student-list">{data.students.map((s)=><div key={s.id}><span className={`fm-gender ${s.gender}`}><UserRound/></span><b>{s.name}</b><span>{s.age}</span><span>{s.height}</span><span>{s.weight}</span><button type="button" className="fm-row-remove" aria-label={`Remover ${s.name}`} onClick={()=>removeStudent(s.id)}><Trash2 size={14}/></button></div>)}</div>}
    <Link className="fm-link-button fm-short" to="/alunos">Voltar</Link></Shell>;
}

function Expense() { return <Shell><PageTitle title="Registre suas despesas"/><form className="fm-form-spaced">{["Descrição da despesa","Categoria","Valor (R$)","Data","Forma de pagamento","Fornecedor"].map(l=><Field key={l} label={l}/>) }<Button type="button">Salvar</Button></form></Shell>; }
function NewReport() { return <Shell><PageTitle title="Relatório"/><form className="fm-form-spaced"><label className="fm-field"><span>Digite aqui...</span><textarea aria-label="Conteúdo do relatório"/></label><Button type="button">Salvar</Button></form></Shell>; }

export function FitManagerPage({ screen }: { screen: Screen }) {
  const screens: Record<Screen, ReactNode> = { signup:<Signup/>, quiz:<Quiz/>, ready:<Ready/>, dashboard:<Dashboard/>, students:<Students/>, attendance:<Attendance/>, finance:<Finance/>, reports:<Reports/>, profile:<Profile/>, academy:<Academy/>, security:<Security/>, "new-student":<NewStudent/>, "student-list":<StudentList/>, expense:<Expense/>, "new-report":<NewReport/> };
  return screens[screen];
}

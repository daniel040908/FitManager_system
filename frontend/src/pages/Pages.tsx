import { CrudPage, type Field } from './CrudPage';

const admin = () => JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null')?.perfil === 'ADMIN';
const instrutor = () => JSON.parse(localStorage.getItem('fitmanager_usuario') || 'null')?.perfil === 'INSTRUTOR';
export function Alunos() {
  const fields: Field[] = [
    { key: 'nome', label: 'Nome' }, { key: 'email', label: 'E-mail', type: 'email' },
    { key: 'senha', label: 'Senha', type: 'password', createOnly: true, required: true },
    { key: 'telefone', label: 'Telefone', required: false }, { key: 'cpf', label: 'CPF', required: false },
    { key: 'planoId', label: 'ID do plano', type: 'number', required: false }, { key: 'status', label: 'Status (ATIVO ou INATIVO)', required: false }
  ];
  return <CrudPage title="Alunos" path="/api/alunos" fields={fields} canCreate={admin()} canEdit={admin()} canDelete={admin()} />;
}
export function Instrutores() {
  return <CrudPage title="Instrutores" path="/api/instrutores" canCreate={admin()} canEdit={admin()} canDelete={admin()}
    fields={[{ key: 'nome', label: 'Nome' }, { key: 'email', label: 'E-mail', type: 'email' },
      { key: 'senha', label: 'Senha', type: 'password', createOnly: true, required: true },
      { key: 'cref', label: 'CREF', required: false }, { key: 'telefone', label: 'Telefone', required: false }]} />;
}
export function Planos() {
  return <CrudPage title="Planos" path="/api/planos" canCreate={admin()} canEdit={admin()} canDelete={admin()}
    fields={[{ key: 'nome', label: 'Nome' }, { key: 'descricao', label: 'Descrição', required: false },
      { key: 'valor', label: 'Valor', type: 'number' }, { key: 'duracaoMeses', label: 'Duração em meses', type: 'number' }]} />;
}
export function Treinos() {
  return <CrudPage title="Treinos" path="/api/treinos" canCreate={admin() || instrutor()} canEdit={admin() || instrutor()} canDelete={admin() || instrutor()}
    fields={[{ key: 'nome', label: 'Nome' }, { key: 'descricao', label: 'Descrição', required: false },
      { key: 'alunoId', label: 'ID do aluno', type: 'number' },
      ...(admin() ? [{ key: 'instrutorId', label: 'ID do instrutor', type: 'number', required: false } as Field] : [])]} />;
}
export function Frequencias() {
  return <CrudPage title="Frequências" path="/api/frequencias" canCreate={true} canEdit={false} canDelete={admin()}
    fields={[{ key: 'alunoId', label: 'ID do aluno', type: 'number', required: admin() || instrutor() }]} />;
}
export function Pagamentos() {
  return <CrudPage title="Pagamentos" path="/api/pagamentos" canCreate={admin()} canEdit={admin()} canDelete={admin()}
    fields={[{ key: 'alunoId', label: 'ID do aluno', type: 'number' }, { key: 'planoId', label: 'ID do plano', type: 'number', required: false },
      { key: 'valor', label: 'Valor', type: 'number' }, { key: 'vencimento', label: 'Vencimento', type: 'date' },
      { key: 'status', label: 'Status (PENDENTE, PAGO ou ATRASADO)', required: false }]} />;
}
export function Despesas() {
  return <CrudPage title="Despesas" path="/api/despesas" canCreate={admin()} canEdit={admin()} canDelete={admin()}
    fields={[{ key: 'descricao', label: 'Descrição' }, { key: 'categoria', label: 'Categoria' },
      { key: 'valor', label: 'Valor', type: 'number' }, { key: 'data', label: 'Data', type: 'date', required: false }]} />;
}

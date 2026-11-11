import { FormEvent, useCallback, useEffect, useState } from 'react';
import { get, post, put, remove } from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export type Field = { key: string; label: string; type?: string; required?: boolean; createOnly?: boolean };
type Item = Record<string, unknown>;
type Props = { title: string; path: string; fields: Field[]; canEdit?: boolean; canDelete?: boolean; canCreate?: boolean; description?: string };

function valueAt(item: Item, key: string): string {
  const value = key.split('.').reduce<unknown>((current, part) => current && typeof current === 'object' ? (current as Item)[part] : undefined, item);
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}
function payloadFrom(form: Record<string, string>, fields: Field[], editing: boolean) {
  return Object.fromEntries(fields.filter((field) => !(editing && field.createOnly) && form[field.key] !== undefined && !(editing && field.key === 'senha' && !form[field.key]))
    .map((field) => [field.key, field.type === 'number' ? (form[field.key] ? Number(form[field.key]) : null) : form[field.key]]));
}
export function CrudPage({ title, path, fields, canEdit = false, canDelete = false, canCreate = true, description }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [form, setForm] = useState<Record<string, string>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [pagina, setPagina] = useState(1);
  const porPagina = 8;
  const load = useCallback(async () => {
    setLoading(true);
    try { setItems(await get<Item[]>(path)); setErro(''); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível carregar os dados.'); }
    finally { setLoading(false); }
  }, [path]);
  useEffect(() => { void load(); }, [load]);

  function reset() { setForm({}); setEditing(null); }
  function startEdit(item: Item) {
    const id = Number(item.id);
    setEditing(id);
    setForm(Object.fromEntries(fields.map((field) => [field.key, field.type === 'date' ? valueAt(item, field.key).slice(0, 10) : valueAt(item, field.key)])));
    setErro('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true); setErro('');
    try {
      const payload = payloadFrom(form, fields, editing !== null);
      if (editing === null) await post(path, payload);
      else await put(`${path}/${editing}`, payload);
      reset(); await load();
    } catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível salvar.'); }
    finally { setSaving(false); }
  }
  async function excluir(item: Item) {
    if (!window.confirm('Deseja realmente excluir este registro?')) return;
    try { await remove(`${path}/${Number(item.id)}`); await load(); }
    catch (error) { setErro(error instanceof Error ? error.message : 'Não foi possível excluir.'); }
  }
  const filtrados = items.filter((item) => JSON.stringify(item).toLocaleLowerCase().includes(busca.toLocaleLowerCase()));
  const totalPaginas = Math.max(1, Math.ceil(filtrados.length / porPagina));
  const paginaAtual = Math.min(pagina, totalPaginas);
  const visiveis = filtrados.slice((paginaAtual - 1) * porPagina, paginaAtual * porPagina);
  const nomePrincipal = (item: Item) => valueAt(item, 'nome') || valueAt(item, 'descricao') || valueAt(item, 'usuario.nome') || valueAt(item, 'aluno.usuario.nome') || `Registro #${item.id}`;
  const resumo = (item: Item) => fields.filter((field) => !['senha', 'nome', 'email'].includes(field.key)).slice(0, 3)
    .map((field) => `${field.label}: ${valueAt(item, field.key) || '—'}`).join(' · ');

  return <>
    <div className="page-heading"><div><h1>{title}</h1><p>{description || 'Consulte e gerencie os registros cadastrados.'}</p></div><span className="count-pill">{items.length} registro(s)</span></div>
    {erro && <div className="alert" role="alert">{erro}</div>}
    {(canCreate || editing !== null) && <Card><div className="section-heading"><h2>{editing === null ? 'Novo cadastro' : `Editar registro #${editing}`}</h2>{editing !== null && <Button type="button" variant="secondary" onClick={reset}>Cancelar edição</Button>}</div>
      <form className="form-grid" onSubmit={submit}>
        {fields.filter((field) => !(editing !== null && field.createOnly)).map((field) =>
          <label key={field.key}>{field.label}
            <input type={field.type || 'text'} value={form[field.key] || ''} onChange={(event) => setForm((current) => ({ ...current, [field.key]: event.target.value }))}
              required={field.required ?? (field.key !== 'descricao' && field.key !== 'senha' && field.key !== 'instrutorId' && field.key !== 'planoId')}
              min={field.type === 'number' ? 0 : undefined} step={field.type === 'number' ? 'any' : undefined}
              placeholder={field.key === 'senha' && editing !== null ? 'Deixe em branco para manter a senha atual' : undefined} />
          </label>)}
        <div className="form-actions"><Button type="submit" disabled={saving}>{saving ? 'Salvando...' : editing === null ? 'Cadastrar' : 'Salvar alterações'}</Button></div>
      </form>
    </Card>}
    <Card>
      <div className="section-heading list-heading"><h2>Registros</h2><input className="search-input" placeholder="Buscar..." value={busca} onChange={(event) => { setBusca(event.target.value); setPagina(1); }} /></div>
      {loading ? <p className="muted">Carregando...</p> : filtrados.length === 0 ? <p className="muted">Nenhum registro encontrado.</p> :
        <>
          <div className="records-list">{visiveis.map((item) => <article className="record" key={String(item.id)}>
            <div className="record-info"><strong>{nomePrincipal(item)}</strong><span>{valueAt(item, 'email') || valueAt(item, 'usuario.email')}</span><small>{resumo(item)}</small></div>
            {(canEdit || canDelete) && <div className="record-actions">{canEdit && <Button type="button" variant="secondary" onClick={() => startEdit(item)}>Editar</Button>}{canDelete && <Button type="button" variant="danger" onClick={() => void excluir(item)}>Excluir</Button>}</div>}
          </article>)}</div>
          {filtrados.length > porPagina && <div className="pagination">
            <span>Exibindo {(paginaAtual - 1) * porPagina + 1}–{Math.min(paginaAtual * porPagina, filtrados.length)} de {filtrados.length}</span>
            <div><Button type="button" variant="secondary" disabled={paginaAtual === 1} onClick={() => setPagina(paginaAtual - 1)}>Anterior</Button>
            <span className="page-number">Página {paginaAtual} de {totalPaginas}</span>
            <Button type="button" variant="secondary" disabled={paginaAtual === totalPaginas} onClick={() => setPagina(paginaAtual + 1)}>Próxima</Button></div>
          </div>}
        </>}
    </Card>
  </>;
}

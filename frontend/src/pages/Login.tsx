import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { post } from '../services/api';

type LoginResponse = { token: string; usuario: { id: number; nome: string; email: string; perfil: string } };
export function Login() {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setErro('');
    setCarregando(true);
    try {
      const response = await post<LoginResponse>('/auth/login', { email, senha });
      localStorage.setItem('fitmanager_token', response.token);
      localStorage.setItem('fitmanager_usuario', JSON.stringify(response.usuario));
      nav('/', { replace: true });
    } catch (error) {
      setErro(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setCarregando(false);
    }
  }

  return <div className="login">
    <form className="card login-card" onSubmit={submit}>
      <div className="brand-mark">FM</div>
      <h1>FitManager</h1>
      <p>Gestão de academias em um só lugar.</p>
      <label>E-mail<input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
      <label>Senha<input type="password" autoComplete="current-password" value={senha} onChange={(e) => setSenha(e.target.value)} required minLength={6} /></label>
      {erro && <p className="error" role="alert">{erro}</p>}
      <button className="btn" disabled={carregando}>{carregando ? 'Entrando...' : 'Entrar'}</button>
    </form>
  </div>;
}

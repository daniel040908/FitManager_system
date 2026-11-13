import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

type PerfilAcesso = 'ADMIN' | 'INSTRUTOR';

export function Login() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState<PerfilAcesso>('ADMIN');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const validarSenhaLocal = (valor: string): string | null => {
    if (valor.length < 12) {
      return 'A senha deve ter no mínimo 12 caracteres.';
    }
    if (!/[A-Z]/.test(valor)) {
      return 'A senha deve conter no mínimo uma letra maiúscula.';
    }
    if (!/[a-z]/.test(valor)) {
      return 'A senha deve conter no mínimo uma letra minúscula.';
    }
    const especiais = valor.match(/[^A-Za-z0-9]/g) || [];
    if (especiais.length > 1) {
      return 'A senha pode conter no máximo um caractere especial.';
    }
    return null;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!nome.trim()) {
      setErro('Informe o seu nome.');
      return;
    }

    const erroSenha = validarSenhaLocal(senha);
    if (erroSenha) {
      setErro(erroSenha);
      return;
    }

    setCarregando(true);

    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3333';
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: nome.trim(),
          email: email.trim(),
          senha,
          perfil,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.erro || 'Não foi possível realizar o login.');
        return;
      }

      localStorage.setItem('fitmanager_token', data.token);
      localStorage.setItem('fitmanager_usuario', JSON.stringify(data.usuario));
      navigate('/');
    } catch {
      setErro('Erro de conexão com o servidor. Verifique se o backend está rodando.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-container" style={{ maxWidth: 420, margin: '60px auto', padding: 24 }}>
      <div style={{ marginBottom: 24, textAlign: 'center' }}>
        <h1>FitManager</h1>
        <p>Sistema de Gestão para Academias</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label htmlFor="perfil" style={{ display: 'block', marginBottom: 6, fontWeight: 600 }}>
            Tipo de Acesso
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              onClick={() => setPerfil('ADMIN')}
              style={{
                flex: 1,
                padding: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: perfil === 'ADMIN' ? '#2563eb' : '#e5e7eb',
                color: perfil === 'ADMIN' ? '#fff' : '#111827',
                border: 'none',
                borderRadius: 6,
              }}
            >
              Administrador
            </button>
            <button
              type="button"
              onClick={() => setPerfil('INSTRUTOR')}
              style={{
                flex: 1,
                padding: '10px',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: perfil === 'INSTRUTOR' ? '#2563eb' : '#e5e7eb',
                color: perfil === 'INSTRUTOR' ? '#fff' : '#111827',
                border: 'none',
                borderRadius: 6,
              }}
            >
              Instrutor
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="nome" style={{ display: 'block', marginBottom: 4 }}>
            Seu Nome
          </label>
          <input
            id="nome"
            type="text"
            placeholder={perfil === 'ADMIN' ? 'Digite o nome do administrador' : 'Digite o nome do instrutor'}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: 4 }}>
            E-mail
          </label>
          <input
            id="email"
            type="email"
            placeholder="seuemail@fitmanager.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        <div>
          <label htmlFor="senha" style={{ display: 'block', marginBottom: 4 }}>
            Senha
          </label>
          <input
            id="senha"
            type="password"
            placeholder="Mín. 12 caracteres (1 Maiúscula, minúsculas e até 1 especial)"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            style={{ width: '100%', padding: 10, borderRadius: 6, border: '1px solid #ccc' }}
          />
        </div>

        {erro && (
          <div style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: 10, borderRadius: 6, fontSize: 14 }}>
            {erro}
          </div>
        )}

        <button
          type="submit"
          disabled={carregando}
          style={{
            padding: 12,
            backgroundColor: '#16a34a',
            color: '#fff',
            fontWeight: 600,
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer',
            marginTop: 6,
          }}
        >
          {carregando ? 'Entrando...' : `Entrar como ${perfil === 'ADMIN' ? 'Administrador' : 'Instrutor'}`}
        </button>
      </form>
    </div>
  );
}

export default Login;

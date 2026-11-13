import assert from 'node:assert/strict';
import { once } from 'node:events';
import test, { after, before } from 'node:test';
import jwt from 'jsonwebtoken';

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'mysql://fitmanager_test:fitmanager_test@127.0.0.1:3306/fitmanager_test';
}

const [{ default: app }, { jwtConfig }] = await Promise.all([
  import('../src/app.js'),
  import('../src/config/jwt.js')
]);

let server;
let baseUrl;

before(async () => {
  server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (!server) return;
  await new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
    server.closeAllConnections();
  });
});

function tokenFor(perfil) {
  return jwt.sign({ id: 1, perfil, nome: 'Usuário de teste' }, jwtConfig.secret);
}

async function request(path, { perfil, ...options } = {}) {
  const headers = new Headers(options.headers);
  if (perfil) headers.set('Authorization', `Bearer ${tokenFor(perfil)}`);
  return fetch(`${baseUrl}${path}`, { ...options, headers });
}

test('GET /health returns the application health status', async () => {
  const response = await request('/health');

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', app: 'FitManager' });
});

test('GET /docs.json exposes the OpenAPI specification', async () => {
  const response = await request('/docs.json');
  const spec = await response.json();

  assert.equal(response.status, 200);
  assert.equal(spec.openapi, '3.0.0');
  assert.equal(spec.info.title, 'FitManager API');
  assert.ok(spec.paths['/auth/login'].post);
  assert.ok(spec.paths['/api/usuarios'].get);
  assert.ok(spec.paths['/health/db'].get);
});

test('protected API routes reject requests without a token', async () => {
  const response = await request('/api/usuarios');

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { erro: 'Token não informado.' });
});

test('protected API routes reject invalid bearer tokens', async () => {
  const response = await request('/api/usuarios', {
    headers: { Authorization: 'Bearer token-invalido' }
  });

  assert.equal(response.status, 401);
  assert.deepEqual(await response.json(), { erro: 'Token inválido ou expirado.' });
});

test('admin-only endpoints reject users with other profiles before database access', async (t) => {
  const cases = [
    { method: 'GET', path: '/api/usuarios', perfil: 'INSTRUTOR' },
    { method: 'POST', path: '/api/usuarios', perfil: 'INSTRUTOR' },
    { method: 'GET', path: '/api/instrutores', perfil: 'ALUNO' },
    { method: 'POST', path: '/api/instrutores', perfil: 'INSTRUTOR' },
    { method: 'GET', path: '/api/pagamentos', perfil: 'INSTRUTOR' },
    { method: 'GET', path: '/api/relatorios/geral', perfil: 'INSTRUTOR' },
    { method: 'POST', path: '/api/treinos', perfil: 'ALUNO' }
  ];

  for (const endpoint of cases) {
    await t.test(`${endpoint.method} ${endpoint.path} rejects ${endpoint.perfil}`, async () => {
      const response = await request(endpoint.path, {
        method: endpoint.method,
        perfil: endpoint.perfil
      });

      assert.equal(response.status, 403);
      assert.deepEqual(await response.json(), { erro: 'Acesso negado.' });
    });
  }
});

test('POST /api/usuarios validates required data before accessing the database', async () => {
  const response = await request('/api/usuarios', {
    method: 'POST',
    perfil: 'ADMIN',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({})
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    erro: 'Informe nome, e-mail válido, senha com ao menos 6 caracteres e perfil válido.'
  });
});

test('POST /auth/login rejects invalid input before accessing the database', async () => {
  const response = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'email-invalido', senha: '123' })
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), {
    erro: 'Informe um e-mail válido e uma senha com ao menos 6 caracteres.'
  });
});

test('API returns a JSON client error for malformed request bodies', async () => {
  const response = await request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{'
  });

  assert.equal(response.status, 400);
  assert.deepEqual(await response.json(), { erro: 'JSON inválido.' });
});

test('unknown routes return the documented JSON 404 response', async () => {
  const response = await request('/rota-que-nao-existe');

  assert.equal(response.status, 404);
  assert.deepEqual(await response.json(), { erro: 'Rota não encontrada.' });
});

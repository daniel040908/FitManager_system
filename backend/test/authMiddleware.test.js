import assert from 'node:assert/strict';
import test from 'node:test';
import jwt from 'jsonwebtoken';
import { autenticar, permitir } from '../src/middlewares/authMiddleware.js';
import { jwtConfig } from '../src/config/jwt.js';

function criarResposta() {
  return {
    statusCode: null,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(body) {
      this.body = body;
      return this;
    }
  };
}

test('autenticar rejeita requisição sem token', () => {
  const req = { headers: {} };
  const res = criarResposta();
  let chamouNext = false;

  autenticar(req, res, () => { chamouNext = true; });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { erro: 'Token não informado.' });
  assert.equal(chamouNext, false);
});

test('autenticar rejeita token inválido', () => {
  const req = { headers: { authorization: 'Bearer token-invalido' } };
  const res = criarResposta();
  let chamouNext = false;

  autenticar(req, res, () => { chamouNext = true; });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { erro: 'Token inválido ou expirado.' });
  assert.equal(chamouNext, false);
});

test('autenticar rejeita token expirado', () => {
  const token = jwt.sign({ id: 1, perfil: 'ADMIN' }, jwtConfig.secret, { expiresIn: '-1s' });
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = criarResposta();
  let chamouNext = false;

  autenticar(req, res, () => { chamouNext = true; });

  assert.equal(res.statusCode, 401);
  assert.deepEqual(res.body, { erro: 'Token inválido ou expirado.' });
  assert.equal(chamouNext, false);
});

test('autenticar adiciona os dados do usuário e continua com token válido', () => {
  const usuario = { id: 7, perfil: 'INSTRUTOR' };
  const token = jwt.sign(usuario, jwtConfig.secret);
  const req = { headers: { authorization: `Bearer ${token}` } };
  const res = criarResposta();
  let chamouNext = false;

  autenticar(req, res, () => { chamouNext = true; });

  assert.equal(req.usuario.id, usuario.id);
  assert.equal(req.usuario.perfil, usuario.perfil);
  assert.equal(chamouNext, true);
  assert.equal(res.statusCode, null);
});

test('permitir autoriza usuário com perfil permitido', () => {
  const req = { usuario: { perfil: 'ADMIN' } };
  const res = criarResposta();
  let chamouNext = false;

  permitir('ADMIN', 'INSTRUTOR')(req, res, () => { chamouNext = true; });

  assert.equal(chamouNext, true);
  assert.equal(res.statusCode, null);
});

test('permitir rejeita usuário sem perfil autorizado', () => {
  const req = { usuario: { perfil: 'INSTRUTOR' } };
  const res = criarResposta();
  let chamouNext = false;

  permitir('ADMIN')(req, res, () => { chamouNext = true; });

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { erro: 'Acesso negado.' });
  assert.equal(chamouNext, false);
});

test('permitir rejeita requisição sem usuário autenticado', () => {
  const req = {};
  const res = criarResposta();
  let chamouNext = false;

  permitir('ADMIN')(req, res, () => { chamouNext = true; });

  assert.equal(res.statusCode, 403);
  assert.deepEqual(res.body, { erro: 'Acesso negado.' });
  assert.equal(chamouNext, false);
});

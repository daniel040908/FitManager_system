import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

// Classe simples de erro para validações
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Helper para validar e sanitizar tipos básicos
const validate = {
  id(val, fieldName = 'id') {
    const num = Number(val);
    if (isNaN(num) || !Number.isInteger(num) || num <= 0) {
      throw new ValidationError(`O campo '${fieldName}' deve ser um ID inteiro e positivo.`);
    }
    return num;
  },

  string(val, { min, trim = true, optional = false, nullable = false } = {}, fieldName = 'campo') {
    if (val === undefined || val === null) {
      if (val === null && nullable) return null;
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    let str = String(val);
    if (trim) str = str.trim();
    if (min !== undefined && str.length < min) {
      throw new ValidationError(`O campo '${fieldName}' deve ter no mínimo ${min} caracteres.`);
    }
    return str;
  },

  email(val, { optional = false } = {}, fieldName = 'email') {
    if (val === undefined || val === null) {
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    const str = String(val).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(str)) {
      throw new ValidationError(`O campo '${fieldName}' deve ser um email válido.`);
    }
    return str;
  },

  number(val, { integer = false, positive = false, nonnegative = false, optional = false, nullable = false } = {}, fieldName = 'campo') {
    if (val === undefined || val === null) {
      if (val === null && nullable) return null;
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    const num = Number(val);
    if (isNaN(num)) throw new ValidationError(`O campo '${fieldName}' deve ser um número válido.`);
    if (integer && !Number.isInteger(num)) throw new ValidationError(`O campo '${fieldName}' deve ser um número inteiro.`);
    if (positive && num <= 0) throw new ValidationError(`O campo '${fieldName}' deve ser positivo.`);
    if (nonnegative && num < 0) throw new ValidationError(`O campo '${fieldName}' não pode ser negativo.`);
    return num;
  },

  boolean(val, { optional = false } = {}, fieldName = 'campo') {
    if (val === undefined || val === null) {
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    return Boolean(val);
  },

  enum(val, allowedValues, { optional = false, defaultValue } = {}, fieldName = 'campo') {
    if (val === undefined || val === null) {
      if (defaultValue !== undefined) return defaultValue;
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    if (!allowedValues.includes(val)) {
      throw new ValidationError(`O campo '${fieldName}' deve ser um dos seguintes valores: ${allowedValues.join(', ')}.`);
    }
    return val;
  },

  date(val, { optional = false, nullable = false } = {}, fieldName = 'campo') {
    if (val === undefined || val === null) {
      if (val === null && nullable) return null;
      if (optional) return undefined;
      throw new ValidationError(`O campo '${fieldName}' é obrigatório.`);
    }
    const d = new Date(val);
    if (isNaN(d.getTime())) throw new ValidationError(`O campo '${fieldName}' deve ser uma data válida.`);
    return d;
  }
};

// Funções de parsing por esquema
function parseId(value) {
  return validate.id(value, 'id');
}

function parseUsuario(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};
  
  if (!partial || body.nome !== undefined) res.nome = validate.string(body.nome, { min: 2, optional: partial }, 'nome');
  if (!partial || body.email !== undefined) res.email = validate.email(body.email, { optional: partial }, 'email');
  if (!partial || body.senha !== undefined) res.senha = validate.string(body.senha, { min: 6, optional: true }, 'senha');
  if (!partial || body.perfil !== undefined) res.perfil = validate.enum(body.perfil, ['ADMIN', 'INSTRUTOR', 'ALUNO'], { optional: partial, defaultValue: 'ALUNO' }, 'perfil');

  return res;
}

function parsePlano(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};

  if (!partial || body.nome !== undefined) res.nome = validate.string(body.nome, { min: 2, optional: partial }, 'nome');
  if (!partial || body.descricao !== undefined) res.descricao = validate.string(body.descricao, { optional: true, nullable: true }, 'descricao');
  if (!partial || body.valor !== undefined) res.valor = validate.number(body.valor, { nonnegative: true, optional: partial }, 'valor');
  if (!partial || body.duracaoMeses !== undefined) res.duracaoMeses = validate.number(body.duracaoMeses, { integer: true, positive: true, optional: partial }, 'duracaoMeses');
  if (!partial || body.ativo !== undefined) res.ativo = validate.boolean(body.ativo, { optional: true }, 'ativo');

  return res;
}

function parseAluno(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};

  if (!partial || body.nome !== undefined) res.nome = validate.string(body.nome, { min: 2, optional: partial }, 'nome');
  if (!partial || body.email !== undefined) res.email = validate.email(body.email, { optional: partial }, 'email');
  if (!partial || body.senha !== undefined) res.senha = validate.string(body.senha, { min: 6, optional: true }, 'senha');
  if (!partial || body.cpf !== undefined) res.cpf = validate.string(body.cpf, { optional: true, nullable: true }, 'cpf');
  if (!partial || body.telefone !== undefined) res.telefone = validate.string(body.telefone, { optional: true, nullable: true }, 'telefone');
  if (!partial || body.planoId !== undefined) res.planoId = body.planoId ? validate.id(body.planoId, 'planoId') : body.planoId;
  if (!partial || body.status !== undefined) res.status = validate.enum(body.status, ['ATIVO', 'INATIVO'], { optional: true }, 'status');

  return res;
}

function parseInstrutor(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};

  if (!partial || body.nome !== undefined) res.nome = validate.string(body.nome, { min: 2, optional: partial }, 'nome');
  if (!partial || body.email !== undefined) res.email = validate.email(body.email, { optional: partial }, 'email');
  if (!partial || body.senha !== undefined) res.senha = validate.string(body.senha, { min: 6, optional: true }, 'senha');
  if (!partial || body.cref !== undefined) res.cref = validate.string(body.cref, { optional: true, nullable: true }, 'cref');
  if (!partial || body.telefone !== undefined) res.telefone = validate.string(body.telefone, { optional: true, nullable: true }, 'telefone');

  return res;
}

function parseTreino(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};

  if (!partial || body.nome !== undefined) res.nome = validate.string(body.nome, { min: 2, optional: partial }, 'nome');
  if (!partial || body.descricao !== undefined) res.descricao = validate.string(body.descricao, { optional: true, nullable: true }, 'descricao');
  if (!partial || body.alunoId !== undefined) res.alunoId = validate.id(body.alunoId, 'alunoId');
  if (!partial || body.instrutorId !== undefined) res.instrutorId = body.instrutorId ? validate.id(body.instrutorId, 'instrutorId') : body.instrutorId;

  return res;
}

function parseFrequencia(body) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  return {
    alunoId: validate.id(body.alunoId, 'alunoId'),
    presente: validate.boolean(body.presente, { optional: true })
  };
}

function parsePagamento(body, partial = false) {
  if (!body) throw new ValidationError('O corpo da requisição é obrigatório.');
  const res = {};

  if (!partial || body.alunoId !== undefined) res.alunoId = validate.id(body.alunoId, 'alunoId');
  if (!partial || body.planoId !== undefined) res.planoId = body.planoId ? validate.id(body.planoId, 'planoId') : body.planoId;
  if (!partial || body.valor !== undefined) res.valor = validate.number(body.valor, { nonnegative: true, optional: partial }, 'valor');
  if (!partial || body.vencimento !== undefined) res.vencimento = validate.date(body.vencimento, { optional: partial }, 'vencimento');
  if (!partial || body.status !== undefined) res.status = validate.enum(body.status, ['PENDENTE', 'PAGO', 'ATRASADO'], { optional: true }, 'status');
  if (!partial || body.pagoEm !== undefined) res.pagoEm = validate.date(body.pagoEm, { optional: true, nullable: true }, 'pagoEm');

  return res;
}

function sanitizeUsuario(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil, createdAt: usuario.createdAt };
}

// Controller logic

export async function listarUsuarios(_req, res) {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, perfil: true, createdAt: true },
    orderBy: { id: 'desc' }
  });
  res.json(usuarios);
}

export async function criarUsuario(req, res) {
  const dados = parseUsuario(req.body);
  if (!dados.senha) return res.status(400).json({ erro: 'A senha é obrigatória.' });
  const senha = await bcrypt.hash(dados.senha, 10);
  const usuario = await prisma.usuario.create({ data: { ...dados, senha } });
  res.status(201).json(sanitizeUsuario(usuario));
}

export async function atualizarUsuario(req, res) {
  const id = parseId(req.params.id);
  const dados = parseUsuario(req.body, true);
  const data = { ...dados };
  if (data.senha) data.senha = await bcrypt.hash(data.senha, 10);
  const usuario = await prisma.usuario.update({ where: { id }, data });
  res.json(sanitizeUsuario(usuario));
}

export async function deletarUsuario(req, res) {
  const id = parseId(req.params.id);
  if (id === req.usuario.id) return res.status(400).json({ erro: 'Não é permitido excluir o próprio usuário logado.' });
  await prisma.usuario.delete({ where: { id } });
  res.status(204).send();
}

const alunoInclude = {
  usuario: { select: { id: true, nome: true, email: true } },
  plano: true
};

export async function listarAlunos(_req, res) {
  res.json(await prisma.aluno.findMany({ include: alunoInclude, orderBy: { id: 'desc' } }));
}

export async function criarAluno(req, res) {
  const dados = parseAluno(req.body);
  const senha = await bcrypt.hash(dados.senha || '123456', 10);
  const { nome, email, cpf, telefone, planoId, status } = dados;
  const aluno = await prisma.aluno.create({
    data: {
      cpf: cpf || undefined,
      telefone: telefone || undefined,
      planoId: planoId || undefined,
      status: status || 'ATIVO',
      usuario: { create: { nome, email, senha, perfil: 'ALUNO' } }
    },
    include: alunoInclude
  });
  res.status(201).json(aluno);
}

export async function atualizarAluno(req, res) {
  const id = parseId(req.params.id);
  const dados = parseAluno(req.body, true);
  const { nome, email, senha, cpf, telefone, planoId, status } = dados;
  const aluno = await prisma.aluno.update({
    where: { id },
    data: {
      cpf, telefone, planoId, status,
      usuario: {
        update: {
          ...(nome !== undefined ? { nome } : {}),
          ...(email !== undefined ? { email } : {}),
          ...(senha ? { senha: await bcrypt.hash(senha, 10) } : {})
        }
      }
    },
    include: alunoInclude
  });
  res.json(aluno);
}

export async function deletarAluno(req, res) {
  await prisma.aluno.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

const instrutorInclude = { usuario: { select: { id: true, nome: true, email: true } } };

export async function listarInstrutores(_req, res) {
  res.json(await prisma.instrutor.findMany({ include: instrutorInclude, orderBy: { id: 'desc' } }));
}

export async function criarInstrutor(req, res) {
  const dados = parseInstrutor(req.body);
  const senha = await bcrypt.hash(dados.senha || '123456', 10);
  const item = await prisma.instrutor.create({
    data: {
      cref: dados.cref || undefined,
      telefone: dados.telefone || undefined,
      usuario: { create: { nome: dados.nome, email: dados.email, senha, perfil: 'INSTRUTOR' } }
    },
    include: instrutorInclude
  });
  res.status(201).json(item);
}

export async function atualizarInstrutor(req, res) {
  const id = parseId(req.params.id);
  const dados = parseInstrutor(req.body, true);
  const item = await prisma.instrutor.update({
    where: { id },
    data: {
      cref: dados.cref,
      telefone: dados.telefone,
      usuario: {
        update: {
          ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
          ...(dados.email !== undefined ? { email: dados.email } : {}),
          ...(dados.senha ? { senha: await bcrypt.hash(dados.senha, 10) } : {})
        }
      }
    },
    include: instrutorInclude
  });
  res.json(item);
}

export async function deletarInstrutor(req, res) {
  await prisma.instrutor.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

export async function listarPlanos(_req, res) {
  res.json(await prisma.plano.findMany({ orderBy: { id: 'desc' } }));
}

export async function criarPlano(req, res) {
  const dados = parsePlano(req.body);
  const item = await prisma.plano.create({ data: dados });
  res.status(201).json(item);
}

export async function atualizarPlano(req, res) {
  const item = await prisma.plano.update({ 
    where: { id: parseId(req.params.id) }, 
    data: parsePlano(req.body, true) 
  });
  res.json(item);
}

export async function deletarPlano(req, res) {
  await prisma.plano.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

export async function listarTreinos(_req, res) {
  res.json(await prisma.treino.findMany({
    include: {
      aluno: { include: { usuario: { select: { nome: true } } } },
      instrutor: { include: { usuario: { select: { nome: true } } } }
    },
    orderBy: { id: 'desc' }
  }));
}

export async function criarTreino(req, res) {
  const item = await prisma.treino.create({ data: parseTreino(req.body) });
  res.status(201).json(item);
}

export async function atualizarTreino(req, res) {
  const item = await prisma.treino.update({ 
    where: { id: parseId(req.params.id) }, 
    data: parseTreino(req.body, true) 
  });
  res.json(item);
}

export async function deletarTreino(req, res) {
  await prisma.treino.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

export async function listarFrequencias(_req, res) {
  res.json(await prisma.frequencia.findMany({
    include: { aluno: { include: { usuario: { select: { nome: true } } } } },
    orderBy: { horario: 'desc' }
  }));
}

export async function registrarFrequencia(req, res) {
  const item = await prisma.frequencia.create({ data: parseFrequencia(req.body) });
  res.status(201).json(item);
}

export async function deletarFrequencia(req, res) {
  await prisma.frequencia.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

export async function listarPagamentos(_req, res) {
  res.json(await prisma.pagamento.findMany({
    include: { aluno: { include: { usuario: { select: { nome: true } } } }, plano: true },
    orderBy: { vencimento: 'desc' }
  }));
}

export async function criarPagamento(req, res) {
  const item = await prisma.pagamento.create({ data: parsePagamento(req.body) });
  res.status(201).json(item);
}

export async function atualizarPagamento(req, res) {
  const item = await prisma.pagamento.update({ 
    where: { id: parseId(req.params.id) }, 
    data: parsePagamento(req.body, true) 
  });
  res.json(item);
}

export async function deletarPagamento(req, res) {
  await prisma.pagamento.delete({ where: { id: parseId(req.params.id) } });
  res.status(204).send();
}

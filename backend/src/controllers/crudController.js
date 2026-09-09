import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

function erro(res, mensagem) {
  res.status(400).json({ erro: mensagem });
  return null;
}

function texto(valor, campo, res, obrigatorio = true) {
  if (valor === undefined || valor === null || valor === '') {
    return obrigatorio ? erro(res, `${campo} é obrigatório.`) : undefined;
  }
  if (typeof valor !== 'string' || !valor.trim()) return erro(res, `${campo} inválido.`);
  return valor.trim();
}

function email(valor, res) {
  const resultado = texto(valor, 'email', res);
  if (!resultado) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resultado)) return erro(res, 'E-mail inválido.');
  return resultado;
}

function numero(valor, campo, res, opcional = false) {
  if ((valor === undefined || valor === null || valor === '') && opcional) return undefined;
  const resultado = Number(valor);
  if (!Number.isFinite(resultado) || resultado <= 0 || !Number.isInteger(resultado)) return erro(res, `${campo} deve ser um inteiro positivo.`);
  return resultado;
}

function valorNumerico(valor, campo, res) {
  const resultado = Number(valor);
  if (!Number.isFinite(resultado) || resultado < 0) return erro(res, `${campo} deve ser um número válido.`);
  return resultado;
}

function pessoa(req, res, senhaObrigatoria = false) {
  const nome = texto(req.body.nome, 'nome', res);
  const usuarioEmail = email(req.body.email, res);
  const senha = req.body.senha || '123456';
  if (!nome || !usuarioEmail) return null;
  if ((senhaObrigatoria || req.body.senha) && (typeof senha !== 'string' || senha.length < 6)) return erro(res, 'A senha deve ter pelo menos 6 caracteres.');
  return { nome, email: usuarioEmail, senha };
}

export async function listarUsuarios(_req, res) {
  const usuarios = await prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, perfil: true, createdAt: true },
    orderBy: { id: 'desc' },
  });
  return res.json(usuarios);
}

export async function criarUsuario(req, res) {
  const dados = pessoa(req, res, true);
  if (!dados) return;
  const perfil = req.body.perfil || 'ALUNO';
  if (!['ADMIN', 'INSTRUTOR', 'ALUNO'].includes(perfil)) return erro(res, 'Perfil inválido.');
  const usuario = await prisma.usuario.create({
    data: { ...dados, senha: await bcrypt.hash(dados.senha, 10), perfil },
    select: { id: true, nome: true, email: true, perfil: true, createdAt: true },
  });
  return res.status(201).json(usuario);
}

export async function listarAlunos(_req, res) {
  const alunos = await prisma.aluno.findMany({
    include: { usuario: { select: { id: true, nome: true, email: true, perfil: true } }, plano: true },
    orderBy: { id: 'desc' },
  });
  return res.json(alunos);
}

export async function criarAluno(req, res) {
  const dadosPessoa = pessoa(req, res);
  if (!dadosPessoa) return;
  const planoId = numero(req.body.planoId, 'planoId', res, true);
  if (req.body.planoId !== undefined && planoId === null) return;
  const aluno = await prisma.aluno.create({
    data: { cpf: req.body.cpf ? texto(req.body.cpf, 'cpf', res, false) : undefined, telefone: req.body.telefone ? texto(req.body.telefone, 'telefone', res, false) : undefined, planoId, usuario: { create: { ...dadosPessoa, senha: await bcrypt.hash(dadosPessoa.senha, 10), perfil: 'ALUNO' } } },
    include: { usuario: { select: { id: true, nome: true, email: true, perfil: true } }, plano: true },
  });
  return res.status(201).json(aluno);
}

export async function listarInstrutores(_req, res) {
  const instrutores = await prisma.instrutor.findMany({
    include: { usuario: { select: { id: true, nome: true, email: true, perfil: true } } },
    orderBy: { id: 'desc' },
  });
  return res.json(instrutores);
}

export async function criarInstrutor(req, res) {
  const dadosPessoa = pessoa(req, res);
  if (!dadosPessoa) return;
  const instrutor = await prisma.instrutor.create({
    data: { cref: req.body.cref ? texto(req.body.cref, 'cref', res, false) : undefined, telefone: req.body.telefone ? texto(req.body.telefone, 'telefone', res, false) : undefined, usuario: { create: { ...dadosPessoa, senha: await bcrypt.hash(dadosPessoa.senha, 10), perfil: 'INSTRUTOR' } } },
    include: { usuario: { select: { id: true, nome: true, email: true, perfil: true } } },
  });
  return res.status(201).json(instrutor);
}

export async function listarPlanos(_req, res) {
  return res.json(await prisma.plano.findMany({ orderBy: { id: 'desc' } }));
}

export async function criarPlano(req, res) {
  const nome = texto(req.body.nome, 'nome', res);
  const valor = valorNumerico(req.body.valor, 'valor', res);
  const duracaoMeses = numero(req.body.duracaoMeses, 'duracaoMeses', res);
  if (!nome || valor === null || duracaoMeses === null) return;
  return res.status(201).json(await prisma.plano.create({ data: { nome, descricao: req.body.descricao, valor, duracaoMeses } }));
}

export async function atualizarPlano(req, res) {
  const id = numero(req.params.id, 'id', res);
  if (id === null) return;
  const dados = {};
  if (req.body.nome !== undefined) dados.nome = texto(req.body.nome, 'nome', res);
  if (req.body.descricao !== undefined) dados.descricao = req.body.descricao;
  if (req.body.valor !== undefined) dados.valor = valorNumerico(req.body.valor, 'valor', res);
  if (req.body.duracaoMeses !== undefined) dados.duracaoMeses = numero(req.body.duracaoMeses, 'duracaoMeses', res);
  if (req.body.ativo !== undefined) dados.ativo = req.body.ativo;
  if (Object.values(dados).some((valor) => valor === null)) return;
  return res.json(await prisma.plano.update({ where: { id }, data: dados }));
}

export async function deletarPlano(req, res) {
  const id = numero(req.params.id, 'id', res);
  if (id === null) return;
  await prisma.plano.delete({ where: { id } });
  return res.status(204).send();
}

export async function listarTreinos(req, res) {
  const where = req.usuario.perfil === 'ALUNO' ? { aluno: { usuarioId: req.usuario.id } } : undefined;
  const treinos = await prisma.treino.findMany({ where, include: { aluno: { include: { usuario: { select: { nome: true } } } }, instrutor: { include: { usuario: { select: { nome: true } } } } }, orderBy: { id: 'desc' } });
  return res.json(treinos);
}

export async function criarTreino(req, res) {
  const nome = texto(req.body.nome, 'nome', res);
  const alunoId = numero(req.body.alunoId, 'alunoId', res);
  const instrutorId = numero(req.body.instrutorId, 'instrutorId', res, true);
  if (!nome || alunoId === null || instrutorId === null) return;
  return res.status(201).json(await prisma.treino.create({ data: { nome, descricao: req.body.descricao, alunoId, instrutorId } }));
}

export async function listarFrequencias(_req, res) {
  return res.json(await prisma.frequencia.findMany({ include: { aluno: { include: { usuario: { select: { nome: true } } } } }, orderBy: { horario: 'desc' } }));
}

export async function registrarFrequencia(req, res) {
  const alunoId = numero(req.body.alunoId, 'alunoId', res);
  if (alunoId === null) return;
  if (req.body.presente !== undefined && typeof req.body.presente !== 'boolean') return erro(res, 'presente deve ser booleano.');
  return res.status(201).json(await prisma.frequencia.create({ data: { alunoId, presente: req.body.presente ?? true } }));
}

export async function listarPagamentos(_req, res) {
  return res.json(await prisma.pagamento.findMany({ include: { aluno: { include: { usuario: { select: { nome: true } } } }, plano: true }, orderBy: { vencimento: 'desc' } }));
}

export async function criarPagamento(req, res) {
  const alunoId = numero(req.body.alunoId, 'alunoId', res);
  const planoId = numero(req.body.planoId, 'planoId', res, true);
  const valor = valorNumerico(req.body.valor, 'valor', res);
  const vencimento = new Date(req.body.vencimento);
  const status = req.body.status || 'PENDENTE';
  if (alunoId === null || planoId === null || valor === null || Number.isNaN(vencimento.getTime())) return erro(res, 'Dados de pagamento inválidos.');
  if (!['PENDENTE', 'PAGO', 'ATRASADO'].includes(status)) return erro(res, 'Status de pagamento inválido.');
  return res.status(201).json(await prisma.pagamento.create({ data: { alunoId, planoId, valor, vencimento, status } }));
}

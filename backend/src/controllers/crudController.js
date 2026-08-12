import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

export async function listarUsuarios(req, res) {
  const usuarios = await prisma.usuario.findMany({ select: { id: true, nome: true, email: true, perfil: true, createdAt: true } });
  res.json(usuarios);
}

export async function criarUsuario(req, res) {
  const { nome, email, senha, perfil = 'ALUNO' } = req.body;
  if (!nome || !email || !senha) return res.status(400).json({ erro: 'nome, email e senha são obrigatórios.' });
  const usuario = await prisma.usuario.create({ data: { nome, email, senha: await bcrypt.hash(senha, 10), perfil } });
  res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil });
}

export async function listarAlunos(req, res) {
  const alunos = await prisma.aluno.findMany({ include: { usuario: { select: { id: true, nome: true, email: true } }, plano: true } });
  res.json(alunos);
}

export async function criarAluno(req, res) {
  const { nome, email, senha, cpf, telefone, planoId } = req.body;
  const senhaHash = await bcrypt.hash(senha || '123456', 10);
  const aluno = await prisma.aluno.create({ data: { cpf, telefone, planoId: planoId ? Number(planoId) : undefined, usuario: { create: { nome, email, senha: senhaHash, perfil: 'ALUNO' } } }, include: { usuario: true, plano: true } });
  res.status(201).json(aluno);
}

export async function listarInstrutores(req, res) {
  const itens = await prisma.instrutor.findMany({ include: { usuario: { select: { id: true, nome: true, email: true } } } });
  res.json(itens);
}

export async function criarInstrutor(req, res) {
  const { nome, email, senha, cref, telefone } = req.body;
  const senhaHash = await bcrypt.hash(senha || '123456', 10);
  const item = await prisma.instrutor.create({ data: { cref, telefone, usuario: { create: { nome, email, senha: senhaHash, perfil: 'INSTRUTOR' } } }, include: { usuario: true } });
  res.status(201).json(item);
}

export async function listarPlanos(req, res) { res.json(await prisma.plano.findMany({ orderBy: { id: 'desc' } })); }
export async function criarPlano(req, res) {
  const { nome, descricao, valor, duracaoMeses } = req.body;
  const item = await prisma.plano.create({ data: { nome, descricao, valor: Number(valor), duracaoMeses: Number(duracaoMeses) } });
  res.status(201).json(item);
}
export async function atualizarPlano(req, res) { const item = await prisma.plano.update({ where: { id: Number(req.params.id) }, data: req.body }); res.json(item); }
export async function deletarPlano(req, res) { await prisma.plano.delete({ where: { id: Number(req.params.id) } }); res.status(204).send(); }

export async function listarTreinos(req, res) { res.json(await prisma.treino.findMany({ include: { aluno: { include: { usuario: { select: { nome: true } } } }, instrutor: { include: { usuario: { select: { nome: true } } } } }, orderBy: { id: 'desc' } })); }
export async function criarTreino(req, res) { const { nome, descricao, alunoId, instrutorId } = req.body; const item = await prisma.treino.create({ data: { nome, descricao, alunoId: Number(alunoId), instrutorId: instrutorId ? Number(instrutorId) : undefined } }); res.status(201).json(item); }

export async function listarFrequencias(req, res) { res.json(await prisma.frequencia.findMany({ include: { aluno: { include: { usuario: { select: { nome: true } } } } }, orderBy: { horario: 'desc' } })); }
export async function registrarFrequencia(req, res) { const item = await prisma.frequencia.create({ data: { alunoId: Number(req.body.alunoId), presente: req.body.presente !== false } }); res.status(201).json(item); }

export async function listarPagamentos(req, res) { res.json(await prisma.pagamento.findMany({ include: { aluno: { include: { usuario: { select: { nome: true } } } }, plano: true }, orderBy: { vencimento: 'desc' } })); }
export async function criarPagamento(req, res) { const { alunoId, planoId, valor, vencimento, status } = req.body; const item = await prisma.pagamento.create({ data: { alunoId: Number(alunoId), planoId: planoId ? Number(planoId) : undefined, valor: Number(valor), vencimento: new Date(vencimento), status } }); res.status(201).json(item); }

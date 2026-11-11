import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

const perfis = ['ADMIN', 'INSTRUTOR', 'ALUNO'];
const statusAluno = ['ATIVO', 'INATIVO'];
const statusPagamento = ['PENDENTE', 'PAGO', 'ATRASADO'];
const numero = (v) => Number(v);
const idValido = (v) => Number.isInteger(numero(v)) && numero(v) > 0;
const erro = (res, status, mensagem) => res.status(status).json({ erro: mensagem });
const dadosUsuario = { id: true, nome: true, email: true, perfil: true, createdAt: true };

async function alunoDoUsuario(usuarioId) {
  return prisma.aluno.findUnique({ where: { usuarioId }, select: { id: true } });
}
async function instrutorDoUsuario(usuarioId) {
  return prisma.instrutor.findUnique({ where: { usuarioId }, select: { id: true } });
}

// Usuários
export async function listarUsuarios(_req, res) {
  res.json(await prisma.usuario.findMany({ select: dadosUsuario, orderBy: { id: 'desc' } }));
}
export async function criarUsuario(req, res) {
  const { nome, email, senha, perfil = 'ALUNO' } = req.body;
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6 || !perfis.includes(perfil))
    return erro(res, 400, 'Informe nome, e-mail válido, senha com ao menos 6 caracteres e perfil válido.');
  const usuario = await prisma.usuario.create({ data: { nome: nome.trim(), email: email.trim().toLowerCase(), senha: await bcrypt.hash(senha, 10), perfil }, select: dadosUsuario });
  res.status(201).json(usuario);
}
export async function atualizarUsuario(req, res) {
  const id = numero(req.params.id);
  const { nome, email, senha, perfil } = req.body;
  if (!idValido(id)) return erro(res, 400, 'ID inválido.');
  if (perfil && !perfis.includes(perfil)) return erro(res, 400, 'Perfil inválido.');
  const data = {};
  if (nome !== undefined) data.nome = String(nome).trim();
  if (email !== undefined) data.email = String(email).trim().toLowerCase();
  if (perfil !== undefined) data.perfil = perfil;
  if (senha) {
    if (senha.length < 6) return erro(res, 400, 'A senha deve ter ao menos 6 caracteres.');
    data.senha = await bcrypt.hash(senha, 10);
  }
  const usuario = await prisma.usuario.update({ where: { id }, data, select: dadosUsuario });
  res.json(usuario);
}
export async function deletarUsuario(req, res) {
  const id = numero(req.params.id);
  if (id === req.usuario.id) return erro(res, 400, 'Não é permitido excluir o usuário conectado.');
  await prisma.usuario.delete({ where: { id } });
  res.status(204).send();
}

// Alunos
const includeAluno = { usuario: { select: dadosUsuario }, plano: true };
export async function listarAlunos(req, res) {
  if (req.usuario.perfil === 'ALUNO') {
    const aluno = await prisma.aluno.findUnique({ where: { usuarioId: req.usuario.id }, include: includeAluno });
    return res.json(aluno ? [aluno] : []);
  }
  res.json(await prisma.aluno.findMany({ include: includeAluno, orderBy: { id: 'desc' } }));
}
export async function criarAluno(req, res) {
  const { nome, email, senha, cpf, telefone, planoId, status = 'ATIVO' } = req.body;
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6) return erro(res, 400, 'Nome, e-mail e senha (mínimo 6 caracteres) são obrigatórios.');
  if (!statusAluno.includes(status)) return erro(res, 400, 'Status do aluno inválido.');
  const possuiPlano = planoId !== undefined && planoId !== null && planoId !== '';
  if (possuiPlano && !idValido(planoId)) return erro(res, 400, 'Plano inválido.');
  const senhaHash = await bcrypt.hash(senha, 10);
  const dadosAluno = {
    cpf: cpf || null,
    telefone: telefone || null,
    status,
    ...(possuiPlano ? { plano: { connect: { id: numero(planoId) } } } : {}),
    usuario: {
      create: {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senhaHash,
        perfil: 'ALUNO'
      }
    }
  };
  const aluno = await prisma.aluno.create({
    data: dadosAluno,
    include: includeAluno
  });
  res.status(201).json(aluno);
}
export async function atualizarAluno(req, res) {
  const id = numero(req.params.id);
  const { nome, email, cpf, telefone, planoId, status } = req.body;
  if (!idValido(id)) return erro(res, 400, 'ID inválido.');
  if (status && !statusAluno.includes(status)) return erro(res, 400, 'Status do aluno inválido.');
  const possuiPlano = planoId !== undefined && planoId !== null && planoId !== '';
  if (possuiPlano && !idValido(planoId)) return erro(res, 400, 'Plano inválido.');
  const atual = await prisma.aluno.findUniqueOrThrow({ where: { id }, select: { usuarioId: true } });
  const aluno = await prisma.aluno.update({ where: { id }, data: {
    ...(cpf !== undefined ? { cpf: cpf || null } : {}),
    ...(telefone !== undefined ? { telefone: telefone || null } : {}),
    ...(status ? { status } : {}),
    ...(planoId !== undefined ? { plano: possuiPlano ? { connect: { id: numero(planoId) } } : { disconnect: true } } : {}),
    usuario: { update: { ...(nome !== undefined ? { nome: String(nome).trim() } : {}), ...(email !== undefined ? { email: String(email).trim().toLowerCase() } : {}) } }
  }, include: includeAluno });
  res.json(aluno);
}
export async function deletarAluno(req, res) {
  await prisma.aluno.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}

// Instrutores
const includeInstrutor = { usuario: { select: dadosUsuario } };
export async function listarInstrutores(_req, res) {
  res.json(await prisma.instrutor.findMany({ include: includeInstrutor, orderBy: { id: 'desc' } }));
}
export async function criarInstrutor(req, res) {
  const { nome, email, senha, cref, telefone } = req.body;
  if (!nome?.trim() || !email?.trim() || !senha || senha.length < 6) return erro(res, 400, 'Nome, e-mail e senha (mínimo 6 caracteres) são obrigatórios.');
  const item = await prisma.instrutor.create({ data: { cref: cref || null, telefone: telefone || null,
    usuario: { create: { nome: nome.trim(), email: email.trim().toLowerCase(), senha: await bcrypt.hash(senha, 10), perfil: 'INSTRUTOR' } } }, include: includeInstrutor });
  res.status(201).json(item);
}
export async function atualizarInstrutor(req, res) {
  const id = numero(req.params.id);
  const { nome, email, cref, telefone } = req.body;
  const item = await prisma.instrutor.update({ where: { id }, data: {
    ...(cref !== undefined ? { cref: cref || null } : {}), ...(telefone !== undefined ? { telefone: telefone || null } : {}),
    usuario: { update: { ...(nome !== undefined ? { nome: String(nome).trim() } : {}), ...(email !== undefined ? { email: String(email).trim().toLowerCase() } : {}) } }
  }, include: includeInstrutor });
  res.json(item);
}
export async function deletarInstrutor(req, res) {
  await prisma.instrutor.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}

// Planos
export async function listarPlanos(_req, res) {
  res.json(await prisma.plano.findMany({ orderBy: { id: 'desc' } }));
}
export async function criarPlano(req, res) {
  const { nome, descricao, valor, duracaoMeses, ativo = true } = req.body;
  if (!nome?.trim() || !Number.isFinite(Number(valor)) || Number(valor) < 0 || !Number.isInteger(Number(duracaoMeses)) || Number(duracaoMeses) < 1)
    return erro(res, 400, 'Informe nome, valor não negativo e duração em meses maior que zero.');
  const item = await prisma.plano.create({ data: { nome: nome.trim(), descricao: descricao || null, valor: Number(valor), duracaoMeses: Number(duracaoMeses), ativo: Boolean(ativo) } });
  res.status(201).json(item);
}
export async function atualizarPlano(req, res) {
  const { nome, descricao, valor, duracaoMeses, ativo } = req.body;
  const data = { ...(nome !== undefined ? { nome: String(nome).trim() } : {}), ...(descricao !== undefined ? { descricao: descricao || null } : {}),
    ...(valor !== undefined ? { valor: Number(valor) } : {}), ...(duracaoMeses !== undefined ? { duracaoMeses: Number(duracaoMeses) } : {}),
    ...(ativo !== undefined ? { ativo: Boolean(ativo) } : {}) };
  if (data.valor !== undefined && (!Number.isFinite(data.valor) || data.valor < 0)) return erro(res, 400, 'Valor inválido.');
  if (data.duracaoMeses !== undefined && (!Number.isInteger(data.duracaoMeses) || data.duracaoMeses < 1)) return erro(res, 400, 'Duração inválida.');
  res.json(await prisma.plano.update({ where: { id: numero(req.params.id) }, data }));
}
export async function deletarPlano(req, res) {
  await prisma.plano.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}

// Treinos: alunos só recebem os próprios; instrutores veem os que acompanham.
export async function listarTreinos(req, res) {
  const where = req.usuario.perfil === 'ALUNO'
    ? { aluno: { usuarioId: req.usuario.id } }
    : req.usuario.perfil === 'INSTRUTOR'
      ? { instrutor: { usuarioId: req.usuario.id } }
      : {};
  res.json(await prisma.treino.findMany({ where, include: { aluno: { include: { usuario: { select: { id: true, nome: true } } } }, instrutor: { include: { usuario: { select: { id: true, nome: true } } } } }, orderBy: { id: 'desc' } }));
}
export async function criarTreino(req, res) {
  const { nome, descricao, alunoId, instrutorId } = req.body;
  if (!nome?.trim() || !idValido(alunoId)) return erro(res, 400, 'Nome e aluno válido são obrigatórios.');
  let instrutor = instrutorId ? numero(instrutorId) : null;
  if (req.usuario.perfil === 'INSTRUTOR') {
    const proprio = await instrutorDoUsuario(req.usuario.id);
    if (!proprio) return erro(res, 403, 'Instrutor não encontrado.');
    instrutor = proprio.id;
  }
  const item = await prisma.treino.create({ data: { nome: nome.trim(), descricao: descricao || null, alunoId: numero(alunoId), instrutorId: instrutor }, include: { aluno: { include: { usuario: true } }, instrutor: { include: { usuario: true } } } });
  res.status(201).json(item);
}
export async function atualizarTreino(req, res) {
  const id = numero(req.params.id);
  const treino = await prisma.treino.findUniqueOrThrow({ where: { id }, select: { instrutor: { select: { usuarioId: true } } } });
  if (req.usuario.perfil === 'INSTRUTOR' && treino.instrutor?.usuarioId !== req.usuario.id) return erro(res, 403, 'Você só pode alterar treinos atribuídos a você.');
  const { nome, descricao, alunoId, instrutorId } = req.body;
  res.json(await prisma.treino.update({ where: { id }, data: { ...(nome !== undefined ? { nome: String(nome).trim() } : {}),
    ...(descricao !== undefined ? { descricao: descricao || null } : {}), ...(alunoId !== undefined ? { alunoId: numero(alunoId) } : {}),
    ...(req.usuario.perfil === 'ADMIN' && instrutorId !== undefined ? { instrutorId: instrutorId ? numero(instrutorId) : null } : {}) },
    include: { aluno: { include: { usuario: true } }, instrutor: { include: { usuario: true } } } }));
}
export async function deletarTreino(req, res) {
  const id = numero(req.params.id);
  const treino = await prisma.treino.findUniqueOrThrow({ where: { id }, select: { instrutor: { select: { usuarioId: true } } } });
  if (req.usuario.perfil === 'INSTRUTOR' && treino.instrutor?.usuarioId !== req.usuario.id) return erro(res, 403, 'Você só pode excluir treinos atribuídos a você.');
  await prisma.treino.delete({ where: { id } });
  res.status(204).send();
}

// Frequências
export async function listarFrequencias(req, res) {
  const where = req.usuario.perfil === 'ALUNO' ? { aluno: { usuarioId: req.usuario.id } } : {};
  res.json(await prisma.frequencia.findMany({ where, include: { aluno: { include: { usuario: { select: { id: true, nome: true } } } } }, orderBy: { horario: 'desc' } }));
}
export async function registrarFrequencia(req, res) {
  let alunoId = req.body.alunoId ? numero(req.body.alunoId) : null;
  if (req.usuario.perfil === 'ALUNO') {
    const aluno = await alunoDoUsuario(req.usuario.id);
    if (!aluno) return erro(res, 404, 'Cadastro de aluno não encontrado.');
    alunoId = aluno.id;
  }
  if (!idValido(alunoId)) return erro(res, 400, 'Aluno inválido.');
  const item = await prisma.frequencia.create({ data: { alunoId, presente: req.body.presente !== false }, include: { aluno: { include: { usuario: { select: { nome: true } } } } } });
  res.status(201).json(item);
}
export async function deletarFrequencia(req, res) {
  await prisma.frequencia.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}

// Pagamentos
export async function listarPagamentos(req, res) {
  const where = req.usuario.perfil === 'ALUNO' ? { aluno: { usuarioId: req.usuario.id } } : {};
  res.json(await prisma.pagamento.findMany({ where, include: { aluno: { include: { usuario: { select: { nome: true } } } }, plano: true }, orderBy: { vencimento: 'desc' } }));
}
export async function criarPagamento(req, res) {
  const { alunoId, planoId, valor, vencimento, status = 'PENDENTE' } = req.body;
  if (!idValido(alunoId) || !Number.isFinite(Number(valor)) || Number(valor) < 0 || !vencimento || Number.isNaN(Date.parse(vencimento)) || !statusPagamento.includes(status))
    return erro(res, 400, 'Informe aluno, valor, vencimento e status válidos.');
  const item = await prisma.pagamento.create({ data: { alunoId: numero(alunoId), planoId: planoId ? numero(planoId) : null, valor: Number(valor), vencimento: new Date(vencimento), status } });
  res.status(201).json(item);
}
export async function atualizarPagamento(req, res) {
  const { valor, vencimento, status, planoId } = req.body;
  if (status && !statusPagamento.includes(status)) return erro(res, 400, 'Status de pagamento inválido.');
  const data = { ...(valor !== undefined ? { valor: Number(valor) } : {}), ...(vencimento ? { vencimento: new Date(vencimento) } : {}),
    ...(status ? { status, pagoEm: status === 'PAGO' ? new Date() : null } : {}),
    ...(planoId !== undefined ? { planoId: planoId ? numero(planoId) : null } : {}) };
  res.json(await prisma.pagamento.update({ where: { id: numero(req.params.id) }, data }));
}
export async function deletarPagamento(req, res) {
  await prisma.pagamento.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}


/* Relatórios e despesas */
export async function obterRelatorioGeral(_req, res) {
  const [alunosAtivos, alunosInativos, totalTreinos, totalFrequencias, receitas, despesas, pendentes, atrasados, ultimasFrequencias] = await Promise.all([
    prisma.aluno.count({ where: { status: 'ATIVO' } }),
    prisma.aluno.count({ where: { status: 'INATIVO' } }),
    prisma.treino.count(),
    prisma.frequencia.count(),
    prisma.pagamento.aggregate({ where: { status: 'PAGO' }, _sum: { valor: true } }),
    prisma.despesa.aggregate({ _sum: { valor: true } }),
    prisma.pagamento.aggregate({ where: { status: 'PENDENTE' }, _sum: { valor: true }, _count: true }),
    prisma.pagamento.aggregate({ where: { status: 'ATRASADO' }, _sum: { valor: true }, _count: true }),
    prisma.frequencia.findMany({ take: 8, orderBy: { horario: 'desc' }, include: { aluno: { include: { usuario: { select: { nome: true } } } } } })
  ]);
  const totalReceitas = Number(receitas._sum.valor || 0);
  const totalDespesas = Number(despesas._sum.valor || 0);
  res.json({
    alunos: { ativos: alunosAtivos, inativos: alunosInativos },
    totalTreinos,
    totalFrequencias,
    financeiro: {
      receitasPagas: totalReceitas,
      despesas: totalDespesas,
      saldo: totalReceitas - totalDespesas,
      pagamentosPendentes: { quantidade: pendentes._count, valor: Number(pendentes._sum.valor || 0) },
      pagamentosAtrasados: { quantidade: atrasados._count, valor: Number(atrasados._sum.valor || 0) }
    },
    ultimasFrequencias
  });
}

export async function listarDespesas(_req, res) {
  res.json(await prisma.despesa.findMany({ include: { usuario: { select: { nome: true } } }, orderBy: { data: 'desc' } }));
}
export async function criarDespesa(req, res) {
  const { descricao, categoria, valor, data } = req.body;
  if (!descricao?.trim() || !categoria?.trim() || !Number.isFinite(Number(valor)) || Number(valor) < 0 || (data && Number.isNaN(Date.parse(data)))) {
    return erro(res, 400, 'Informe descrição, categoria, valor não negativo e uma data válida.');
  }
  const item = await prisma.despesa.create({ data: {
    descricao: descricao.trim(), categoria: categoria.trim(), valor: Number(valor),
    ...(data ? { data: new Date(data) } : {}), usuarioId: req.usuario.id
  }, include: { usuario: { select: { nome: true } } } });
  res.status(201).json(item);
}
export async function atualizarDespesa(req, res) {
  const { descricao, categoria, valor, data } = req.body;
  const dataUpdate = {
    ...(descricao !== undefined ? { descricao: String(descricao).trim() } : {}),
    ...(categoria !== undefined ? { categoria: String(categoria).trim() } : {}),
    ...(valor !== undefined ? { valor: Number(valor) } : {}),
    ...(data !== undefined ? { data: new Date(data) } : {})
  };
  if (dataUpdate.valor !== undefined && (!Number.isFinite(dataUpdate.valor) || dataUpdate.valor < 0)) return erro(res, 400, 'Valor inválido.');
  res.json(await prisma.despesa.update({ where: { id: numero(req.params.id) }, data: dataUpdate, include: { usuario: { select: { nome: true } } } }));
}
export async function deletarDespesa(req, res) {
  await prisma.despesa.delete({ where: { id: numero(req.params.id) } });
  res.status(204).send();
}

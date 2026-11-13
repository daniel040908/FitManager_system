import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL não encontrada. Crie backend/.env a partir de backend/.env.example e configure a senha do MySQL.');
  process.exit(1);
}

const prisma = new PrismaClient();
const senhaInicial = 'FitManager#2026';

async function main() {
  const senha = await bcrypt.hash(senhaInicial, 10);

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@fitmanager.com' },
    update: { senha, nome: 'Administrador', perfil: 'ADMIN' },
    create: { nome: 'Administrador', email: 'admin@fitmanager.com', senha, perfil: 'ADMIN' }
  });

  const instrutorUsuario = await prisma.usuario.upsert({
    where: { email: 'instrutor@fitmanager.com' },
    update: { senha, nome: 'Carlos Instrutor', perfil: 'INSTRUTOR' },
    create: { nome: 'Carlos Instrutor', email: 'instrutor@fitmanager.com', senha, perfil: 'INSTRUTOR' }
  });
  const instrutor = await prisma.instrutor.upsert({
    where: { usuarioId: instrutorUsuario.id },
    update: {},
    create: { usuarioId: instrutorUsuario.id, cref: 'CREF-0001' }
  });

  const planoExistente = await prisma.plano.findFirst({ where: { nome: 'Plano Mensal' } });
  const plano = planoExistente || await prisma.plano.create({
    data: { nome: 'Plano Mensal', descricao: 'Acesso completo à academia', valor: 99.90, duracaoMeses: 1 }
  });

  const alunoUsuario = await prisma.usuario.upsert({
    where: { email: 'aluno@fitmanager.com' },
    update: { senha, nome: 'João Aluno', perfil: 'ALUNO' },
    create: { nome: 'João Aluno', email: 'aluno@fitmanager.com', senha, perfil: 'ALUNO' }
  });
  const aluno = await prisma.aluno.upsert({
    where: { usuarioId: alunoUsuario.id },
    update: { planoId: plano.id },
    create: { usuarioId: alunoUsuario.id, planoId: plano.id, telefone: '(00) 00000-0000' }
  });

  const treinoExistente = await prisma.treino.findFirst({
    where: { nome: 'Treino A - Adaptação', alunoId: aluno.id, instrutorId: instrutor.id }
  });
  if (!treinoExistente) {
    await prisma.treino.create({
      data: { nome: 'Treino A - Adaptação', descricao: 'Treino inicial personalizado', alunoId: aluno.id, instrutorId: instrutor.id }
    });
  }

  console.log(`Seed concluído. Administrador: ${admin.email}`);
  console.log(`Senha inicial dos usuários de demonstração: ${senhaInicial}`);
}

main()
  .catch((error) => { console.error(error); process.exitCode = 1; })
  .finally(async () => { await prisma.$disconnect(); });

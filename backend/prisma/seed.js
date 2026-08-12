import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const senha = await bcrypt.hash('123456', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@fitmanager.com' },
    update: {},
    create: { nome: 'Administrador', email: 'admin@fitmanager.com', senha, perfil: 'ADMIN' }
  });

  const instrutorUsuario = await prisma.usuario.upsert({
    where: { email: 'instrutor@fitmanager.com' },
    update: {},
    create: { nome: 'Carlos Instrutor', email: 'instrutor@fitmanager.com', senha, perfil: 'INSTRUTOR' }
  });
  const instrutor = await prisma.instrutor.upsert({ where: { usuarioId: instrutorUsuario.id }, update: {}, create: { usuarioId: instrutorUsuario.id, cref: 'CREF-0001' } });

  const plano = await prisma.plano.create({ data: { nome: 'Plano Mensal', descricao: 'Acesso completo à academia', valor: 99.90, duracaoMeses: 1 } });
  const alunoUsuario = await prisma.usuario.upsert({
    where: { email: 'aluno@fitmanager.com' },
    update: {},
    create: { nome: 'João Aluno', email: 'aluno@fitmanager.com', senha, perfil: 'ALUNO' }
  });
  const aluno = await prisma.aluno.upsert({ where: { usuarioId: alunoUsuario.id }, update: { planoId: plano.id }, create: { usuarioId: alunoUsuario.id, planoId: plano.id, telefone: '(00) 00000-0000' } });
  await prisma.treino.create({ data: { nome: 'Treino A - Adaptação', descricao: 'Treino inicial personalizado', alunoId: aluno.id, instrutorId: instrutor.id } });

  console.log(`Seed concluído. Admin: ${admin.email}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { jwtConfig } from '../config/jwt.js';

const senhaSchema = z
  .string()
  .min(12, 'A senha deve ter no mínimo 12 caracteres.')
  .regex(/[A-Z]/, 'A senha deve conter no mínimo uma letra maiúscula.')
  .regex(/[a-z]/, 'A senha deve conter no mínimo uma letra minúscula.')
  .refine(
    (val) => (val.match(/[^A-Za-z0-9]/g) || []).length <= 1,
    'A senha pode conter no máximo um caractere especial.'
  );

const loginSchema = z.object({
  nome: z.string().trim().min(2, 'Informe o seu nome.'),
  email: z.string().trim().email('E-mail inválido.').transform((value) => value.toLowerCase()),
  senha: senhaSchema,
  perfil: z.enum(['ADMIN', 'INSTRUTOR']).default('ADMIN'),
});

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      erro: parsed.error.errors[0]?.message || 'Preencha todos os campos corretamente.',
    });
  }

  const { nome, email, senha, perfil } = parsed.data;

  try {
    let usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      // Cria o usuário dinamicamente com o nome e perfil escolhidos no login
      const senhaHash = await bcrypt.hash(senha, 10);
      usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          perfil,
        },
      });
    } else {
      // Valida a senha (suporta hash bcrypt ou texto puro)
      const isHashBcrypt = usuario.senha.startsWith('$2a$') || usuario.senha.startsWith('$2b$');
      const senhaValida = isHashBcrypt
        ? await bcrypt.compare(senha, usuario.senha)
        : senha === usuario.senha;

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Senha inválida para este e-mail.' });
      }

      // Atualiza o nome e o perfil conforme escolhido na área de login
      usuario = await prisma.usuario.update({
        where: { id: usuario.id },
        data: { nome, perfil },
      });
    }

    // Se escolheu entrar como INSTRUTOR, garante o registro na tabela instrutores
    if (perfil === 'INSTRUTOR') {
      await prisma.instrutor.upsert({
        where: { usuarioId: usuario.id },
        update: {},
        create: { usuarioId: usuario.id },
      });
    }

    const token = jwt.sign(
      { id: usuario.id, perfil: usuario.perfil, nome: usuario.nome },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
      },
    });
  } catch (error) {
    console.error('[AUTH] Falha ao realizar login:', error);
    return res.status(500).json({
      erro: 'Não foi possível consultar o banco de dados. Verifique a conexão MySQL.',
    });
  }
}

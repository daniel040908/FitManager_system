import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { jwtConfig } from '../config/jwt.js';

const loginSchema = z.object({
  email: z.string().trim().email().transform((value) => value.toLowerCase()),
  senha: z.string().min(6)
});

export async function login(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ erro: 'Informe um e-mail válido e uma senha com ao menos 6 caracteres.' });
  }

  try {
    const usuario = await prisma.usuario.findUnique({
      where: { email: parsed.data.email }
    });

    if (!usuario) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    }

    const senhaValida = await bcrypt.compare(parsed.data.senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
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
        perfil: usuario.perfil
      }
    });
  } catch (error) {
    // Detalhes ficam somente no terminal do backend; nunca exponha credenciais ao navegador.
    console.error('[AUTH] Falha ao realizar login:', error);
    return res.status(500).json({
      erro: 'Não foi possível consultar o banco de dados. Verifique a conexão MySQL e execute npx prisma generate.'
    });
  }
}

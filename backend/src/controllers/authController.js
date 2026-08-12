import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { jwtConfig } from '../config/jwt.js';

const loginSchema = z.object({ email: z.string().email(), senha: z.string().min(6) });

export async function login(req, res) {
  try {
    const dados = loginSchema.parse(req.body);
    const usuario = await prisma.usuario.findUnique({ where: { email: dados.email } });
    if (!usuario || !(await bcrypt.compare(dados.senha, usuario.senha))) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });
    const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
    return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } });
  } catch (error) {
    return res.status(400).json({ erro: error?.issues?.[0]?.message || 'Dados inválidos.' });
  }
}

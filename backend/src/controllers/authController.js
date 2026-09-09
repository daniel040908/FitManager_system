import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { jwtConfig } from '../config/jwt.js';

export async function login(req, res) {
  try {
    const { email, senha } = req.body;
    
    const usuario = await prisma.usuario.findUnique({ where: { email } });

    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) return res.status(401).json({ erro: 'E-mail ou senha inválidos.' });

    const token = jwt.sign({ id: usuario.id, perfil: usuario.perfil, nome: usuario.nome }, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });

    return res.json({ token, usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, perfil: usuario.perfil } });
  } catch (error) {
    return res.status(400).json({ erro: error?.message || 'Dados inválidos.' });
  }
}

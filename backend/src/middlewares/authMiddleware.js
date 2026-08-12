import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt.js';

export function autenticar(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ erro: 'Token não informado.' });
  try {
    req.usuario = jwt.verify(header.substring(7), jwtConfig.secret);
    next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado.' });
  }
}

export function permitir(...perfis) {
  return (req, res, next) => {
    if (!req.usuario || !perfis.includes(req.usuario.perfil)) return res.status(403).json({ erro: 'Acesso negado.' });
    next();
  };
}

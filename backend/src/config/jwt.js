import 'dotenv/config';

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET deve estar configurado em produção.');
}

export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'fitmanager-dev-secret-change-me',
  expiresIn: process.env.JWT_EXPIRES_IN || '8h'
};

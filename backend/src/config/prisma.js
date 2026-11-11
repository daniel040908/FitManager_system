import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL não encontrada. Crie o arquivo backend/.env a partir do backend/.env.example.');
}

export const prisma = new PrismaClient();

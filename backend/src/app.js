import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';
import { prisma } from './config/prisma.js';

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((origin) => origin.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origem não permitida pelo CORS.'));
  }
}));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'FitManager' }));
app.get('/health/db', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('[HEALTH] Falha na conexão com MySQL:', error);
    return res.status(503).json({ status: 'error', database: 'unavailable', message: 'Confira DATABASE_URL, MySQL e se o banco academia_db existe.' });
  }
});
app.get('/docs.json', (_req, res) => res.json(swaggerSpec));
app.use('/auth', authRoutes);
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use((err, _req, res, _next) => {
  if (err?.code === 'P2002') return res.status(409).json({ erro: 'Já existe um registro com esses dados.' });
  if (err?.code === 'P2003') return res.status(400).json({ erro: 'Não foi possível concluir: existem relações inválidas.' });
  if (err?.code === 'P2025') return res.status(404).json({ erro: 'Registro não encontrado.' });
  if (err?.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido.' });
  console.error('[API] Erro não tratado:', err);
  return res.status(500).json({ erro: 'Erro interno do servidor. Consulte o terminal do backend para ver a causa.' });
});
export default app;

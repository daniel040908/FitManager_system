import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'FitManager' }));
app.use('/auth', authRoutes);
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((_req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  if (err?.code === 'P2002') return res.status(409).json({ erro: 'Já existe um registro com esse valor único.' });
  if (err?.code === 'P2025') return res.status(404).json({ erro: 'Registro não encontrado.' });
  if (err?.name === 'ZodError') return res.status(400).json({ erro: err.issues?.[0]?.message || 'Dados inválidos.' });
  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

export default app;

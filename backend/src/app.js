import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes.js';
import routes from './routes/index.js';
import { swaggerSpec } from './config/swagger.js';

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok', app: 'FitManager' }));
app.use('/auth', authRoutes);
app.use('/api', routes);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ erro: 'Erro interno do servidor.' }); });
export default app;

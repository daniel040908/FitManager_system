import { Router } from 'express';
import { login } from '../controllers/authController.js';

const router = Router();

// Rota pública para autenticação
router.post('/login', login);

export default router;

import { Router } from 'express';
import { autenticar, permitir } from '../middlewares/authMiddleware.js';
import * as c from '../controllers/crudController.js';

const router = Router();

// Aplica autenticação global para todas as rotas abaixo
router.use(autenticar);

// --- USUÁRIOS ---
router.get('/usuarios', permitir('ADMIN'), c.listarUsuarios);
router.post('/usuarios', permitir('ADMIN'), c.criarUsuario);
router.put('/usuarios/:id', permitir('ADMIN'), c.atualizarUsuario);
router.delete('/usuarios/:id', permitir('ADMIN'), c.deletarUsuario);

// --- ALUNOS ---
router.get('/alunos', permitir('ADMIN', 'INSTRUTOR'), c.listarAlunos);
router.post('/alunos', permitir('ADMIN'), c.criarAluno);
router.put('/alunos/:id', permitir('ADMIN'), c.atualizarAluno);
router.delete('/alunos/:id', permitir('ADMIN'), c.deletarAluno);

// --- INSTRUTORES ---
router.get('/instrutores', permitir('ADMIN'), c.listarInstrutores);
router.post('/instrutores', permitir('ADMIN'), c.criarInstrutor);
router.put('/instrutores/:id', permitir('ADMIN'), c.atualizarInstrutor);
router.delete('/instrutores/:id', permitir('ADMIN'), c.deletarInstrutor);

// --- PLANOS ---
router.get('/planos', permitir('ADMIN', 'INSTRUTOR'), c.listarPlanos);
router.post('/planos', permitir('ADMIN'), c.criarPlano);
router.put('/planos/:id', permitir('ADMIN'), c.atualizarPlano);
router.delete('/planos/:id', permitir('ADMIN'), c.deletarPlano);

// --- TREINOS ---
router.get('/treinos', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.listarTreinos);
router.post('/treinos', permitir('ADMIN', 'INSTRUTOR'), c.criarTreino);
router.put('/treinos/:id', permitir('ADMIN', 'INSTRUTOR'), c.atualizarTreino);
router.delete('/treinos/:id', permitir('ADMIN', 'INSTRUTOR'), c.deletarTreino);

// --- FREQUÊNCIAS ---
router.get('/frequencias', permitir('ADMIN', 'INSTRUTOR'), c.listarFrequencias);
router.post('/frequencias', permitir('ADMIN', 'INSTRUTOR'), c.registrarFrequencia);
router.delete('/frequencias/:id', permitir('ADMIN', 'INSTRUTOR'), c.deletarFrequencia);

// --- PAGAMENTOS ---
router.get('/pagamentos', permitir('ADMIN'), c.listarPagamentos);
router.post('/pagamentos', permitir('ADMIN'), c.criarPagamento);
router.put('/pagamentos/:id', permitir('ADMIN'), c.atualizarPagamento);
router.delete('/pagamentos/:id', permitir('ADMIN'), c.deletarPagamento);

export default router;

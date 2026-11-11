import { Router } from 'express';
import { autenticar, permitir } from '../middlewares/authMiddleware.js';
import * as c from '../controllers/crudController.js';

const router = Router();
router.use(autenticar);

router.get('/usuarios', permitir('ADMIN'), c.listarUsuarios);
router.post('/usuarios', permitir('ADMIN'), c.criarUsuario);
router.put('/usuarios/:id', permitir('ADMIN'), c.atualizarUsuario);
router.delete('/usuarios/:id', permitir('ADMIN'), c.deletarUsuario);

router.get('/alunos', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.listarAlunos);
router.post('/alunos', permitir('ADMIN'), c.criarAluno);
router.put('/alunos/:id', permitir('ADMIN'), c.atualizarAluno);
router.delete('/alunos/:id', permitir('ADMIN'), c.deletarAluno);

router.get('/instrutores', permitir('ADMIN', 'INSTRUTOR'), c.listarInstrutores);
router.post('/instrutores', permitir('ADMIN'), c.criarInstrutor);
router.put('/instrutores/:id', permitir('ADMIN'), c.atualizarInstrutor);
router.delete('/instrutores/:id', permitir('ADMIN'), c.deletarInstrutor);

router.get('/planos', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.listarPlanos);
router.post('/planos', permitir('ADMIN'), c.criarPlano);
router.put('/planos/:id', permitir('ADMIN'), c.atualizarPlano);
router.delete('/planos/:id', permitir('ADMIN'), c.deletarPlano);

router.get('/treinos', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.listarTreinos);
router.post('/treinos', permitir('ADMIN', 'INSTRUTOR'), c.criarTreino);
router.put('/treinos/:id', permitir('ADMIN', 'INSTRUTOR'), c.atualizarTreino);
router.delete('/treinos/:id', permitir('ADMIN', 'INSTRUTOR'), c.deletarTreino);

router.get('/frequencias', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.listarFrequencias);
router.post('/frequencias', permitir('ADMIN', 'INSTRUTOR', 'ALUNO'), c.registrarFrequencia);
router.delete('/frequencias/:id', permitir('ADMIN'), c.deletarFrequencia);

router.get('/pagamentos', permitir('ADMIN', 'ALUNO'), c.listarPagamentos);
router.post('/pagamentos', permitir('ADMIN'), c.criarPagamento);
router.put('/pagamentos/:id', permitir('ADMIN'), c.atualizarPagamento);
router.delete('/pagamentos/:id', permitir('ADMIN'), c.deletarPagamento);

router.get('/relatorios/geral', permitir('ADMIN'), c.obterRelatorioGeral);
router.get('/despesas', permitir('ADMIN'), c.listarDespesas);
router.post('/despesas', permitir('ADMIN'), c.criarDespesa);
router.put('/despesas/:id', permitir('ADMIN'), c.atualizarDespesa);
router.delete('/despesas/:id', permitir('ADMIN'), c.deletarDespesa);

export default router;

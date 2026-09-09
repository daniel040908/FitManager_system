import { Router } from 'express';
import { login } from '../controllers/authController.js';
import {
	listarUsuarios, criarUsuario, listarAlunos, criarAluno,
	listarInstrutores, criarInstrutor, listarPlanos, criarPlano,
	atualizarPlano, deletarPlano, listarTreinos, criarTreino,
	listarFrequencias, registrarFrequencia, listarPagamentos, criarPagamento,
} from '../controllers/crudController.js';

const router = Router();

router.post('/login', login);

router.post('/listar', listarUsuarios);

router.post('/criar', criarUsuario);

router.post('/listar-alunos', listarAlunos);

router.post('/criar-aluno', criarAluno);

router.post('/listar-instrutores', listarInstrutores);

router.post('/criar-instrutor', criarInstrutor);

router.post('/listar-planos', listarPlanos);

router.post('/criar-plano', criarPlano);

router.put('/atualizar-plano/:id', atualizarPlano);

router.delete('/deletar-plano/:id', deletarPlano);

router.post('/listar-treinos', listarTreinos);

router.post('/criar-treino', criarTreino);

router.post('/listar-frequencias', listarFrequencias);

router.post('/registrar-frequencia', registrarFrequencia);

router.post('/listar-pagamentos', listarPagamentos);

router.post('/criar-pagamento', criarPagamento);

export default router;

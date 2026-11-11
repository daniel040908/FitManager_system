const auth = [{ bearerAuth: [] }];
const idParam = [{ name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } }];
const list = (summary) => ({ summary, security: auth, responses: { 200: { description: 'Registros retornados' } } });
const create = (summary) => ({ summary, security: auth, responses: { 201: { description: 'Registro criado' }, 400: { description: 'Dados inválidos' } } });
const update = (summary) => ({ summary, security: auth, parameters: idParam, responses: { 200: { description: 'Registro atualizado' }, 404: { description: 'Registro não encontrado' } } });
const remove = (summary) => ({ summary, security: auth, parameters: idParam, responses: { 204: { description: 'Registro removido' }, 404: { description: 'Registro não encontrado' } } });

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'FitManager API',
    version: '1.1.0',
    description: 'API para gerenciamento de usuários, alunos, instrutores, planos, treinos, frequências, pagamentos e despesas.'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Desenvolvimento' }],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  paths: {
    '/health': { get: { summary: 'Verificar disponibilidade da API', responses: { 200: { description: 'API funcionando' } } } },
    '/auth/login': {
      post: {
        summary: 'Autenticar usuário',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object', required: ['email', 'senha'],
          properties: { email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 } }
        } } } },
        responses: { 200: { description: 'Token e dados do usuário' }, 400: { description: 'Dados inválidos' }, 401: { description: 'Credenciais inválidas' } }
      }
    },
    '/api/usuarios': { get: list('Listar usuários (ADMIN)'), post: create('Cadastrar usuário (ADMIN)') },
    '/api/usuarios/{id}': { put: update('Atualizar usuário (ADMIN)'), delete: remove('Excluir usuário (ADMIN)') },
    '/api/alunos': { get: list('Listar alunos conforme o perfil'), post: create('Cadastrar aluno (ADMIN)') },
    '/api/alunos/{id}': { put: update('Atualizar aluno (ADMIN)'), delete: remove('Excluir aluno (ADMIN)') },
    '/api/instrutores': { get: list('Listar instrutores'), post: create('Cadastrar instrutor (ADMIN)') },
    '/api/instrutores/{id}': { put: update('Atualizar instrutor (ADMIN)'), delete: remove('Excluir instrutor (ADMIN)') },
    '/api/planos': { get: list('Listar planos'), post: create('Cadastrar plano (ADMIN)') },
    '/api/planos/{id}': { put: update('Atualizar plano (ADMIN)'), delete: remove('Excluir plano (ADMIN)') },
    '/api/treinos': { get: list('Listar treinos conforme o perfil'), post: create('Cadastrar treino (ADMIN/INSTRUTOR)') },
    '/api/treinos/{id}': { put: update('Atualizar treino (ADMIN/INSTRUTOR responsável)'), delete: remove('Excluir treino (ADMIN/INSTRUTOR responsável)') },
    '/api/frequencias': { get: list('Listar frequências conforme o perfil'), post: create('Registrar frequência') },
    '/api/frequencias/{id}': { delete: remove('Excluir frequência (ADMIN)') },
    '/api/pagamentos': { get: list('Listar pagamentos conforme o perfil'), post: create('Cadastrar pagamento (ADMIN)') },
    '/api/pagamentos/{id}': { put: update('Atualizar pagamento (ADMIN)'), delete: remove('Excluir pagamento (ADMIN)') },
    '/api/despesas': { get: list('Listar despesas (ADMIN)'), post: create('Cadastrar despesa (ADMIN)') },
    '/api/despesas/{id}': { put: update('Atualizar despesa (ADMIN)'), delete: remove('Excluir despesa (ADMIN)') },
    '/api/relatorios/geral': { get: list('Consultar relatório operacional e financeiro (ADMIN)') }
  }
};

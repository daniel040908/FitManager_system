const jsonBody = (schema) => ({
  required: true,
  content: { 'application/json': { schema } },
});

const response = (description, schema) => ({
  description,
  ...(schema ? { content: { 'application/json': { schema } } } : {}),
});

const arrayOf = (name) => ({ type: 'array', items: { $ref: `#/components/schemas/${name}` } });
const secured = (operation) => ({ ...operation, security: [{ bearerAuth: [] }] });
const idParameter = { name: 'id', in: 'path', required: true, schema: { type: 'integer', minimum: 1 } };

const schemas = {
  Usuario: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, nome: { type: 'string' }, email: { type: 'string', format: 'email' },
      perfil: { type: 'string', enum: ['ADMIN', 'INSTRUTOR', 'ALUNO'] }, createdAt: { type: 'string', format: 'date-time' },
    },
  },
  UsuarioInput: {
    type: 'object', required: ['nome', 'email', 'senha'],
    properties: {
      nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 },
      perfil: { type: 'string', enum: ['ADMIN', 'INSTRUTOR', 'ALUNO'], default: 'ALUNO' },
    },
  },
  AlunoInput: {
    type: 'object', required: ['nome', 'email'],
    properties: {
      nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 },
      cpf: { type: 'string' }, telefone: { type: 'string' }, planoId: { type: 'integer', minimum: 1 },
    },
  },
  InstrutorInput: {
    type: 'object', required: ['nome', 'email'],
    properties: {
      nome: { type: 'string' }, email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 },
      cref: { type: 'string' }, telefone: { type: 'string' },
    },
  },
  Plano: {
    type: 'object',
    properties: {
      id: { type: 'integer' }, nome: { type: 'string' }, descricao: { type: 'string' }, valor: { type: 'number' },
      duracaoMeses: { type: 'integer' }, ativo: { type: 'boolean' },
    },
  },
  PlanoInput: {
    type: 'object', required: ['nome', 'valor', 'duracaoMeses'],
    properties: {
      nome: { type: 'string' }, descricao: { type: 'string' }, valor: { type: 'number', minimum: 0 },
      duracaoMeses: { type: 'integer', minimum: 1 }, ativo: { type: 'boolean' },
    },
  },
  TreinoInput: {
    type: 'object', required: ['nome', 'alunoId'],
    properties: {
      nome: { type: 'string' }, descricao: { type: 'string' }, alunoId: { type: 'integer', minimum: 1 }, instrutorId: { type: 'integer', minimum: 1 },
    },
  },
  FrequenciaInput: {
    type: 'object', required: ['alunoId'],
    properties: { alunoId: { type: 'integer', minimum: 1 }, presente: { type: 'boolean', default: true } },
  },
  PagamentoInput: {
    type: 'object', required: ['alunoId', 'valor', 'vencimento'],
    properties: {
      alunoId: { type: 'integer', minimum: 1 }, planoId: { type: 'integer', minimum: 1 }, valor: { type: 'number', minimum: 0 },
      vencimento: { type: 'string', format: 'date-time' }, status: { type: 'string', enum: ['PENDENTE', 'PAGO', 'ATRASADO'] },
    },
  },
  LoginInput: {
    type: 'object', required: ['email', 'senha'],
    properties: { email: { type: 'string', format: 'email' }, senha: { type: 'string', minLength: 6 } },
  },
  LoginResponse: {
    type: 'object', properties: { token: { type: 'string' }, usuario: { $ref: '#/components/schemas/Usuario' } },
  },
};

const crudPaths = {
  '/api/usuarios': {
    get: secured({ tags: ['Usuarios'], summary: 'Listar usuarios', responses: { 200: response('Lista de usuarios', arrayOf('Usuario')) } }),

    post: secured({ tags: ['Usuarios'], summary: 'Criar usuario', requestBody: jsonBody({ $ref: '#/components/schemas/UsuarioInput' }), responses: { 201: response('Usuario criado', { $ref: '#/components/schemas/Usuario' }), 400: response('Dados invalidos') } }),
  },
  '/api/alunos': {
    get: secured({ tags: ['Alunos'], summary: 'Listar alunos', responses: { 200: response('Lista de alunos') } }),

    post: secured({ tags: ['Alunos'], summary: 'Criar aluno', requestBody: jsonBody({ $ref: '#/components/schemas/AlunoInput' }), responses: { 201: response('Aluno criado'), 400: response('Dados invalidos') } }),
  },
  '/api/instrutores': {
    get: secured({ tags: ['Instrutores'], summary: 'Listar instrutores', responses: { 200: response('Lista de instrutores') } }),

    post: secured({ tags: ['Instrutores'], summary: 'Criar instrutor', requestBody: jsonBody({ $ref: '#/components/schemas/InstrutorInput' }), responses: { 201: response('Instrutor criado'), 400: response('Dados invalidos') } }),
  },
  '/api/planos': {
    get: secured({ tags: ['Planos'], summary: 'Listar planos', responses: { 200: response('Lista de planos', arrayOf('Plano')) } }),

    post: secured({ tags: ['Planos'], summary: 'Criar plano', requestBody: jsonBody({ $ref: '#/components/schemas/PlanoInput' }), responses: { 201: response('Plano criado', { $ref: '#/components/schemas/Plano' }), 400: response('Dados invalidos') } }),
  },
  '/api/planos/{id}': {
    put: secured({ tags: ['Planos'], summary: 'Atualizar plano', parameters: [idParameter], requestBody: jsonBody({ $ref: '#/components/schemas/PlanoInput' }), responses: { 200: response('Plano atualizado'), 400: response('Dados invalidos'), 404: response('Plano nao encontrado') } }),

    delete: secured({ tags: ['Planos'], summary: 'Excluir plano', parameters: [idParameter], responses: { 204: response('Plano excluido'), 404: response('Plano nao encontrado') } }),
  },
  '/api/treinos': {
    get: secured({ tags: ['Treinos'], summary: 'Listar treinos', responses: { 200: response('Lista de treinos') } }),

    post: secured({ tags: ['Treinos'], summary: 'Criar treino', requestBody: jsonBody({ $ref: '#/components/schemas/TreinoInput' }), responses: { 201: response('Treino criado'), 400: response('Dados invalidos') } }),
  },
  '/api/frequencias': {
    get: secured({ tags: ['Frequencias'], summary: 'Listar frequencias', responses: { 200: response('Lista de frequencias') } }),

    post: secured({ tags: ['Frequencias'], summary: 'Registrar frequencia', requestBody: jsonBody({ $ref: '#/components/schemas/FrequenciaInput' }), responses: { 201: response('Frequencia registrada'), 400: response('Dados invalidos') } }),
  },
  '/api/pagamentos': {
    get: secured({ tags: ['Pagamentos'], summary: 'Listar pagamentos', responses: { 200: response('Lista de pagamentos') } }),

    post: secured({ tags: ['Pagamentos'], summary: 'Criar pagamento', requestBody: jsonBody({ $ref: '#/components/schemas/PagamentoInput' }), responses: { 201: response('Pagamento criado'), 400: response('Dados invalidos') } }),
  },
};

const legacyPost = (summary, schema, status = 200) => ({
  post: {
    tags: ['Rotas legadas'],
    summary,
    ...(schema ? { requestBody: jsonBody({ $ref: `#/components/schemas/${schema}` }) } : {}),
    responses: { [status]: response(status === 201 ? `${summary} realizado` : summary) },
  },
});

const legacyPaths = {
  '/auth/listar': legacyPost('Listar usuarios'),
  '/auth/criar': legacyPost('Criar usuario', 'UsuarioInput', 201),
  '/auth/listar-alunos': legacyPost('Listar alunos'),
  '/auth/criar-aluno': legacyPost('Criar aluno', 'AlunoInput', 201),
  '/auth/listar-instrutores': legacyPost('Listar instrutores'),
  '/auth/criar-instrutor': legacyPost('Criar instrutor', 'InstrutorInput', 201),
  '/auth/listar-planos': legacyPost('Listar planos'),
  '/auth/criar-plano': legacyPost('Criar plano', 'PlanoInput', 201),
  '/auth/listar-treinos': legacyPost('Listar treinos'),
  '/auth/criar-treino': legacyPost('Criar treino', 'TreinoInput', 201),
  '/auth/listar-frequencias': legacyPost('Listar frequencias'),
  '/auth/registrar-frequencia': legacyPost('Registrar frequencia', 'FrequenciaInput', 201),
  '/auth/listar-pagamentos': legacyPost('Listar pagamentos'),
  '/auth/criar-pagamento': legacyPost('Criar pagamento', 'PagamentoInput', 201),
  '/auth/atualizar-plano/{id}': {
    put: {
      tags: ['Rotas legadas'],
      summary: 'Atualizar plano',
      parameters: [idParameter],
      requestBody: jsonBody({ $ref: '#/components/schemas/PlanoInput' }),
      responses: { 200: response('Plano atualizado') },
    },
  },
  '/auth/deletar-plano/{id}': {
    delete: {
      tags: ['Rotas legadas'],
      summary: 'Excluir plano',
      parameters: [idParameter],
      responses: { 204: response('Plano excluido') },
    },
  },
};

export const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'FitManager API', version: '1.0.0', description: 'API de gestao para academias.' },
  servers: [{ url: 'http://localhost:3000' }],
  tags: [
    { name: 'Autenticacao' }, { name: 'Usuarios' }, { name: 'Alunos' }, { name: 'Instrutores' },
    { name: 'Planos' }, { name: 'Treinos' }, { name: 'Frequencias' }, { name: 'Pagamentos' }, { name: 'Rotas legadas' },
  ],
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    parameters: { Id: idParameter },
    schemas,
  },
  paths: {
    '/': { get: { tags: ['Autenticacao'], summary: 'Informacoes da API', responses: { 200: response('API online') } } },
    '/health': { get: { tags: ['Autenticacao'], summary: 'Verificar saude da API', responses: { 200: response('API funcionando') } } },
    '/auth/login': { post: { tags: ['Autenticacao'], summary: 'Realizar login', requestBody: jsonBody({ $ref: '#/components/schemas/LoginInput' }), responses: { 200: response('Login realizado', { $ref: '#/components/schemas/LoginResponse' }), 400: response('Dados invalidos'), 401: response('Credenciais invalidas') } } },
    ...crudPaths,
    ...legacyPaths,
  },
};

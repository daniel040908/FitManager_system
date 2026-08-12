export const swaggerSpec = {
  openapi: '3.0.0',
  info: { title: 'FitManager API', version: '1.0.0', description: 'API de gestão para academias.' },
  servers: [{ url: 'http://localhost:3000' }],
  components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } } },
  paths: {
    '/auth/login': { post: { summary: 'Login', requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', required: ['email', 'senha'], properties: { email: { type: 'string' }, senha: { type: 'string' } } } } } }, responses: { 200: { description: 'Login realizado' }, 401: { description: 'Credenciais inválidas' } } } },
    '/health': { get: { summary: 'Health check', responses: { 200: { description: 'API funcionando' } } } }
  }
};

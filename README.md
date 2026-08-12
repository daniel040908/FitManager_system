# FitManager — Sistema de Gestão para Academias

Projeto estruturado a partir da proposta do TCC enviada: uma solução digital voltada principalmente para pequenas e médias academias, com foco em cadastro digital, treinos personalizados, frequência automática e gestão financeira.

## Stack

- Front-end: React + TypeScript + Vite
- Back-end: Node.js + Express
- ORM: Prisma
- Banco: MySQL
- Autenticação: JWT + bcrypt
- Documentação: Swagger/OpenAPI
- Organização: controllers, middlewares, routes, config e Prisma
- Front-end organizado com inspiração em Atomic Design

## Perfis

- ADMIN: gestão completa da academia
- INSTRUTOR: alunos, treinos e frequências
- ALUNO: consulta dos próprios dados, plano, treino e frequência

## Módulos

- Usuários e autenticação
- Alunos
- Instrutores
- Planos
- Treinos
- Frequências
- Pagamentos
- Dashboard

## Como executar

### 1. Banco

Crie um banco MySQL chamado `fitmanager`.

### 2. Back-end

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

API: `http://localhost:3000`
Swagger: `http://localhost:3000/docs`

### 3. Front-end

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Front-end: `http://localhost:5173`

### Login de teste

- E-mail: `admin@fitmanager.com`
- Senha: `123456`

Altere essa senha antes de usar o sistema em produção.

## Estrutura

```text
fitmanager/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── app.js
│       └── server.js
└── frontend/
    └── src/
        ├── components/
        │   ├── layout/
        │   └── ui/
        ├── pages/
        ├── services/
        ├── types/
        └── App.tsx
```

## Observação

Esta versão é uma base funcional/estrutural para continuar o desenvolvimento do TCC. Ainda vale acrescentar validações mais completas, filtros, paginação, recuperação de senha, regras finas por perfil, telas específicas para aluno/instrutor, testes automatizados e deploy.
"# FitManager_system" 

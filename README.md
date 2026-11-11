# FitManager — Sistema de Gestão para Academias

Aplicação web para gestão de academias, com frontend React + TypeScript + Vite e API Node.js + Express + Prisma + MySQL.

## Tecnologias

- Frontend: React, TypeScript, Vite e React Router
- Backend: Node.js e Express
- Banco de dados: MySQL 8+
- ORM: Prisma
- Autenticação: JWT e bcrypt
- Documentação: Swagger em `/docs`

## Perfis de acesso

- **ADMIN:** gerencia cadastros, planos, treinos, frequências e pagamentos.
- **INSTRUTOR:** consulta alunos, planos, treinos atribuídos e frequências; gerencia os treinos sob sua responsabilidade.
- **ALUNO:** consulta seus próprios treinos, frequências, pagamentos e planos. Os dados de outros alunos não são retornados.

## Preparação do banco

O schema Prisma utiliza as tabelas `usuarios`, `alunos`, `instrutores`, `planos`, `treinos`, `frequencias`, `pagamentos` e `despesas`. A tabela `despesas` é a única adição desta revisão; aplique o script `database/02_migracao_despesas.sql` antes de usar o módulo.

Se o banco já foi criado pelo script SQL fornecido, **não execute novamente o script que contém `DROP TABLE`**, pois ele apaga as tabelas e os dados. Nesse caso, configure o `DATABASE_URL` e execute apenas `npx prisma generate`.

Para um banco novo, crie `academia_db` no MySQL e execute:

```bash
cd backend
npm install
cp .env.example .env
# Edite DATABASE_URL e JWT_SECRET
npx prisma db push
npx prisma generate
npm run seed
npm run dev
```

O comando `prisma db push` sincroniza o schema sem criar migrations. Em banco que já contém dados, faça backup antes de qualquer alteração de estrutura e prefira validar o estado com `npx prisma db pull` antes de sincronizar.

## Backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

- API: `http://localhost:3000`
- Health check: `http://localhost:3000/health`
- Swagger: `http://localhost:3000/docs`

## Frontend

Em outro terminal:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend: `http://localhost:5173`

## Usuários de demonstração

O seed cria os seguintes usuários com a senha inicial `123456`:

| Perfil | E-mail |
|---|---|
| ADMIN | admin@fitmanager.com |
| INSTRUTOR | instrutor@fitmanager.com |
| ALUNO | aluno@fitmanager.com |

O `npm run seed` atualiza as senhas desses três usuários de demonstração para o hash bcrypt da senha `123456`, inclusive se já existirem. Execute o seed apenas em ambiente de desenvolvimento/teste. Altere as senhas antes de qualquer implantação real. Não utilize as credenciais de demonstração em produção.

## Principais ajustes desta versão

- Formulários e listagens do frontend conectados aos endpoints da API.
- Operações de edição e exclusão adicionadas aos módulos com permissão.
- Token e usuário armazenados separadamente; logout não limpa outros dados do navegador.
- Navegação adaptada aos perfis ADMIN, INSTRUTOR e ALUNO.
- Consultas de treinos, frequências e pagamentos filtradas para o aluno autenticado.
- Instrutores veem os treinos atribuídos a eles.
- Validações básicas de entrada e respostas para conflitos do Prisma.
- Seed idempotente para evitar duplicação dos dados de demonstração.\n- Módulo de despesas e relatório financeiro/operacional para administradores.\n- Busca e paginação local nas listagens.
- Remoção de dados de login pré-preenchidos e textos de demonstração desnecessários da interface.

## Observações

- A API não inclui recuperação de senha ou envio de e-mail.
- O frontend apresenta IDs de relacionamento nos formulários de treinos e pagamentos; para uso operacional, o próximo aprimoramento recomendado é trocar esses campos por seletores carregados da API.
- Testes automatizados e implantação em produção ainda precisam ser configurados.
"# FitManager_system" 

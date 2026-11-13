# 🏋️ FitManager — Sistema de Gestão para Academias

**FitManager** é uma aplicação web desenvolvida para facilitar e modernizar a administração de academias de pequeno e médio porte, centralizando o gerenciamento de alunos, instrutores, planos, treinos, frequências, pagamentos e despesas em uma única plataforma.

O sistema tem como objetivo reduzir processos manuais, melhorar a organização administrativa, facilitar o acompanhamento dos alunos e fornecer informações que auxiliem na tomada de decisões e no controle financeiro da academia.

A aplicação utiliza uma arquitetura composta por frontend independente, API REST e banco de dados relacional, garantindo organização, segurança e facilidade de manutenção.

---

## 📌 Sumário

- [Sobre o projeto](#-sobre-o-projeto)
- [Objetivos](#-objetivos)
- [Principais funcionalidades](#-principais-funcionalidades)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Arquitetura do sistema](#-arquitetura-do-sistema)
- [Perfis de acesso](#-perfis-de-acesso)
- [Estrutura do banco de dados](#-estrutura-do-banco-de-dados)
- [Requisitos para instalação](#-requisitos-para-instalação)
- [Instalação e configuração](#-instalação-e-configuração)
- [Configuração do banco de dados](#-configuração-do-banco-de-dados)
- [Execução do backend](#-execução-do-backend)
- [Execução do frontend](#-execução-do-frontend)
- [Documentação da API](#-documentação-da-api)
- [Usuários de demonstração](#-usuários-de-demonstração)
- [Segurança e autenticação](#-segurança-e-autenticação)
- [Principais ajustes desta versão](#-principais-ajustes-desta-versão)
- [Limitações e melhorias futuras](#-limitações-e-melhorias-futuras)
- [Considerações finais](#-considerações-finais)

---

## 📖 Sobre o projeto

O FitManager surgiu da necessidade de melhorar a gestão administrativa e operacional de academias que ainda utilizam planilhas, documentos físicos ou ferramentas descentralizadas para controlar suas atividades.

A falta de integração entre informações de alunos, pagamentos, planos e frequências pode gerar retrabalho, inconsistências nos registros e dificuldades no acompanhamento das atividades.

Para solucionar esses problemas, foi desenvolvido um sistema que centraliza as principais operações de uma academia, permitindo que cada usuário acesse funcionalidades de acordo com seu perfil e suas permissões.

O projeto foi desenvolvido utilizando React, TypeScript, Node.js, Express, Prisma e MySQL.

## 🎯 Objetivos

### Objetivo geral

Desenvolver um sistema web para gerenciamento de academias, proporcionando maior controle sobre informações administrativas, financeiras e operacionais.

### Objetivos específicos

- Centralizar o cadastro e gerenciamento de alunos e instrutores.
- Organizar os planos oferecidos pela academia.
- Permitir a criação e atribuição de treinos.
- Registrar e consultar frequências dos alunos.
- Controlar pagamentos e despesas.
- Disponibilizar informações financeiras e operacionais.
- Implementar autenticação e controle de acesso por perfil.
- Garantir a integridade e o relacionamento dos dados no banco de dados.
- Facilitar a navegação por meio de uma interface intuitiva e responsiva.

## ⚙️ Principais funcionalidades

### Gestão de usuários
- Cadastro de usuários.
- Edição e exclusão de registros.
- Autenticação por e-mail e senha.
- Controle de permissões por perfil.
- Gerenciamento de informações dos usuários.

### Gestão de alunos
- Cadastro e gerenciamento de alunos.
- Consulta de informações cadastrais.
- Controle de situação do aluno.
- Relacionamento com planos e pagamentos.
- Acompanhamento de treinos e frequências.

### Gestão de instrutores
- Cadastro e gerenciamento de instrutores.
- Consulta de informações profissionais.
- Associação de instrutores aos treinos.
- Visualização dos alunos e treinos relacionados às suas responsabilidades.

### Gestão de planos
- Cadastro de planos.
- Edição e exclusão de planos.
- Consulta dos planos disponíveis.
- Controle das informações relacionadas aos planos dos alunos.

### Gestão de treinos
- Cadastro de treinos.
- Edição e exclusão de treinos.
- Associação de treinos aos alunos.
- Associação de instrutores responsáveis.
- Consulta dos treinos conforme as permissões do usuário.

### Controle de frequências
- Registro de frequência dos alunos.
- Consulta do histórico de frequências.
- Acompanhamento da participação dos alunos.
- Restrição de acesso às informações conforme o perfil autenticado.

### Gestão de pagamentos
- Cadastro de pagamentos.
- Atualização de informações financeiras.
- Consulta de pagamentos.
- Controle de situações de pagamento.
- Relacionamento entre alunos e planos.

### Gestão de despesas
- Cadastro e gerenciamento de despesas.
- Consulta dos registros financeiros.
- Organização das informações de gastos.
- Apoio ao acompanhamento financeiro da academia.

### Relatórios e indicadores
- Consulta de informações financeiras e operacionais.
- Visualização de dados relacionados aos pagamentos e despesas.
- Apoio à administração e ao acompanhamento da academia.

### Recursos de interface
- Navegação adaptada aos perfis de acesso.
- Busca nas listagens.
- Paginação local.
- Formulários integrados à API.
- Operações de edição e exclusão conforme as permissões.
- Interface organizada para facilitar a utilização do sistema.

---

## 💻 Tecnologias utilizadas

O projeto utiliza tecnologias modernas para desenvolvimento frontend, backend e gerenciamento de dados.

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Frontend | React | Construção da interface |
| Linguagem frontend | TypeScript | Tipagem e organização do código |
| Ferramenta de desenvolvimento | Vite | Inicialização e execução do frontend |
| Navegação | React Router | Gerenciamento de rotas |
| Backend | Node.js | Ambiente de execução |
| Framework backend | Express | Desenvolvimento da API REST |
| Banco de dados | MySQL 8+ | Armazenamento das informações |
| ORM | Prisma | Comunicação com o banco |
| Autenticação | JWT | Autenticação e autorização |
| Criptografia de senhas | bcrypt | Proteção das senhas |
| Documentação | Swagger | Documentação dos endpoints |
| Controle de versão | Git e GitHub | Versionamento do projeto |

---

## 🏗️ Arquitetura do sistema

O FitManager utiliza uma arquitetura dividida em três partes principais:

**1. Frontend**

Responsável pela interface visual e pela interação dos usuários com o sistema. Desenvolvido com React, TypeScript e Vite.

**2. Backend**

Responsável pelas regras de negócio, autenticação, validações, permissões e comunicação com o banco de dados. Desenvolvido com Node.js e Express.

**3. Banco de dados**

Responsável pelo armazenamento e relacionamento das informações. Utiliza MySQL com Prisma ORM.

### Fluxo de comunicação

```text
┌──────────────────────────────┐
│          FRONTEND            │
│                              │
│      React + TypeScript      │
│             Vite             │
└──────────────┬───────────────┘
               │
               │ Requisições HTTP
               │ JSON + JWT
               ▼
┌──────────────────────────────┐
│           BACKEND            │
│                              │
│        Node.js + Express     │
│                              │
│  Controllers / Routes        │
│  Middlewares / Validações    │
│  Autenticação JWT            │
│                              │
└──────────────┬───────────────┘
               │
               │ Prisma ORM
               ▼
┌──────────────────────────────┐
│        BANCO DE DADOS         │
│                              │
│           MySQL 8+           │
│                              │
│  Usuários / Alunos           │
│  Instrutores / Planos        │
│  Treinos / Frequências       │
│  Pagamentos / Despesas       │
└──────────────────────────────┘
```

---

## 👥 Perfis de acesso

O sistema possui três perfis de acesso, com permissões específicas para cada tipo de usuário.

### ADMIN — Administrador

Possui acesso administrativo ao sistema.

Permissões:
- Gerenciar usuários.
- Gerenciar alunos.
- Gerenciar instrutores.
- Gerenciar planos.
- Gerenciar treinos.
- Consultar e gerenciar frequências.
- Gerenciar pagamentos.
- Gerenciar despesas.
- Consultar informações financeiras e operacionais.

### INSTRUTOR — Instrutor

Possui acesso às funcionalidades relacionadas ao acompanhamento dos alunos e à gestão dos treinos sob sua responsabilidade.

Permissões:
- Consultar alunos.
- Consultar planos.
- Visualizar treinos atribuídos.
- Gerenciar os treinos sob sua responsabilidade.
- Consultar frequências conforme suas permissões.

### ALUNO — Aluno

Possui acesso restrito às próprias informações.

Permissões:
- Consultar seus próprios dados.
- Visualizar seus treinos.
- Consultar suas frequências.
- Consultar seus pagamentos.
- Consultar seu plano.

**Importante:** os dados de outros alunos não são retornados nas consultas destinadas ao perfil ALUNO.

---

## 🗄️ Estrutura do banco de dados

O banco de dados utilizado pelo FitManager é o MySQL 8+, com gerenciamento de estrutura e relacionamentos por meio do Prisma ORM.

O projeto utiliza as seguintes tabelas principais:

| Tabela | Descrição |
|---|---|
| `usuarios` | Armazena os dados de autenticação e perfil dos usuários. |
| `alunos` | Armazena informações dos alunos cadastrados. |
| `instrutores` | Armazena informações dos instrutores. |
| `planos` | Armazena os planos disponibilizados pela academia. |
| `treinos` | Armazena os treinos cadastrados e suas associações. |
| `frequencias` | Registra a frequência dos alunos. |
| `pagamentos` | Armazena os registros de pagamentos. |
| `despesas` | Armazena as despesas administrativas e financeiras. |

### Relacionamentos

O banco utiliza relacionamentos entre as entidades para manter a integridade dos dados e evitar duplicidade desnecessária de informações.

Entre os relacionamentos estão:

- Usuários associados a alunos ou instrutores.
- Alunos associados a planos.
- Treinos associados a alunos e instrutores.
- Frequências relacionadas aos alunos.
- Pagamentos relacionados aos alunos e planos.
- Despesas registradas para controle financeiro.

A estrutura completa dos relacionamentos pode ser consultada no arquivo `schema.prisma`.

---

## 📋 Requisitos para instalação

Antes de executar o projeto, é necessário possuir as seguintes ferramentas instaladas:

- [Node.js](https://nodejs.org/) — versão compatível com as dependências do projeto.
- [npm](https://www.npmjs.com/) — gerenciador de pacotes.
- [MySQL 8+](https://dev.mysql.com/downloads/mysql/) — banco de dados.
- [Git](https://git-scm.com/) — controle de versão.
- [HeidiSQL](https://www.heidisql.com/) — opcional, para gerenciamento visual do banco.
- Visual Studio Code ou outro editor de código.

---

## 🚀 Instalação e configuração

### 1. Clonar o repositório

```bash
git clone https://github.com/daniel040908/FitManager_system.git
```

Acessar a pasta:

```bash
cd FitManager_system
```

### 2. Instalar as dependências do backend

```bash
cd backend
npm install
```

### 3. Configurar as variáveis de ambiente

Crie o arquivo `.env` dentro da pasta `backend`, utilizando o `.env.example` como referência.

Exemplo:

```env
PORT=3000

DATABASE_URL="mysql://root:root@localhost:3306/academia_db"

JWT_SECRET="sua_chave_secreta"

JWT_EXPIRES_IN="8h"

CORS_ORIGIN="http://localhost:5173"
```

**Atenção:**
- Ajuste o usuário e a senha conforme a configuração do seu MySQL.
- O banco `academia_db` precisa existir.
- Utilize uma chave JWT segura e exclusiva em ambientes reais.
- Nunca compartilhe o arquivo `.env` ou envie credenciais para o GitHub.

### 4. Configurar o frontend

Em outro terminal:

```bash
cd frontend
npm install
```

Crie o arquivo `.env` utilizando o `.env.example` como referência.

Configure a URL da API de acordo com o nome da variável utilizada no código do frontend.

---

## 🛠️ Configuração do banco de dados

O schema Prisma utiliza as tabelas:

`usuarios`, `alunos`, `instrutores`, `planos`, `treinos`, `frequencias`, `pagamentos` e `despesas`.

A tabela `despesas` é a única adição desta revisão. Aplique o script:

```text
database/02_migracao_despesas.sql
```

antes de utilizar o módulo de despesas.

### Banco de dados já existente

Se o banco já foi criado pelo script SQL fornecido no projeto:

1. Não execute novamente o script que contém `DROP TABLE`.
2. Configure corretamente o `DATABASE_URL`.
3. Execute:

```bash
cd backend
npx prisma generate
```

Isso permite gerar o Prisma Client sem recriar as tabelas ou apagar os registros existentes.

### Banco de dados novo

Se estiver configurando o projeto pela primeira vez:

1. Crie o banco `academia_db` no MySQL.
2. Configure o arquivo `.env`.
3. Execute os comandos:

```bash
cd backend

npm install

npx prisma db push

npx prisma generate

npm run seed

npm run dev
```

**Observação sobre o Prisma:**

O comando `prisma db push` sincroniza a estrutura do banco com o schema Prisma sem criar migrations.

Em bancos que já possuem dados, faça backup antes de qualquer alteração estrutural. É recomendado verificar previamente a estrutura existente com:

```bash
npx prisma db pull
```

Compare o resultado com o `schema.prisma` do projeto antes de sincronizar as alterações.

---

## 🔧 Execução do backend

Dentro da pasta `backend`, execute:

```bash
npm install
```

Caso ainda não tenha configurado o Prisma Client:

```bash
npx prisma generate
```

Para iniciar o servidor em desenvolvimento:

```bash
npm run dev
```

O backend será disponibilizado em:

| Serviço | Endereço |
|---|---|
| API | http://localhost:3000 |
| Health Check | http://localhost:3000/health |
| Swagger | http://localhost:3000/docs |

### Health Check

O endpoint `/health` permite verificar a disponibilidade do servidor.

---

## 🎨 Execução do frontend

Em outro terminal, acesse a pasta `frontend`:

```bash
cd frontend
```

Instale as dependências:

```bash
npm install
```

Configure o arquivo `.env` conforme o `.env.example`.

Inicie a aplicação:

```bash
npm run dev
```

O frontend estará disponível em:

**http://localhost:5173**

---

## 📚 Documentação da API

A API do FitManager utiliza Swagger para documentar suas rotas e facilitar a consulta e realização de requisições HTTP.

A documentação pode ser acessada pelo navegador:

**http://localhost:3000/docs**

A documentação apresenta os endpoints disponíveis, seus parâmetros, respostas e esquemas de autenticação. O arquivo OpenAPI também pode ser consultado em **http://localhost:3000/docs.json**.

Ao iniciar o backend com `npm run dev` ou `npm start`, o CMD exibe os endereços da documentação e a lista de rotas documentadas.

A API utiliza autenticação Bearer Token com JWT nas rotas protegidas.

---

### Observações sobre o Seed

O comando `npm run seed` atualiza as senhas desses três usuários de demonstração para o hash bcrypt correspondente a `FitManager#2026`, inclusive quando os usuários já existem.

O seed foi desenvolvido para evitar duplicação dos registros de demonstração.

### Validação de senha no login

A senha deve ter pelo menos 12 caracteres, conter ao menos uma letra maiúscula e uma minúscula, e pode conter no máximo um caractere especial. Números são permitidos; não são obrigatórios. A senha inicial do seed atende a essas regras.

**Importante:**
- Execute o seed somente em ambientes de desenvolvimento ou teste.
- O seed redefine a senha das contas de demonstração para `FitManager#2026`, inclusive se elas já existirem.
- Altere as credenciais antes de qualquer implantação real.
- Nunca utilize as senhas de demonstração em produção.

---

## 🛡️ Segurança e autenticação

O FitManager utiliza mecanismos básicos de segurança para proteger o acesso às funcionalidades e informações.

### Autenticação JWT

O sistema utiliza JSON Web Token para identificar usuários autenticados.

Após o login, o backend disponibiliza um token que deve ser enviado nas requisições às rotas protegidas.

### Criptografia de senhas

As senhas são protegidas utilizando bcrypt, evitando o armazenamento de senhas em texto puro.

### Controle de permissões

As funcionalidades são disponibilizadas conforme o perfil do usuário autenticado:

- ADMIN.
- INSTRUTOR.
- ALUNO.

### Proteção de dados

As consultas de informações pessoais respeitam as permissões do usuário.

O perfil ALUNO possui acesso restrito aos próprios dados, enquanto o INSTRUTOR tem acesso às informações relacionadas às suas responsabilidades.

---

## 🔄 Principais ajustes desta versão

Esta versão apresenta melhorias na integração entre frontend, backend e banco de dados.

### Backend
- Integração das operações de cadastro, consulta, edição e exclusão com o banco de dados.
- Ajustes nos endpoints utilizados pelo frontend.
- Validações básicas de entrada.
- Tratamento de conflitos e erros do Prisma.
- Implementação de restrições de acesso conforme o perfil.
- Ajustes nas consultas de treinos, frequências e pagamentos.
- Seed idempotente para os usuários de demonstração.

### Frontend
- Formulários e listagens conectados aos endpoints da API.
- Operações de edição e exclusão adicionadas aos módulos com permissão.
- Navegação adaptada aos perfis ADMIN, INSTRUTOR e ALUNO.
- Armazenamento separado do token e das informações do usuário.
- Logout sem limpeza de outros dados do navegador.
- Remoção de dados de login pré-preenchidos.
- Remoção de textos de demonstração desnecessários.
- Busca e paginação local nas listagens.

### Banco de dados e regras de negócio
- Consultas de treinos, frequências e pagamentos filtradas para o aluno autenticado.
- Instrutores visualizam os treinos atribuídos a eles.
- Inclusão do módulo de despesas.
- Inclusão de informações para relatórios financeiros e operacionais.
- Preservação da estrutura existente do banco, com migração específica para despesas.

---

## 🚧 Limitações e melhorias futuras

Apesar das funcionalidades implementadas, algumas melhorias podem ser realizadas para ampliar a qualidade e a maturidade do sistema.

### Melhorias recomendadas

- Implementar recuperação de senha.
- Desenvolver envio de e-mails para recuperação e notificações.
- Substituir campos de IDs de relacionamento por seletores dinâmicos carregados diretamente da API nos formulários de treinos e pagamentos.
- Implementar testes automatizados para frontend e backend.
- Melhorar os relatórios financeiros com filtros por período.
- Implementar paginação diretamente no backend para grandes volumes de registros.
- Aprimorar a responsividade em diferentes dispositivos.
- Configurar implantação em ambiente de produção.
- Implementar monitoramento e registro de erros.
- Revisar configurações de segurança para implantação pública.

### Limitações conhecidas

- A API ainda não possui recuperação de senha ou envio de e-mails.
- Os formulários de treinos e pagamentos ainda apresentam IDs de relacionamento em vez de seletores dinâmicos.
- Os testes automatizados ainda precisam ser configurados.
- A implantação em produção ainda precisa ser preparada.

---

## 📁 Organização geral do projeto

A aplicação está dividida em duas partes principais:

```text
FitManager_system/
│
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   │
│   ├── database/
│   │
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── ...
│   │
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── .env.example
│   └── package.json
│
├── database/
    └── 01_database_completo.sql
│   └── 02_migracao_despesas.sql

│
└── README.md
```



---

## 📌 Considerações finais

O FitManager busca oferecer uma solução integrada para o gerenciamento de academias, reunindo funcionalidades administrativas, operacionais e financeiras em uma única aplicação.

Por meio da integração entre React, Node.js, Express, Prisma e MySQL, o projeto permite centralizar informações, organizar processos e estabelecer controles de acesso específicos para administradores, instrutores e alunos.

Além de atender às necessidades básicas de gerenciamento, o sistema apresenta uma estrutura que permite futuras expansões, melhorias e novas funcionalidades.

**FitManager — Mais organização, controle e eficiência para a gestão de academias.**

---

## 👨‍💻 Desenvolvedor

**Daniel de Campos Medeiros**

Projeto acadêmico desenvolvido com foco em Engenharia de Software, Desenvolvimento Web, Banco de Dados e integração entre frontend e backend.

**Repositório:** https://github.com/daniel040908/FitManager_system
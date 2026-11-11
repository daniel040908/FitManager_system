# FitManager — pacote de banco de dados

## Resultado da revisão

O script SQL fornecido já cria as sete tabelas utilizadas pelo `schema.prisma`:

- `usuarios`
- `alunos`
- `instrutores`
- `planos`
- `treinos`
- `frequencias`
- `pagamentos`

As relações e os campos principais também correspondem ao schema atual do Prisma. **Não é necessária uma alteração estrutural obrigatória no banco para receber as mudanças do código.** As correções de autorização e filtragem foram feitas no backend.

## Atenção

O script SQL original contém `DROP TABLE IF EXISTS`. Não o execute novamente em uma base que já tenha dados, porque isso apaga as tabelas e os registros.

Este pacote é complementar e não destrutivo:
- `00_verificar_estrutura.sql`: consulta as tabelas e colunas existentes.
- `01_views.sql`: recria somente as views de consulta; não apaga nem altera registros das tabelas.
- `02_migracao_despesas.sql`: cria a tabela adicional `despesas`, necessária ao novo módulo financeiro. É uma alteração aditiva e não remove dados existentes.

Execute os arquivos no HeidiSQL conectado ao banco `academia_db`. As views são opcionais para a API, pois o backend usa Prisma diretamente. Para habilitar o módulo de despesas, execute `02_migracao_despesas.sql` depois de conferir que o banco `academia_db` e a tabela `usuarios` existem. O comando usa `CREATE TABLE IF NOT EXISTS` e não apaga dados.

## Conexão

Ajuste a senha do usuário MySQL no `backend/.env`:

```env
DATABASE_URL="mysql://root:sua_senha@localhost:3306/academia_db"
```

Execute primeiro `02_migracao_despesas.sql` no HeidiSQL para habilitar o novo módulo de despesas. Depois, no diretório `backend`, execute:

```bash
npx prisma generate
```

Se o banco já existe, não execute `prisma db push` sem antes conferir o schema e realizar backup.


## Diagnóstico do erro de login (500)

1. Abra `http://localhost:3000/health/db`. O resultado esperado é `status: ok` e `database: connected`.
2. Se retornar 503, confira se o MySQL está iniciado e se `backend/.env` contém a senha correta do MySQL em `DATABASE_URL`.
3. No terminal, dentro de `backend`, execute `npx prisma generate` e depois reinicie a API.
4. Execute `03_verificar_login.sql` no HeidiSQL para conferir se a tabela `usuarios` existe e quais e-mails estão cadastrados.
5. Para criar/atualizar os usuários de demonstração com hash bcrypt válido, execute `npm run seed` dentro de `backend`.

O seed disponibiliza `admin@fitmanager.com`, `instrutor@fitmanager.com` e `aluno@fitmanager.com`, todos com senha inicial `123456`. O e-mail `daniel@gmail.com` da captura não é criado pelo seed; use um dos e-mails listados ou cadastre esse usuário pela aplicação depois que o login administrativo funcionar.

**Não execute novamente o SQL original que contém `DROP TABLE IF EXISTS`** para corrigir o login. Ele apaga as tabelas e os registros. O hash bcrypt do usuário administrador presente naquele SQL também não deve ser considerado uma senha funcional; use o seed para gerar hashes corretos.

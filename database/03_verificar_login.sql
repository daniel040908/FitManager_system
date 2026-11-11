-- Diagnóstico somente leitura do login FitManager.
-- Execute no HeidiSQL após selecionar o banco academia_db.
-- Este arquivo NÃO altera nem apaga dados.

USE academia_db;

-- Confirma a existência da tabela e a estrutura usada pelo login.
SHOW COLUMNS FROM usuarios;

-- Lista somente dados não sensíveis dos usuários existentes.
-- Não exibe a coluna senha.
SELECT id, nome, email, perfil FROM usuarios ORDER BY id;

-- Confirma a versão do servidor e a conexão atual.
SELECT DATABASE() AS banco_atual, VERSION() AS versao_mysql;

USE academia_db;

CREATE TABLE IF NOT EXISTS despesas (
    id INT NOT NULL AUTO_INCREMENT,
    descricao VARCHAR(191) NOT NULL,
    categoria VARCHAR(191) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    data DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    usuarioId INT NULL,
    PRIMARY KEY (id),
    KEY idx_despesas_data (data),
    KEY idx_despesas_categoria (categoria),
    KEY idx_despesas_usuarioId (usuarioId),
    CONSTRAINT fk_despesas_usuario
        FOREIGN KEY (usuarioId)
        REFERENCES usuarios(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Adicionar tabelas de conversas e mensagens ao banco pit

USE pit;

-- Tabela de conversas
CREATE TABLE IF NOT EXISTS conversas (
    id_conversa INT PRIMARY KEY AUTO_INCREMENT,
    usuario1_id INT NOT NULL,
    usuario2_id INT NOT NULL,
    tipo1 ENUM('empresa', 'fornecedor') NOT NULL,
    tipo2 ENUM('empresa', 'fornecedor') NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usuario1 (usuario1_id),
    INDEX idx_usuario2 (usuario2_id)
);

-- Tabela de mensagens
CREATE TABLE IF NOT EXISTS mensagens (
    id_mensagem INT PRIMARY KEY AUTO_INCREMENT,
    id_conversa INT NOT NULL,
    remetente_id INT NOT NULL,
    tipo_remetente ENUM('empresa', 'fornecedor') NOT NULL,
    conteudo TEXT NOT NULL,
    enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lida BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_conversa) REFERENCES conversas(id_conversa) ON DELETE CASCADE,
    INDEX idx_conversa (id_conversa),
    INDEX idx_remetente (remetente_id)
);
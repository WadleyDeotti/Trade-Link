import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function createDatabase() {
  try {
    // Conecta ao banco (cria o arquivo se não existir)
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database
    });

    console.log('🔧 Criando tabelas...');

    // Criar tabela empresas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS empresas (
        id_empresa INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_fantasia VARCHAR(150) NOT NULL,
        razao_social VARCHAR(150),
        cnpj CHAR(14) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        endereco TEXT,
        email_verificado BOOLEAN DEFAULT 0,
        token_validacao VARCHAR(255),
        validade_token TIMESTAMP NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        localizacao VARCHAR(255) DEFAULT 'não definido',
        visibility TEXT DEFAULT 'public' CHECK(visibility IN ('public','friends','private')),
        data_sharing BOOLEAN DEFAULT 0,
        show_activity BOOLEAN DEFAULT 0,
        search_visibility BOOLEAN DEFAULT 0,
        notify_messages BOOLEAN DEFAULT 0,
        notify_mentions BOOLEAN DEFAULT 0,
        notify_updates BOOLEAN DEFAULT 0,
        notify_comments BOOLEAN DEFAULT 0,
        important_only BOOLEAN DEFAULT 0,
        email_notifications BOOLEAN DEFAULT 0,
        push_notifications BOOLEAN DEFAULT 0,
        language VARCHAR(10) DEFAULT 'pt-br',
        datetime_format TEXT DEFAULT '24h' CHECK(datetime_format IN ('24h','12h')),
        timezone VARCHAR(10) DEFAULT '-3',
        descricao TEXT
      )
    `);

    // Criar tabela fornecedores
    await db.exec(`
      CREATE TABLE IF NOT EXISTS fornecedores (
        id_fornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
        nome_fantasia VARCHAR(150) NOT NULL,
        razao_social VARCHAR(150),
        cpf CHAR(14) UNIQUE NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        endereco TEXT,
        email_verificado BOOLEAN DEFAULT 0,
        token_validacao VARCHAR(255),
        validade_token TIMESTAMP NULL,
        data_cadastro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        descricao TEXT,
        localizacao VARCHAR(255) DEFAULT 'não definido',
        visibility TEXT DEFAULT 'public' CHECK(visibility IN ('public','friends','private')),
        data_sharing BOOLEAN DEFAULT 0,
        show_activity BOOLEAN DEFAULT 0,
        search_visibility BOOLEAN DEFAULT 0,
        notify_messages BOOLEAN DEFAULT 0,
        notify_mentions BOOLEAN DEFAULT 0,
        notify_updates BOOLEAN DEFAULT 0,
        notify_comments BOOLEAN DEFAULT 0,
        important_only BOOLEAN DEFAULT 0,
        email_notifications BOOLEAN DEFAULT 0,
        push_notifications BOOLEAN DEFAULT 0,
        language VARCHAR(10) DEFAULT 'pt-br',
        datetime_format TEXT DEFAULT '24h' CHECK(datetime_format IN ('24h','12h')),
        timezone VARCHAR(10) DEFAULT '-3'
      )
    `);

    // Criar tabela produtos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS produtos (
        id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
        id_fornecedor INTEGER NOT NULL,
        nome_produto VARCHAR(150) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10,2) NOT NULL,
        disponivel BOOLEAN DEFAULT 1,
        categoria VARCHAR(50),
        FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
      )
    `);

    // Criar tabela usuarios
    await db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id_usuario INTEGER PRIMARY KEY AUTOINCREMENT,
        nome VARCHAR(150) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        tipo TEXT NOT NULL CHECK(tipo IN ('empresa', 'fornecedor', 'admin')),
        id_empresa INTEGER,
        id_fornecedor INTEGER,
        email_verificado BOOLEAN DEFAULT 0,
        token_validacao VARCHAR(255),
        validade_token TIMESTAMP NULL,
        ultimo_login TIMESTAMP NULL,
        FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
        FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
      )
    `);

    // Criar tabela notificacoes
    await db.exec(`
      CREATE TABLE IF NOT EXISTS notificacoes (
        id_notificacao INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        titulo VARCHAR(150) NOT NULL,
        mensagem TEXT NOT NULL,
        tipo TEXT DEFAULT 'info' CHECK(tipo IN ('info', 'alerta', 'aviso', 'contrato', 'compra')),
        lida BOOLEAN DEFAULT 0,
        data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      )
    `);

    // Criar tabela contratos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contratos (
        id_contrato INTEGER PRIMARY KEY AUTOINCREMENT,
        id_empresa INTEGER NOT NULL,
        id_fornecedor INTEGER NOT NULL,
        data_inicio DATE NOT NULL,
        data_fim DATE,
        valor_total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('ativo', 'encerrado', 'pendente')),
        arquivo_pdf VARCHAR(255),
        FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
        FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
      )
    `);

    // Criar tabela contrato_produtos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS contrato_produtos (
        id_contrato INTEGER NOT NULL,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        preco_unitario DECIMAL(10,2) NOT NULL,
        PRIMARY KEY (id_contrato, id_produto),
        FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE CASCADE,
        FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
      )
    `);

    // Criar tabela historico_contratos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS historico_contratos (
        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
        id_contrato INTEGER NOT NULL,
        data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        acao TEXT NOT NULL CHECK(acao IN ('criado', 'atualizado', 'encerrado')),
        descricao TEXT,
        FOREIGN KEY (id_contrato) REFERENCES contratos(id_contrato) ON DELETE CASCADE
      )
    `);

    // Criar tabela compras
    await db.exec(`
      CREATE TABLE IF NOT EXISTS compras (
        id_compra INTEGER PRIMARY KEY AUTOINCREMENT,
        id_empresa INTEGER NOT NULL,
        id_fornecedor INTEGER NOT NULL,
        data_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        valor_total DECIMAL(10,2) NOT NULL,
        status TEXT DEFAULT 'pendente' CHECK(status IN ('pendente', 'aprovada', 'enviada', 'concluída', 'cancelada')),
        FOREIGN KEY (id_empresa) REFERENCES empresas(id_empresa) ON DELETE CASCADE,
        FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
      )
    `);

    // Criar tabela compra_produtos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS compra_produtos (
        id_compra INTEGER NOT NULL,
        id_produto INTEGER NOT NULL,
        quantidade INTEGER NOT NULL DEFAULT 1,
        preco_unitario DECIMAL(10,2) NOT NULL,
        PRIMARY KEY (id_compra, id_produto),
        FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE,
        FOREIGN KEY (id_produto) REFERENCES produtos(id_produto) ON DELETE CASCADE
      )
    `);

    // Criar tabela historico_compras
    await db.exec(`
      CREATE TABLE IF NOT EXISTS historico_compras (
        id_historico INTEGER PRIMARY KEY AUTOINCREMENT,
        id_compra INTEGER NOT NULL,
        data_modificacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        acao TEXT NOT NULL CHECK(acao IN ('criado', 'pago', 'enviado', 'recebido', 'cancelado')),
        descricao TEXT,
        FOREIGN KEY (id_compra) REFERENCES compras(id_compra) ON DELETE CASCADE
      )
    `);

    // Criar tabela conversas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS conversas (
        id_conversa INTEGER PRIMARY KEY AUTOINCREMENT,
        usuario1_id INTEGER NOT NULL,
        usuario2_id INTEGER NOT NULL,
        tipo1 TEXT NOT NULL CHECK(tipo1 IN ('empresa', 'fornecedor')),
        tipo2 TEXT NOT NULL CHECK(tipo2 IN ('empresa', 'fornecedor')),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar índices para conversas
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_usuarios ON conversas (usuario1_id, usuario2_id)`);

    // Criar tabela mensagens
    await db.exec(`
      CREATE TABLE IF NOT EXISTS mensagens (
        id_mensagem INTEGER PRIMARY KEY AUTOINCREMENT,
        id_conversa INTEGER NOT NULL,
        remetente_id INTEGER NOT NULL,
        tipo_remetente TEXT NOT NULL CHECK(tipo_remetente IN ('empresa', 'fornecedor')),
        conteudo TEXT NOT NULL,
        enviado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        lida BOOLEAN DEFAULT 0,
        FOREIGN KEY (id_conversa) REFERENCES conversas(id_conversa) ON DELETE CASCADE
      )
    `);

    // Criar índices para mensagens
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_conversa ON mensagens (id_conversa)`);
    await db.exec(`CREATE INDEX IF NOT EXISTS idx_remetente ON mensagens (remetente_id, tipo_remetente)`);

    // Criar tabela log_atividades
    await db.exec(`
      CREATE TABLE IF NOT EXISTS log_atividades (
        id_log INTEGER PRIMARY KEY AUTOINCREMENT,
        id_usuario INTEGER NOT NULL,
        acao VARCHAR(255) NOT NULL,
        ip_usuario VARCHAR(45),
        data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario) ON DELETE CASCADE
      )
    `);

    console.log('🔧 Criando triggers...');

    // Trigger para inserir usuário quando empresa é criada
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_empresas_insert
      AFTER INSERT ON empresas
      FOR EACH ROW
      BEGIN
        INSERT INTO usuarios (
          nome, email, senha_hash, tipo, id_empresa, email_verificado, token_validacao, validade_token
        )
        VALUES (
          NEW.nome_fantasia,
          NEW.email,
          NEW.senha_hash,
          'empresa',
          NEW.id_empresa,
          NEW.email_verificado,
          NEW.token_validacao,
          NEW.validade_token
        );
      END
    `);

    // Trigger para atualizar usuário quando empresa é atualizada
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_empresas_update
      AFTER UPDATE ON empresas
      FOR EACH ROW
      BEGIN
        UPDATE usuarios SET
          nome = NEW.nome_fantasia,
          email = NEW.email,
          senha_hash = NEW.senha_hash,
          email_verificado = NEW.email_verificado,
          token_validacao = NEW.token_validacao,
          validade_token = NEW.validade_token
        WHERE id_empresa = NEW.id_empresa;
      END
    `);

    // Trigger para inserir usuário quando fornecedor é criado
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_fornecedores_insert
      AFTER INSERT ON fornecedores
      FOR EACH ROW
      BEGIN
        INSERT INTO usuarios (
          nome, email, senha_hash, tipo, id_fornecedor, email_verificado, token_validacao, validade_token
        )
        VALUES (
          NEW.nome_fantasia,
          NEW.email,
          NEW.senha_hash,
          'fornecedor',
          NEW.id_fornecedor,
          NEW.email_verificado,
          NEW.token_validacao,
          NEW.validade_token
        );
      END
    `);

    // Trigger para atualizar usuário quando fornecedor é atualizado
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_fornecedores_update
      AFTER UPDATE ON fornecedores
      FOR EACH ROW
      BEGIN
        UPDATE usuarios SET
          nome = NEW.nome_fantasia,
          email = NEW.email,
          senha_hash = NEW.senha_hash,
          email_verificado = NEW.email_verificado,
          token_validacao = NEW.token_validacao,
          validade_token = NEW.validade_token
        WHERE id_fornecedor = NEW.id_fornecedor;
      END
    `);

    // Trigger para log quando usuário é inserido
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_usuarios_insert_log
      AFTER INSERT ON usuarios
      FOR EACH ROW
      BEGIN
        INSERT INTO log_atividades (id_usuario, acao, ip_usuario)
        VALUES (NEW.id_usuario, 'Usuário criado automaticamente', '0.0.0.0');
      END
    `);

    // Trigger para log quando usuário é atualizado
    await db.exec(`
      CREATE TRIGGER IF NOT EXISTS trg_usuarios_update_log
      AFTER UPDATE ON usuarios
      FOR EACH ROW
      BEGIN
        INSERT INTO log_atividades (id_usuario, acao, ip_usuario)
        VALUES (NEW.id_usuario, 'Dados do usuário atualizados automaticamente', '0.0.0.0');
      END
    `);

    console.log('✅ Database SQLite criada com sucesso!');
    console.log('📁 Arquivo: ./database.db');
    console.log('🔧 Triggers configurados');
    
    await db.close();
  } catch (error) {
    console.error('❌ Erro ao criar database:', error);
  }
}

createDatabase();
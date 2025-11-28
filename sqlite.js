import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Criar pasta data se não existir
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Banco de dados será criado na pasta do projeto
const dbPath = path.join(dataDir, 'tradelink.db');
const db = new Database(dbPath);

// Configurações do SQLite
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Criar tabelas se não existirem
const createTables = () => {
  // Empresas
  db.exec(`
    CREATE TABLE IF NOT EXISTS empresas (
      id_empresa INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_fantasia TEXT NOT NULL,
      razao_social TEXT,
      cnpj TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL,
      telefone TEXT,
      endereco TEXT,
      email_verificado BOOLEAN DEFAULT 0,
      token_validacao TEXT,
      validade_token DATETIME,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      localizacao TEXT DEFAULT 'não definido',
      visibility TEXT DEFAULT 'public',
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
      language TEXT DEFAULT 'pt-br',
      datetime_format TEXT DEFAULT '24h',
      timezone TEXT DEFAULT '-3',
      descricao TEXT
    )
  `);

  // Fornecedores
  db.exec(`
    CREATE TABLE IF NOT EXISTS fornecedores (
      id_fornecedor INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_fantasia TEXT NOT NULL,
      razao_social TEXT,
      cpf TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      senha_hash TEXT NOT NULL,
      telefone TEXT,
      endereco TEXT,
      email_verificado BOOLEAN DEFAULT 0,
      token_validacao TEXT,
      validade_token DATETIME,
      data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
      descricao TEXT,
      localizacao TEXT DEFAULT 'não definido',
      visibility TEXT DEFAULT 'public',
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
      language TEXT DEFAULT 'pt-br',
      datetime_format TEXT DEFAULT '24h',
      timezone TEXT DEFAULT '-3'
    )
  `);

  // Produtos
  db.exec(`
    CREATE TABLE IF NOT EXISTS produtos (
      id_produto INTEGER PRIMARY KEY AUTOINCREMENT,
      id_fornecedor INTEGER NOT NULL,
      nome_produto TEXT NOT NULL,
      descricao TEXT,
      preco DECIMAL(10,2) NOT NULL,
      disponivel BOOLEAN DEFAULT 1,
      categoria TEXT,
      FOREIGN KEY (id_fornecedor) REFERENCES fornecedores(id_fornecedor) ON DELETE CASCADE
    )
  `);

  console.log('✅ Tabelas SQLite criadas com sucesso!');
  console.log(`📁 Banco de dados: ${dbPath}`);
};

// Inicializar banco
createTables();

export default db;
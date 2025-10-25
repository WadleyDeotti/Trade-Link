// repository.js
import mysql from 'mysql2/promise';
import { Empresa } from './models/empresaModel.js';
import { Fornecedor } from './models/fornecedorModel.js';
import { Produto } from './models/produtoModel.js';
// 🧩 Cria a conexão (ou pool)
const conexao = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "zasx",
  database: "pit",
  namedPlaceholders: true
});

// ✅ Teste de conexão
(async () => {
  try {
    const conn = await conexao.getConnection();
    console.log("Conectado ao banco de dados com sucesso!");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();

// ---------------- Funções ----------------
export async function testeUsuario() {
  const [rows] = await conexao.query("SELECT * FROM fornecedores WHERE id_fornecedor = 5");
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

export async function getProdutos() {
  const [rows] = await conexao.execute(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f USING(id_fornecedor)
  `);
  return rows.length > 0 ? new Produto(rows[0]) : null;
}

export async function getFornecedor() {
  const [rows] = await conexao.execute("SELECT * FROM fornecedores");
  return rows.map(row => new Fornecedor(row));
}

export async function buscarCNPJ(cnpj) {
  const [rows] = await conexao.execute(
    "SELECT * FROM empresas WHERE cnpj = ?",
    [cnpj]
  );
  return rows.length > 0 ? new Empresa(rows[0]) : null;
}

export async function buscarCPF(cpf) {
  const [rows] = await conexao.execute(
    "SELECT * FROM fornecedores WHERE cpf = ?",
    [cpf]
  );
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

// Atualizações
export async function updateEmpresa(dados) {
  const sql = `
    UPDATE empresas SET
      visibility = ?, data_sharing = ?, show_activity = ?, search_visibility = ?,
      notify_messages = ?, notify_mentions = ?, notify_updates = ?, notify_comments = ?,
      important_only = ?, email_notifications = ?, push_notifications = ?, language = ?,
      datetime_format = ?, timezone = ?
    WHERE id_empresa = ?
  `;
  const values = [
    dados.visibility, dados.data_sharing, dados.show_activity, dados.search_visibility,
    dados.notify_messages, dados.notify_mentions, dados.notify_updates, dados.notify_comments,
    dados.important_only, dados.email_notifications, dados.push_notifications,
    dados.language, dados.datetime_format, dados.timezone, dados.id_empresa
  ];
  const [resultado] = await conexao.execute(sql, values);
  return resultado;
}

export async function updateFornecedor(dados) {
  const sql = `
    UPDATE fornecedores SET
      visibility = ?, data_sharing = ?, show_activity = ?, search_visibility = ?,
      notify_messages = ?, notify_mentions = ?, notify_updates = ?, notify_comments = ?,
      important_only = ?, email_notifications = ?, push_notifications = ?, language = ?,
      datetime_format = ?, timezone = ?
    WHERE id_fornecedor = ?
  `;
  const values = [
    dados.visibility, dados.data_sharing, dados.show_activity, dados.search_visibility,
    dados.notify_messages, dados.notify_mentions, dados.notify_updates, dados.notify_comments,
    dados.important_only, dados.email_notifications, dados.push_notifications,
    dados.language, dados.datetime_format, dados.timezone, dados.id_fornecedor
  ];
  const [resultado] = await conexao.execute(sql, values);
  return resultado;
}

// Atualizar senha
export async function updateSenhaEmpresa({ senha_hash, id_empresa }) {
  const sql = "UPDATE empresas SET senha_hash = ? WHERE id_empresa = ?";
  const [resultado] = await conexao.execute(sql, [senha_hash, id_empresa]);
  return resultado;
}

export async function updateSenhaFornecedor({ senha_hash, id_fornecedor }) {
  const sql = "UPDATE fornecedores SET senha_hash = ? WHERE id_fornecedor = ?";
  const [resultado] = await conexao.execute(sql, [senha_hash, id_fornecedor]);
  return resultado;
}

// Buscar senha
export async function buscarSenhaEmpresa(id_empresa) {
  const sql = "SELECT senha_hash FROM empresas WHERE id_empresa = ?";
  const [rows] = await conexao.execute(sql, [id_empresa]);
  return rows.length > 0 ? rows[0].senha_hash : null;
}

export async function buscarSenhaFornecedor(id_fornecedor) {
  const sql = "SELECT senha_hash FROM fornecedores WHERE id_fornecedor = ?";
  const [rows] = await conexao.execute(sql, [id_fornecedor]);
  return rows.length > 0 ? rows[0].senha_hash : null;
}

// Buscar por ID
export async function buscarEmpresaPorId(id_empresa) {
  const sql = "SELECT * FROM empresas WHERE id_empresa = ?";
  const [rows] = await conexao.execute(sql, [id_empresa]);
  return rows.length > 0 ? new Empresa(rows[0]) : null;
}

export async function buscarFornecedorPorId(id_fornecedor) {
  const sql = "SELECT * FROM fornecedores WHERE id_fornecedor = ?";
  const [rows] = await conexao.execute(sql, [id_fornecedor]);
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

// Inserções
export async function inserirEmpresa({ nome_fantasia, cnpj, email, senha_hash }) {
  const sql = "INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash) VALUES (?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, cnpj, email, senha_hash]);
  return resultado;
}

export async function inserirFornecedor({ nome_fantasia, cpf, email, senha_hash }) {
  const sql = "INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash) VALUES (?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, cpf, email, senha_hash]);
  return resultado;
}

// Atualizar dados gerais
export async function atualizarFornecedor({ id_fornecedor, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE fornecedores SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_fornecedor = ?";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_fornecedor]);
  return resultado;
}

export async function atualizarEmpresa({ id_empresa, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE empresas SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_empresa = ?";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_empresa]);
  return resultado;
}

// Cadastrar produto
export async function cadastrarProduto({ id_fornecedor, nome_produto, descricao, preco, categoria }) {
  const sql = "INSERT INTO produtos (id_fornecedor, nome_produto, descricao, preco, categoria) VALUES (?,?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [id_fornecedor, nome_produto, descricao, preco, categoria]);
  return resultado;
}
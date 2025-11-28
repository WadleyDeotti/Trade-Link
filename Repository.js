//DOTENV
import dotenv from 'dotenv';
dotenv.config();

// repository.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Empresa } from './models/empresaModel.js';
import { Fornecedor } from './models/fornecedorModel.js';
import { Produto } from './models/produtoModel.js';

// 🧩 Cria a conexão SQLite
const conexao = await open({
  filename: './database.db',
  driver: sqlite3.Database
});

// ✅ Teste de conexão
(async () => {
  try {
    await conexao.get("SELECT 1");
    console.log("Conectado ao banco SQLite com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();

// ---------------- Funções ----------------
export async function testeUsuario() {
  const rows = await conexao.all("SELECT * FROM fornecedores WHERE id_fornecedor = 5");
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

export async function getProdutos() {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
  `);
  return rows.map(row => new Produto(row));
}

export async function getProdutosPorCategoria(categoria) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE p.categoria = ?
  `, [categoria]);
  return rows.map(row => new Produto(row));
}

export async function getCategorias() {
  const rows = await conexao.all(`
    SELECT DISTINCT categoria
    FROM produtos
    WHERE categoria IS NOT NULL
    ORDER BY categoria
  `);
  return rows.map(row => row.categoria);
}

export async function buscarProdutos(termo, categoria, precoMin, precoMax) {
  let sql = `
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE 1=1
  `;
  const params = [];

  if (termo) {
    sql += ` AND (p.nome_produto LIKE ? OR p.descricao LIKE ?)`;
    params.push(`%${termo}%`, `%${termo}%`);
  }

  if (categoria) {
    sql += ` AND p.categoria = ?`;
    params.push(categoria);
  }

  if (precoMin) {
    sql += ` AND p.preco >= ?`;
    params.push(precoMin);
  }

  if (precoMax) {
    sql += ` AND p.preco <= ?`;
    params.push(precoMax);
  }

  sql += ` ORDER BY p.nome_produto`;

  const rows = await conexao.all(sql, params);
  return rows.map(row => new Produto(row));
}

export async function buscarProdutoPorId(id_produto) {
  const row = await conexao.get(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia, f.telefone, f.email
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE p.id_produto = ?
  `, [id_produto]);
  return row ? new Produto(row) : null;
}

export async function buscarProdutosRelacionados(categoria, id_produto_atual) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.nome_produto, p.preco, p.categoria
    FROM produtos p
    WHERE p.categoria = ? AND p.id_produto != ? AND p.disponivel = 1
    ORDER BY RANDOM()
    LIMIT 3
  `, [categoria, id_produto_atual]);
  return rows.map(row => new Produto(row));
}

export async function buscarProdutosPorFornecedor(id_fornecedor) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria
    FROM produtos p
    WHERE p.id_fornecedor = ?
    ORDER BY p.nome_produto
  `, [id_fornecedor]);
  return rows.map(row => new Produto(row));
}

export async function getFornecedor() {
  const rows = await conexao.all("SELECT * FROM fornecedores");
  return rows.map(row => new Fornecedor(row));
}

export async function buscarCNPJ(cnpj) {
  const row = await conexao.get(
    "SELECT * FROM empresas WHERE cnpj = ?",
    [cnpj]
  );
  return row ? new Empresa(row) : null;
}

export async function buscarCPF(cpf) {
  const row = await conexao.get(
    "SELECT * FROM fornecedores WHERE cpf = ?",
    [cpf]
  );
  return row ? new Fornecedor(row) : null;
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
  const resultado = await conexao.run(sql, values);
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
  const resultado = await conexao.run(sql, values);
  return resultado;
}

// Atualizar senha
export async function updateSenhaEmpresa({ senha_hash, id_empresa }) {
  const sql = "UPDATE empresas SET senha_hash = ? WHERE id_empresa = ?";
  const resultado = await conexao.run(sql, [senha_hash, id_empresa]);
  return resultado;
}

export async function updateSenhaFornecedor({ senha_hash, id_fornecedor }) {
  const sql = "UPDATE fornecedores SET senha_hash = ? WHERE id_fornecedor = ?";
  const resultado = await conexao.run(sql, [senha_hash, id_fornecedor]);
  return resultado;
}

// Buscar senha
export async function buscarSenhaEmpresa(id_empresa) {
  const sql = "SELECT senha_hash FROM empresas WHERE id_empresa = ?";
  const row = await conexao.get(sql, [id_empresa]);
  return row ? row.senha_hash : null;
}

export async function buscarSenhaFornecedor(id_fornecedor) {
  const sql = "SELECT senha_hash FROM fornecedores WHERE id_fornecedor = ?";
  const row = await conexao.get(sql, [id_fornecedor]);
  return row ? row.senha_hash : null;
}

// Buscar por ID
export async function buscarEmpresaPorId(id_empresa) {
  const sql = "SELECT * FROM empresas WHERE id_empresa = ?";
  const row = await conexao.get(sql, [id_empresa]);
  return row ? new Empresa(row) : null;
}

export async function buscarFornecedorPorId(id_fornecedor) {
  const sql = "SELECT * FROM fornecedores WHERE id_fornecedor = ?";
  const row = await conexao.get(sql, [id_fornecedor]);
  return row ? new Fornecedor(row) : null;
}

// Inserções
export async function inserirEmpresa({ nome_fantasia, cnpj, email, senha_hash }) {
  const sql = "INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash) VALUES (?,?,?,?)";
  const resultado = await conexao.run(sql, [nome_fantasia, cnpj, email, senha_hash]);
  return resultado;
}

export async function inserirFornecedor({ nome_fantasia, cpf, email, senha_hash }) {
  const sql = "INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash) VALUES (?,?,?,?)";
  const resultado = await conexao.run(sql, [nome_fantasia, cpf, email, senha_hash]);
  return resultado;
}

// Atualizar dados gerais
export async function atualizarFornecedor({ id_fornecedor, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE fornecedores SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_fornecedor = ?";
  const resultado = await conexao.run(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_fornecedor]);
  return resultado;
}

export async function atualizarEmpresa({ id_empresa, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE empresas SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_empresa = ?";
  const resultado = await conexao.run(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_empresa]);
  return resultado;
}
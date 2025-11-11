//DOTENV
import dotenv from 'dotenv';
dotenv.config();

// repository.js
import mysql from 'mysql2/promise';
import { Empresa } from './models/empresaModel.js';
import { Fornecedor } from './models/fornecedorModel.js';
import { Produto } from './models/produtoModel.js';


// 🧩 Cria a conexão (ou pool)
const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
  return rows.map(row => new Produto(row));
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

// ========== CONVERSAS ==========

export async function buscarOuCriarConversa(usuario1, usuario2, tipo1, tipo2) {
    const sql = `
        SELECT * FROM conversas 
        WHERE (usuario1_id = ? AND usuario2_id = ?)
        OR (usuario1_id = ? AND usuario2_id = ?)
    `;

    const [rows] = await this.pool.query(sql, [
        usuario1, usuario2,
        usuario2, usuario1
    ]);

    if (rows.length > 0) return rows[0];

    const insert = `
        INSERT INTO conversas (usuario1_id, usuario2_id, tipo1, tipo2)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await this.pool.query(insert, [
        usuario1, usuario2,
        tipo1, tipo2
    ]);

    return {
        id_conversa: result.insertId,
        usuario1_id: usuario1,
        usuario2_id: usuario2,
        tipo1,
        tipo2
    };
}

export async function listarConversasDoUsuario(id_usuario) {
    const sql = `
        SELECT c.*,
            (SELECT conteudo FROM mensagens 
              WHERE id_conversa = c.id_conversa 
              ORDER BY id_mensagem DESC LIMIT 1) AS ultima_msg,

            (SELECT COUNT(*) FROM mensagens 
              WHERE id_conversa = c.id_conversa 
              AND lida = 0
              AND remetente_id != ?) AS nao_lidas

        FROM conversas c
        WHERE c.usuario1_id = ? OR c.usuario2_id = ?
    `;

    const [rows] = await this.pool.query(sql, [
        id_usuario,
        id_usuario,
        id_usuario
    ]);

    return rows;
}

// ========== MENSAGENS ==========

export async function salvarMensagem(id_conversa, remetente_id, tipo_remetente, conteudo) {
    const sql = `
        INSERT INTO mensagens (id_conversa, remetente_id, tipo_remetente, conteudo)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await this.pool.query(sql, [
        id_conversa,
        remetente_id,
        tipo_remetente,
        conteudo
    ]);

    return result.insertId;
}

export async function listarMensagens(id_conversa) {
    const sql = `
        SELECT *
        FROM mensagens
        WHERE id_conversa = ?
        ORDER BY enviado_em ASC
    `;

    const [rows] = await this.pool.query(sql, [id_conversa]);
    return rows;
}

export async function marcarLidas(id_conversa, usuario_id) {
    const sql = `
        UPDATE mensagens
        SET lida = 1
        WHERE id_conversa = ?
          AND remetente_id != ?
    `;

    await this.pool.query(sql, [id_conversa, usuario_id]);
}
const mysql = require('mysql2/promise');
const Empresa = require('../models/empresaModel');
const Fornecedor = require('../models/fornecedorModel');
const Produto = require('../models/produtoModel');


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

module.exports = {
  // 🔹 pegar um usuario pra teste
  async testeUsuario() {
    const [rows] = await conexao.query("SELECT * FROM empresas WHERE id_empresa = 2");
    return rows.length > 0 ? new Empresa(rows[0]) : null;
  },

  // 🔹 Buscar produtos
  async getProdutos() {
    const [rows] = await conexao.execute("SELECT * FROM produtos");
    return rows.length>0? new Produto(rows) : null;
  },
  async getFornecedor() {
    const [rows] = await conexao.execute("SELECT * FROM fornecedores");
    return rows.length>0? new Fornecedor(rows) : null;
  },

  // 🔹 Buscar empresa por CNPJ
  async buscarCNPJ(cnpj) {
    const [linhas] = await conexao.execute(
      "SELECT cnpj, senha_hash, email FROM empresas WHERE cnpj = :cnpj",
      { cnpj }
    );
    return linhas.map(row => new Empresa(row));
  },

  // 🔹 Buscar fornecedor por CPF
  async buscarCPF(cpf) {
    const [linhas] = await conexao.execute(
      "SELECT cpf, senha_hash, email FROM fornecedores WHERE cpf = :cpf",
      { cpf }
    );
    return linhas.map(row => new Fornecedor(row));
  },

  // 🔹 Atualizar dados da empresa
  async updateEmpresa(dados) {
    const sql = `
    UPDATE empresas SET
      visibility = ?,
      data_sharing = ?,
      show_activity = ?,
      search_visibility = ?,
      notify_messages = ?,
      notify_mentions = ?,
      notify_updates = ?,
      notify_comments = ?,
      important_only = ?,
      email_notifications = ?,
      push_notifications = ?,
      language = ?,
      datetime_format = ?,
      timezone = ?
    WHERE id_empresa = ?
  `;

    const values = [
      dados.visibility,
      dados.data_sharing,
      dados.show_activity,
      dados.search_visibility,
      dados.notify_messages,
      dados.notify_mentions,
      dados.notify_updates,
      dados.notify_comments,
      dados.important_only,
      dados.email_notifications,
      dados.push_notifications,
      dados.language,
      dados.datetime_format,
      dados.timezone,
      dados.id_empresa
    ];

    console.log('📦 Dados recebidos no repository:', dados);

    const [resultado] = await conexao.execute(sql, values);
    console.log('🧾 Resultado do UPDATE:', resultado);

    return resultado;
  },

  // 🔹 Atualizar dados do fornecedor
  async updateFornecedor(dados) {
    const sql = `
    UPDATE fornecedores SET
      visibility = ?,
      data_sharing = ?,
      show_activity = ?,
      search_visibility = ?,
      notify_messages = ?,
      notify_mentions = ?,
      notify_updates = ?,
      notify_comments = ?,
      important_only = ?,
      email_notifications = ?,
      push_notifications = ?,
      language = ?,
      datetime_format = ?,
      timezone = ?
    WHERE id_fornecedor = ?
  `;

    const values = [
      dados.visibility,
      dados.data_sharing,
      dados.show_activity,
      dados.search_visibility,
      dados.notify_messages,
      dados.notify_mentions,
      dados.notify_updates,
      dados.notify_comments,
      dados.important_only,
      dados.email_notifications,
      dados.push_notifications,
      dados.language,
      dados.datetime_format,
      dados.timezone,
      dados.id_empresa
    ];

    console.log('📦 Dados recebidos no repository:', dados);

    const [resultado] = await conexao.execute(sql, values);
    console.log('🧾 Resultado do UPDATE:', resultado);

    return resultado;

  },

  // 🔹 Atualizar senha Empresa
  async updateSenhaEmpresa(dados) {
    const sql = "UPDATE empresas SET senha_hash = :senha_hash WHERE id_empresa = :id_empresa";
    const valores = [dados.senha_hash, dados.id_empresa];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  // 🔹 Atualizar senha Fornecedor
  async updateSenhaFornecedor(dados) {
    const sql = "UPDATE fornecedores SET senha_hash = :senha_hash WHERE id_fornecedor = :id_fornecedor";
    console.log('Tipo senha_hash:', typeof dados.senha_hash);
    console.log('Tipo id_fornecedor:', typeof dados.id_fornecedor);
    try {
      const [resultado] = await conexao.execute(sql, dados);
      console.log('✅ Atualização OK:', resultado);
      return resultado;
    } catch (erro) {
      console.error('❌ Erro MySQL2:', erro.message);
      throw erro;
    }
  },

  // 🔹 buscar senha da empresa
  async buscarSenhaEmpresa(id_empresa) {
    const sql = "SELECT senha_hash FROM empresas WHERE id_empresa = ?";
    const [rows] = await conexao.execute(sql, [id_empresa]);
    return rows.length > 0 ? new Empresa(rows[0]) : null;
  },

  // 🔹 buscar senha do fornecedor
  async buscarSenhaFornecedor(id_fornecedor) {
    const sql = "SELECT senha_hash FROM fornecedores WHERE id_fornecedor = ?";
    const [rows] = await conexao.execute(sql, [id_fornecedor]);
    return rows.length > 0 ? rows[0].senha_hash : null;
  },

  //buscar empresa por id
  async buscarEmpresaPorId(id_empresa) {
    const sql = "SELECT * FROM empresas WHERE id_empresa = ?";
    const [rows] = await conexao.execute(sql, [id_empresa]);
    return rows.length > 0 ? new Empresa(rows[0]) : null;
  },

  //buscar fornecedor por id
  async buscarFornecedorPorId(id_fornecedor) {
    const sql = "SELECT * FROM fornecedores WHERE id_fornecedor = ?";
    const [rows] = await conexao.execute(sql, [id_fornecedor]);
    return rows.length > 0 ? new Fornecedor(rows[0]) : null;
  },

  // 🔹 Inserir nova empresa
  async inserirEmpresa(empresa) {

    const sql = `
      INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash) 
      VALUES (?,?,?,?)
 `;
    const valores = [empresa.nome_fantasia, empresa.cnpj, empresa.email, empresa.senha_hash];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },
  async inserirFornecedor(fornecedor) {
    const sql = `
      INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash)
      VALUES (?,?,?,?)
    `;
    const valores = [fornecedor.nome_fantasia, fornecedor.cpf, fornecedor.email, fornecedor.senha_hash];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  buscarCNPJ: async (cnpj) => {
    const sql = "SELECT * FROM empresas WHERE cnpj = ?";
    const [rows] = await conexao.execute(sql, [cnpj]);
    return rows.length > 0 ? new Empresa(rows[0]) : null;
  },

  buscarCPF: async (cpf) => {
    const sql = "SELECT * FROM fornecedores WHERE cpf = ?";
    const [rows] = await conexao.execute(sql, [cpf]);
    return rows.length > 0 ? new Fornecedor(rows[0]) : null;
  },

  salvarTokenE: async ({ token_redefinicao, expira_token, cnpj }) => {
    const sql = "UPDATE empresas SET token_redefinicao = ?, expira_token = ? WHERE cnpj = ?";
    const valores = [token_redefinicao, expira_token, cnpj];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  salvarTokenF: async ({ token_redefinicao, expira_token, cpf }) => {
    const sql = "UPDATE fornecedores SET token_redefinicao = ?, expira_token = ? WHERE cpf = ?";
    const valores = [token_redefinicao, expira_token, cpf];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  buscarPorTokenE: async (token) => {
    const sql = "SELECT * FROM empresas WHERE token_redefinicao = ?";
    const [rows] = await conexao.execute(sql, [token]);
    return rows.length > 0 ? new Empresa(rows[0]) : null;
  },

  buscarPorTokenF: async (token) => {
    const sql = "SELECT * FROM fornecedores WHERE token_redefinicao = ?";
    const [rows] = await conexao.execute(sql, [token]);
    return rows.length > 0 ? new Fornecedor(rows[0]) : null;
  }


};

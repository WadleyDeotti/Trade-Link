// repository/usuarioRepository.js
const mysql = require('mysql2/promise');
const Empresa = require('../models/empresaModel');
const Fornecedor = require('../models/fornecedorModel');

// 🧩 Cria a conexão (ou pool)
const conexao = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "zasx",
  database: "pit",
  namedPlaceholders: true
});

// ✅ Teste de conexão (opcional)
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
  // 🔹 Exemplo: buscar uma empresa de teste
  async testeUsuario() {
    const [linhas] = await conexao.query("SELECT * FROM empresas WHERE id_empresa = 1");
    return linhas.map(row => new Empresa(row));
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
      nome_fantasia = ?,
      email = ?,
      localizacao = ?,
      telefone = ?,
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
    dados.nome_fantasia,
    dados.email,
    dados.localizacao,
    dados.telefone,
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

  buscarCNPJ: async (cnpj) => {
    const sql = "SELECT cnpj, senha_hash, email FROM empresas WHERE cnpj = ?";
    const [rows] = await conexao.execute(sql, [cnpj]);
    return rows.map(row => new Empresa(row));
  },

  buscarCPF: async (cpf) => {
    const sql = "SELECT cpf, senha_hash, email FROM fornecedores WHERE cpf = ?";
    const [rows] = await conexao.execute(sql, [cpf]);
    return rows.map(row => new Fornecedor(row));
  },

  inserirEmpresa: async (empresa) => {
    const sql = "INSERT INTO empresas(nome_fantasia, cnpj, email, senha_hash) VALUES (?, ?, ?, ?)";
    const valores = [empresa.nome_fantasia, empresa.cnpj, empresa.email, empresa.senha];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  inserirFornecedor: async (fornecedor) => {
    const sql = "INSERT INTO fornecedores(nome_fantasia, cpf, email, senha_hash) VALUES (?, ?, ?, ?)";
    const valores = [fornecedor.nome_fantasia, fornecedor.cpf, fornecedor.email, fornecedor.senha];
    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
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
    return rows.length > 0 ? rows[0] : null;
  },

  buscarPorTokenF: async (token) => {
    const sql = "SELECT * FROM fornecedores WHERE token_redefinicao = ?";
    const [rows] = await conexao.execute(sql, [token]);
    return rows.length > 0 ? rows[0] : null;
  }


};

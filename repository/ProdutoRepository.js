const mysql = require('mysql2/promise');
const Produto = require('../models/produtoModel');


const conexao = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "zasx",
  database: "pit",
  namedPlaceholders: true
});

module.exports = {
      async inserirProduto(produto) {
      const sql = `
      INSERT INTO produtos (
        nome_produto,
        preco,
        descricao,
        disponivel
      ) VALUES (?, ?, ?, ?)
    `;

    const valores = [
      produto.nome_produto,
      produto.preco,
      produto.descricao,
      produto.disponivel
    ];

    const [resultado] = await conexao.execute(sql, valores);
    return resultado;
  },

  async updateProdutos(dados) {
    const sql = `
    UPDATE produtos SET
    nome_produto = ?,
    preco = ?,
    descricao = ?,
    disponivel = ?
    WHERE id_produto = ?
    `;

    const values = [
    dados.nome_produto,
    dados.preco,
    dados.descricao,
    dados.disponivel,
    dados.id_produto
    ];

    console.log('📦 Dados recebidos no repository:', dados);

    const [resultado] = await conexao.execute(sql, values);
    console.log('🧾 Resultado do UPDATE:', resultado);

    return resultado;

  },

  async deleteProduto(id_produto) {
    const sql = `
      DELETE FROM produtos
      WHERE id_produto = ?
    `;

    const values = [id_produto];

    console.log('🗑️ ID recebido para exclusão:', id_produto);

    const [resultado] = await conexao.execute(sql, values);
    console.log('🧾 Resultado do DELETE:', resultado);

    return resultado;
  }







}

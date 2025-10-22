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
      nome,
      preco
    ) VALUES (?, ?)
  `;

  const valores = [
    produto.nome,
    produto.preco
  ];

  const [resultado] = await conexao.execute(sql, valores);
  return resultado;
}

}

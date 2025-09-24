const { ExportSourceType } = require('@aws-sdk/client-sesv2');
const fornecedor = require ('../repository/usuarioRepository');
const bcrypt = require ('bcrypt')

exports.produtos = (req, res) => {
  const { nome, marca, categoria, formato, peso, preco, altura, largura, comprimento } = req.body;

  const sql = `
    INSERT INTO produtos 
    (nome, marca, categoria, formato, peso, preco, altura, largura, comprimento) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nome, marca, categoria, formato, peso, preco, altura, largura, comprimento], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar produto:", err);
      res.status(500).json({ erro: "Erro ao cadastrar produto" });
    } else {
      res.status(201).json({ mensagem: "Produto cadastrado com sucesso!", id: result.insertId });
    }
  });
};



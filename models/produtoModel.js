// models/produtoModel.js

export class Produto {
  constructor(
    id_produto,
    id_fornecedor,
    nome_produto,
    descricao,
    preco,
    disponivel = true,
    nome_fantasia,
  ) {
    this.id_produto = id_produto;
    this.id_fornecedor = id_fornecedor;
    this.nome_produto = nome_produto;
    this.descricao = descricao;
    this.preco = preco;
    this.disponivel = disponivel;
    this.nome_fantasia = nome_fantasia;
  }
}

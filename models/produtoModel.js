class Produto {
  constructor({ 
    id_produto = null, 
    id_fornecedor = null, 
    nome_produto, 
    descricao, 
    preco, 
    disponivel
  }) {
    this.id_produto = id_produto;
    this.id_fornecedor = id_fornecedor;
    this.nome_produto = nome_produto;
    this.descricao = descricao;
    this.preco = preco;
    this.disponivel = disponivel;
  }
}

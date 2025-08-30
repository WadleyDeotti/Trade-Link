class Produtos {
    constructor({ 
    id_produto = null, 
    nome, 
    formato, 
    categoria, 
    marca, 
    peso,
    preco, 
    altura, 
    largura,
    comprimento
    }){
    this.id_produto = id_produto;
    this.nome = nome;
    this.formato = formato;
    this.categoria = categoria;
    this.marca = marca;
    this.peso = peso;
    this.preco = preco;
    this.altura = altura;
    this.largura = largura;
    this.comprimento = comprimento;
  }

}
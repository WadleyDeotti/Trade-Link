class Fornecedor {
  constructor({ 
    id_fornecedor = null, 
    nome_fantasia, 
    razao_social, 
    cnpj, 
    email, 
    senha,
    telefone = null, 
    endereco = null, 
    data_cadastro = null 
  }) {
    this.id_fornecedor = id_fornecedor;
    this.nome_fantasia = nome_fantasia;
    this.razao_social = razao_social;
    this.cnpj = cnpj;
    this.email = email;
    this.senha = senha;
    this.telefone = telefone;
    this.endereco = endereco;
    this.data_cadastro = data_cadastro;
  }
}

module.exports = Fornecedor;
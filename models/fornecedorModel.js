class Empresa {
  constructor({ 
    id_fornecedor = null, 
    nome_fantasia, 
    razao_social, 
    cnpj, 
    email, 
    telefone = null, 
    endereco = null, 
    data_cadastro = null 
  }) {
    this.id_fornecedor = id_fornecedor;
    this.nome_fantasia = nome_fantasia;
    this.razao_social = razao_social;
    this.cnpj = cnpj;
    this.email = email;
    this.telefone = telefone;
    this.endereco = endereco;
    this.data_cadastro = data_cadastro;
  }
}

module.exports = Fornecedor;
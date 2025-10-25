class Fornecedor {
  constructor({ 
    id_fornecedor = null, 
    nome_fantasia, 
    razao_social, 
    cpf, 
    email, 
    senha_hash,
    telefone = null, 
    endereco = null, 
    data_cadastro = null 
  }) {
    this.id_fornecedor = id_fornecedor;
    this.nome_fantasia = nome_fantasia;
    this.razao_social = razao_social;
    this.cpf = cpf;
    this.email = email;
    this.senha_hash = senha_hash;
    this.telefone = telefone;
    this.endereco = endereco;
    this.email_verificado = email_verificado;
    this.token_validacao = token_validacao;
    this.validade_token = validade_token;
    this.data_cadastro = data_cadastro;
  }
}

module.exports = Fornecedor;
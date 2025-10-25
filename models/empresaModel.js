class Empresa {
  constructor({ 
    id_empresa = null, 
    nome_fantasia, 
    razao_social = null, 
    cnpj, 
    email, 
    senha_hash,
    telefone = null, 
    endereco = null, 
    data_cadastro = null 
  }) {
    this.id_empresa = id_empresa;
    this.nome_fantasia = nome_fantasia;
    this.razao_social = razao_social;
    this.cnpj = cnpj;
    this.email = email;
    this.senha_hash = senha_hash;
    this.telefone = telefone;
    this.endereco = endereco;
    this.data_cadastro = data_cadastro;
  }
}

module.exports = Empresa;
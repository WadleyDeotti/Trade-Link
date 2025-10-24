class Fornecedor {
  constructor({
    id_fornecedor = null,
    nome_fantasia,
    razao_social = null,
    cpf,
    email,
    senha_hash,
    telefone = null,
    endereco = null,
    email_verificado = false,
    token_validacao = null,
    validade_token = null,
    data_cadastro = null,

    // 🧩 Campos de configurações
    localizacao = 'não definido',
    visibility = 'public',
    data_sharing = false,
    show_activity = false,
    search_visibility = false,
    notify_messages = false,
    notify_mentions = false,
    notify_updates = false,
    notify_comments = false,
    important_only = false,
    email_notifications = false,
    push_notifications = false,
    language = 'pt-br',
    datetime_format = '24h',
    timezone = '-3'
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

    // Configurações
    this.localizacao = localizacao;
    this.visibility = visibility;
    this.data_sharing = data_sharing;
    this.show_activity = show_activity;
    this.search_visibility = search_visibility;
    this.notify_messages = notify_messages;
    this.notify_mentions = notify_mentions;
    this.notify_updates = notify_updates;
    this.notify_comments = notify_comments;
    this.important_only = important_only;
    this.email_notifications = email_notifications;
    this.push_notifications = push_notifications;
    this.language = language;
  }
}

module.exports = Fornecedor;


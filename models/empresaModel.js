class Empresa {
  constructor({ 
    id_empresa = null, 
    nome_fantasia, 
    razao_social, 
    cnpj, 
    email, 
    senha_hash,
    telefone = null, 
    endereco = null, 
    data_cadastro = null,
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
    this.id_empresa = id_empresa;
    this.nome_fantasia = nome_fantasia;
    this.razao_social = razao_social;
    this.cnpj = cnpj;
    this.email = email;
    this.senha_hash = senha_hash;
    this.telefone = telefone;
    this.endereco = endereco;
    this.data_cadastro = data_cadastro;
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
    this.datetime_format = datetime_format;
    this.timezone = timezone;
  }
}

// Agora sim, exporta a classe
module.exports = Empresa;
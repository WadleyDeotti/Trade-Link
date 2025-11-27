import * as repository from "../Repository.js";

const safeBool = val => val === 'on' ? 1 : 0;

// atualizar dados salvos na sessão
async function atualizarSessaoUsuario(req) {
  const usuario = req.session.usuario;
  if (!usuario) throw new Error('Usuário não está logado');

  const tipo = usuario.id_empresa ? 'empresa' : 'fornecedor';
  const id = tipo === 'empresa' ? usuario.id_empresa : usuario.id_fornecedor;

  let novoUsuario;
  if (tipo === 'empresa') {
    novoUsuario = await repository.buscarEmpresaPorId(id);
  } else {
    novoUsuario = await repository.buscarFornecedorPorId(id);
  }

  req.session.usuario = novoUsuario;
  return req.session.usuario;
}

export const salvarConfiguracoes = async (req, res) => {
  const usuario = req.session.usuario;
  if (!usuario) return res.status(401).send('Usuário não logado');

  const {
    visibility = 'public',
    data_sharing = 'off',
    show_activity = 'off',
    search_visibility = 'off',
    notify_messages = 'off',
    notify_mentions = 'off',
    notify_updates = 'off',
    notify_comments = 'off',
    important_only = 'off',
    email_notifications = 'off',
    push_notifications = 'off',
    language = 'pt-br',
    datetime_format = '24h',
    timezone = '-3',
  } = req.body;

  const safe = val => (val === undefined || val === '' ? null : val);

  try {
    if (usuario.id_empresa) {
      await repository.updateEmpresa({
        visibility,
        data_sharing: safe(safeBool(data_sharing)),
        show_activity: safe(safeBool(show_activity)),
        search_visibility: safe(safeBool(search_visibility)),
        notify_messages: safe(safeBool(notify_messages)),
        notify_mentions: safe(safeBool(notify_mentions)),
        notify_updates: safe(safeBool(notify_updates)),
        notify_comments: safe(safeBool(notify_comments)),
        important_only: safe(safeBool(important_only)),
        email_notifications: safe(safeBool(email_notifications)),
        push_notifications: safe(safeBool(push_notifications)),
        language,
        datetime_format,
        timezone,
        id_empresa: usuario.id_empresa
      });
    } else if (usuario.id_fornecedor) {
      await repository.updateFornecedor({
        visibility,
        data_sharing: safe(safeBool(data_sharing)),
        show_activity: safe(safeBool(show_activity)),
        search_visibility: safe(safeBool(search_visibility)),
        notify_messages: safe(safeBool(notify_messages)),
        notify_mentions: safe(safeBool(notify_mentions)),
        notify_updates: safe(safeBool(notify_updates)),
        notify_comments: safe(safeBool(notify_comments)),
        important_only: safe(safeBool(important_only)),
        email_notifications: safe(safeBool(email_notifications)),
        push_notifications: safe(safeBool(push_notifications)),
        language,
        datetime_format,
        timezone,
        id_fornecedor: usuario.id_fornecedor
      });
    }

    await atualizarSessaoUsuario(req);
    res.redirect("/configuracoes");
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).send('Erro ao atualizar usuário');
  }
};
const repository = require('../Repository');
const bcrypt = require('bcrypt');
const safeBool = val => val === 'on' ? 1 : 0;

//atualizar dados salvos no server
async function atualizarSessaoUsuario(req) {
  const usuario = req.session.usuario;
  if (!usuario) throw new Error('Usuário não está logado');

  console.log(usuario);
  const tipo = usuario.id_empresa ? 'empresa' : 'fornecedor';
  const id = tipo === 'empresa' ? usuario.id_empresa : usuario.id_fornecedor;

  console.log(typeof id, id);
  console.log('Tipo de usuário:', tipo);

  let novoUsuario;
  if (tipo === 'empresa') {
    novoUsuario = await repository.buscarEmpresaPorId(id);
  } else {
    novoUsuario = await repository.buscarFornecedorPorId(id);
  }

  req.session.usuario = novoUsuario;
  console.log(req.session.usuario);
  return req.session.usuario;
}
 
exports.salvarConfiguracoes = async (req, res) => {

  // Verifica se há sessão
  const usuario = req.session.usuario;
  if (!usuario) {
    return res.status(401).send('Usuário não logado');
  }

  // Pega os dados enviados pelo formulário
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


  // Converte checkboxes ("on") em booleano (1/0)
  const safe = val => (val === undefined || val === '' ? null : val);

  if (usuario.id_empresa) {
    try {
      // Atualiza no banco usando repository com async/await
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

      // Atualiza os dados na sessão
      await atualizarSessaoUsuario(req);
      console.log('Usuário atualizado com sucesso');
      res.redirect("/configuracoes");

    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).send('Erro ao atualizar usuário');
    }
  } else if (usuario.id_fornecedor) {
    try {
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

      // Atualiza os dados na sessão
      await atualizarSessaoUsuario(req);
      console.log('Usuário atualizado com sucesso');
      res.redirect('/configuracoes');

    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).send('Erro ao atualizar usuário');
    }
  }

};

exports.alterarSenha = async (req, res) => {

  // Verifica se há sessão
  const usuario = req.session.usuario;
  const { current_password, new_password, confirm_password } = req.body;
  if (!current_password || !new_password || !confirm_password) {
    return res.redirect("configuracoes", { mensagem: "Preencha todos os campos", usuario: req.session.usuario });
  }

  if (!usuario) {
    return res.status(401).send('Usuário não logado');
  }
  if (usuario.id_empresa) {
    // Busca o hash salvo no banco
    const empresa = await repository.buscarSenhaEmpresa(usuario.id_empresa);

    // Confere se retornou algo
    if (!empresa) {
      return res.status(400).send("Usuário não encontrado.");
    }

    // Compara a senha atual com o hash
    const senhaCorreta = await bcrypt.compare(current_password, empresa.senha_hash);
    if (!senhaCorreta) {
      return res.redirect("configuracoes", { mensagem: "Senha atual incorreta", usuario: req.session.usuario });
    }

    // Verifica se as novas senhas coincidem
    if (new_password !== confirm_password) {
      return res.redirect("configuracoes", { mensagem: "As senhas não coincidem", usuario: req.session.usuario });
    }

    // Criptografa e atualiza
    const senhaHash = await bcrypt.hash(new_password, 10);
    await repository.updateSenhaEmpresa({ senha_hash: confirm_password, id_empresa: usuario.id_empresa });
    await atualizarSessaoUsuario(req);
    console.log('Senha alterada com sucesso');
    res.redirect("configuracoes", { mensagem: "Senha alterada com sucesso!", usuario: req.session.usuario });
  } else if (usuario.id_fornecedor) {
    const fornecedor = await repository.buscarSenhaFornecedor(usuario.id_fornecedor);
    console.log(current_password, fornecedor);
    const senhaCorreta = await bcrypt.compare(current_password, fornecedor);

    // Confere se retornou algo
    if (!fornecedor) {
      return res.status(400).send("Usuário não encontrado.");
    }

    // Compara a senha atual com o hash
    if (!senhaCorreta) {
      console.log('Senha atual incorreta');
      return res.redirect("configuracoes", { mensagem: "Senha atual incorreta", usuario: req.session.usuario });
    }

    // Verifica se as novas senhas coincidem
    if (new_password !== confirm_password) {
      console.log('As senhas não coincidem');
      return res.redirect("configuracoes", { mensagem: "As senhas não coincidem", usuario: req.session.usuario });
    }

    // Criptografa e atualiza
    const senhaHash = await bcrypt.hash(new_password, 10);
    await repository.updateSenhaFornecedor({ senha_hash: senhaHash, id_fornecedor: usuario.id_fornecedor });
    await atualizarSessaoUsuario(req);
    console.log('Senha alterada com sucesso');
    res.redirect("configuracoes", { mensagem: "Senha alterada com sucesso!", usuario: req.session.usuario });
  };
};





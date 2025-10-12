const repository = require('../repository/configuracoesRepository');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const safeBool = val => val === 'on' ? 1 : 0;

//atualizar dados salvos no server
async function atualizarSessaoUsuario(req) {
  const usuario = req.session.usuario[0];
  if (!usuario) throw new Error('Usuário não está logado');

  console.log(usuario);
  const tipo = usuario.id_empresa ? 'empresa' : 'fornecedor';
  const id = tipo==='empresa' ? usuario.id_empresa : usuario.id_fornecedor;

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
  const usuario = req.session.usuario[0];
  if (!usuario) {
    return res.status(401).send('Usuário não logado');
  }

  // Pega os dados enviados pelo formulário
  const {
    nome_fantasia = '',
    email = '',
    localizacao = '',
    telefone = '',
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
        nome_fantasia,
        email,
        localizacao,
        telefone,
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
      req.session.usuario = {
        ...usuario,
        nome_fantasia,
        email,
        localizacao,
        telefone,
        visibility,
        data_sharing: safeBool(data_sharing),
        show_activity: safeBool(show_activity),
        search_visibility: safeBool(search_visibility),
        notify_messages: safeBool(notify_messages),
        notify_mentions: safeBool(notify_mentions),
        notify_updates: safeBool(notify_updates),
        notify_comments: safeBool(notify_comments),
        important_only: safeBool(important_only),
        email_notifications: safeBool(email_notifications),
        push_notifications: safeBool(push_notifications),
        language,
        datetime_format,
        timezone
      };
      await atualizarSessaoUsuario(req);
      console.log('Usuário atualizado com sucesso');
      res.redirect("/configuracoes", (req, res) => res.redirect("configuracoes", { usuario: req.session.usuario[0] || null }));

    } catch (err) {
      console.error('Erro ao atualizar usuário:', err);
      res.status(500).send('Erro ao atualizar usuário');
    }
  } else if (usuario.id_fornecedor) {
    try {
      await repository.updateEmpresa({
        nome_fantasia,
        email,
        localizacao,
        telefone,
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
      req.session.usuario = {
        ...usuario,
        nome_fantasia,
        email,
        localizacao,
        telefone,
        visibility,
        data_sharing: safeBool(data_sharing),
        show_activity: safeBool(show_activity),
        search_visibility: safeBool(search_visibility),
        notify_messages: safeBool(notify_messages),
        notify_mentions: safeBool(notify_mentions),
        notify_updates: safeBool(notify_updates),
        notify_comments: safeBool(notify_comments),
        important_only: safeBool(important_only),
        email_notifications: safeBool(email_notifications),
        push_notifications: safeBool(push_notifications),
        language,
        datetime_format,
        timezone
      };
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
  const usuario = req.session.usuario[0];
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

exports.cadastrar = async (req, res) => {
  try {
    const dadosUsuario = req.body;
    console.log("Recebendo dados do cadastro:", dadosUsuario);

    if (dadosUsuario.cnpj) {
      // Cadastro de empresa
      await repository.inserirEmpresa({
        nome_fantasia: dadosUsuario.nome_completo,
        email: dadosUsuario.email,
        cnpj: dadosUsuario.cnpj.replace(/\D/g, ''),
        senha_hash: await bcrypt.hash(dadosUsuario.senha, 10)
      });

      req.session.usuario = repository.buscarCNPJ(dadosUsuario.cnpj.replace(/\D/g, ''));
      return res.redirect('/fornecedores');

    } else if (dadosUsuario.cpf) {
      // Cadastro de fornecedor
      await repository.inserirFornecedor({
        nome_fantasia: dadosUsuario.nome_completo,
        cpf: dadosUsuario.cpf.replace(/\D/g, ''),
        email: dadosUsuario.email,
        senha_hash: await bcrypt.hash(dadosUsuario.senha, 10)
      });

      req.session.usuario = repository.buscarCPF(dadosUsuario.cpf.replace(/\D/g, ''));
      return res.redirect('/fornecedores');

    } else {
      return res.status(400).send("Dados inválidos");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao cadastrar usuário");
  }
};

exports.logar = async (req, res) => {
  try {
    let { documento, senha } = req.body;
    documento = documento.replace(/\D/g, '');

    let user, tipo;

    if (documento.length === 11) {
      user = await repository.buscarCPF(documento);
      tipo = 'fornecedor';
    } else if (documento.length === 14) {
      user = await repository.buscarCNPJ(documento);
      tipo = 'empresa';
    } else {
      return res.redirect("login", { mensagem: "Documento inválido" });
    }

    if (!user || user.length === 0) return res.redirect("login", { mensagem: "Usuário não encontrado" });

    const mesmaSenha = await bcrypt.compare(senha, user[0].senha_hash);
    if (!mesmaSenha) return res.redirect("login", { mensagem: "Senha incorreta" });

    req.session.usuario = { tipo };
    if (tipo === 'empresa') return res.redirect("/empresa/dashboard");
    return res.redirect("/fornecedores");

  } catch (err) {
    console.error(err);
    return res.status(500).redirect("login", { mensagem: "Erro no servidor" });
  }
};

exports.redefinirSenha = async (req, res) => {
  try {
    const documento = req.body.documento.replace(/\D/g, "");
    let user, tipo;

    if (documento.length === 11) {
      user = await repository.buscarCPF(documento);
      tipo = 'fornecedor';
    } else if (documento.length === 14) {
      user = await repository.buscarCNPJ(documento);
      tipo = 'empresa';
    } else {
      return res.redirect("login", { mensagem: "Documento inválido" });
    }

    if (!user || user.length === 0) return res.redirect("login", { mensagem: "Usuário não encontrado" });

    const token = crypto.randomBytes(20).toString("hex");
    const expira = new Date(Date.now() + 3600000); // 1h

    if (tipo === 'fornecedor') {
      await repository.salvarTokenF({ cpf: documento, token_redefinicao: token, expira_token: expira });
    } else {
      await repository.salvarTokenE({ cnpj: documento, token_redefinicao: token, expira_token: expira });
    }

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: { user: "", pass: "" }
    });

    const link = `http://localhost:6767/atualizarSenha/${token}`;
    await transporter.sendMail({
      to: user[0].email,
      from: "",
      subject: "Trade Link - Redefinição de senha",
      html: `<p>Clique no link para redefinir sua senha:</p>
             <a href="${link}">${link}</a>`
    });

    res.redirect("login", { mensagem: "Link de redefinição enviado ao seu email" });

  } catch (err) {
    console.error(err);
    res.status(500).redirect("login", { mensagem: "Erro ao processar redefinição de senha" });
  }
};

exports.formResetarSenha = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await repository.buscarPorToken(token);

    if (!user || user.reset_expira < new Date()) {
      return res.redirect("login", { mensagem: "Token inválido ou expirado" });
    }

    res.redirect("resetarSenha", { token });

  } catch (err) {
    console.error(err);
    res.status(500).redirect("login", { mensagem: "Erro ao acessar formulário de redefinição" });
  }
};

exports.resetarSenha = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    const user = await repository.buscarPorToken(token);
    if (!user || user.reset_expira < new Date()) {
      return res.redirect("login", { mensagem: "Token inválido ou expirado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await repository.atualizarSenha(user.id, senhaHash);

    res.redirect("login", { mensagem: "Senha alterada com sucesso!" });

  } catch (err) {
    console.error(err);
    res.status(500).redirect("login", { mensagem: "Erro ao atualizar senha" });
  }
};

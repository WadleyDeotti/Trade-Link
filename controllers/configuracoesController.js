const repository = require('../repository/configuracoesRepository');

exports.salvarConfiguracoes = async (req, res) => {
    console.log('Chegou no controller');

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
    const toBool = val => val === 'on' ? 1 : 0;
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
                data_sharing: safe(toBool(data_sharing)),
                show_activity: safe(toBool(show_activity)),
                search_visibility: safe(toBool(search_visibility)),
                notify_messages: safe(toBool(notify_messages)),
                notify_mentions: safe(toBool(notify_mentions)),
                notify_updates: safe(toBool(notify_updates)),
                notify_comments: safe(toBool(notify_comments)),
                important_only: safe(toBool(important_only)),
                email_notifications: safe(toBool(email_notifications)),
                push_notifications: safe(toBool(push_notifications)),
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
                data_sharing: toBool(data_sharing),
                show_activity: toBool(show_activity),
                search_visibility: toBool(search_visibility),
                notify_messages: toBool(notify_messages),
                notify_mentions: toBool(notify_mentions),
                notify_updates: toBool(notify_updates),
                notify_comments: toBool(notify_comments),
                important_only: toBool(important_only),
                email_notifications: toBool(email_notifications),
                push_notifications: toBool(push_notifications),
                language,
                datetime_format,
                timezone
            };

            console.log('Usuário atualizado com sucesso');
            res.render('configuracoes');

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
                data_sharing: safe(toBool(data_sharing)),
                show_activity: safe(toBool(show_activity)),
                search_visibility: safe(toBool(search_visibility)),
                notify_messages: safe(toBool(notify_messages)),
                notify_mentions: safe(toBool(notify_mentions)),
                notify_updates: safe(toBool(notify_updates)),
                notify_comments: safe(toBool(notify_comments)),
                important_only: safe(toBool(important_only)),
                email_notifications: safe(toBool(email_notifications)),
                push_notifications: safe(toBool(push_notifications)),
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
                data_sharing: toBool(data_sharing),
                show_activity: toBool(show_activity),
                search_visibility: toBool(search_visibility),
                notify_messages: toBool(notify_messages),
                notify_mentions: toBool(notify_mentions),
                notify_updates: toBool(notify_updates),
                notify_comments: toBool(notify_comments),
                important_only: toBool(important_only),
                email_notifications: toBool(email_notifications),
                push_notifications: toBool(push_notifications),
                language,
                datetime_format,
                timezone
            };

            console.log('Usuário atualizado com sucesso');
            res.render('/configuracoes');

        } catch (err) {
            console.error('Erro ao atualizar usuário:', err);
            res.status(500).send('Erro ao atualizar usuário');
        }
    }
};

const repository = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');

const safeBool = val => val === 'on' ? 1 : 0;

exports.cadastrar = async (req, res) => {
  try {
    const dadosUsuario = req.body;
    console.log("Recebendo dados do cadastro:", dadosUsuario);

    if (dadosUsuario.cnpj) {
      // Cadastro de empresa
      await repository.inserirEmpresa({
        nome_fantasia: dadosUsuario.nome,
        email: dadosUsuario.email,
        cnpj: dadosUsuario.cnpj.replace(/\D/g, ''),
        senha: await bcrypt.hash(dadosUsuario.senha, 10)
      });

      req.session.usuario = { tipo: 'empresa' };
      return res.redirect('/fornecedores');

    } else if (dadosUsuario.cpf) {
      // Cadastro de fornecedor
      await repository.inserirFornecedor({
        nome_fantasia: dadosUsuario.nome,
        cpf: dadosUsuario.cpf.replace(/\D/g, ''),
        email: dadosUsuario.email,
        senha: await bcrypt.hash(dadosUsuario.senha, 10)
      });

      req.session.usuario = { tipo: 'fornecedor' };
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
      return res.render("login", { mensagem: "Documento inválido" });
    }

    if (!user || user.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

    const mesmaSenha = await bcrypt.compare(senha, user[0].senha_hash);
    if (!mesmaSenha) return res.render("login", { mensagem: "Senha incorreta" });

    req.session.usuario = { tipo };
    if (tipo === 'empresa') return res.redirect("/empresa/dashboard");
    return res.redirect("/fornecedores");

  } catch (err) {
    console.error(err);
    return res.status(500).render("login", { mensagem: "Erro no servidor" });
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
      return res.render("login", { mensagem: "Documento inválido" });
    }

    if (!user || user.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

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

    res.render("login", { mensagem: "Link de redefinição enviado ao seu email" });

  } catch (err) {
    console.error(err);
    res.status(500).render("login", { mensagem: "Erro ao processar redefinição de senha" });
  }
};

exports.formResetarSenha = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await repository.buscarPorToken(token);

    if (!user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }

    res.render("resetarSenha", { token });

  } catch (err) {
    console.error(err);
    res.status(500).render("login", { mensagem: "Erro ao acessar formulário de redefinição" });
  }
};

exports.resetarSenha = async (req, res) => {
  try {
    const { token } = req.params;
    const { senha } = req.body;

    const user = await repository.buscarPorToken(token);
    if (!user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    await repository.atualizarSenha(user.id, senhaHash);

    res.render("login", { mensagem: "Senha alterada com sucesso!" });

  } catch (err) {
    console.error(err);
    res.status(500).render("login", { mensagem: "Erro ao atualizar senha" });
  }
};

const repository = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');

exports.cadastrar = (req, res) => {
  const dadosUsuario = req.body;
  console.log("Recebendo dados do cadastro:", dadosUsuario);

  if (dadosUsuario.cnpj) {
    // Cadastro de empresa
    repository.inserirEmpresa({
      nome_fantasia: dadosUsuario.nome,
      email: dadosUsuario.email,
      cnpj: dadosUsuario.cnpj.replace(/\D/g, ''),
      senha: bcrypt.hashSync(dadosUsuario.senha, 10)
    }, (err, resultado) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao cadastrar empresa");
      }

      req.session.usuario = { 
        tipo: 'empresa',
      };
      res.redirect('/fornecedores');
    });

  } else if (dadosUsuario.cpf) {
    // Cadastro de fornecedor
        repository.inserirFornecedor({
      nome_fantasia: dadosUsuario.nome,
      cpf: dadosUsuario.cpf.replace(/\D/g, ''),
      email: dadosUsuario.email,
      senha: bcrypt.hashSync(dadosUsuario.senha, 10)
    }, (err, resultado) => {
      if (err) {
        console.error(err);
        return res.status(500).send(err);
      }

      req.session.usuario = {
        tipo: 'fornecedor',
        
      }
      res.redirect('/fornecedores');
    });

  } else {
    res.status(400).send("Dados inválidos");
  }
};

exports.logar = (req, res) => {
  let { documento, senha } = req.body;
  documento.replace(/\D/g, '');

  if (documento.length === 11) {
    // Login fornecedor
    repository.buscarCPF(documento, (err, fornecedor) => {
      
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!fornecedor || fornecedor.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

      bcrypt.compare(senha, fornecedor[0].senha_hash, (erro, mesmaSenha) => {
        if (erro) return res.status(500).render("login", { mensagem: "Erro ao validar senha" });

        if (mesmaSenha) {
          
          res.redirect("/fornecedores");
        } else {
          res.render("login", { mensagem: "Senha incorreta" });
        }
        req.session.usuario = {
          tipo: 'fornecedor',
        }
      });
    });

  } else if (documento.length === 14) {
    // Login empresa
    repository.buscarCNPJ(documento, (err, empresa) => {
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!empresa || empresa.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

      bcrypt.compare(senha, empresa[0].senha_hash, (erro, mesmaSenha) => {
        if (erro) return res.status(500).render("login", { mensagem: "Erro ao validar senha" });

        if (mesmaSenha) {
          res.redirect("/empresa/dashboard");
        } else {
          res.render("login", { mensagem: "Senha incorreta" });
        }
        req.session.usuario = {
          tipo: 'empresa',
        }
      });
    });

  } else {
    res.render("login", { mensagem: "Documento inválido" });
  }
};

exports.redefinirSenha = (req, res) => {
  const documento = req.body.documento.replace(/\D/g, "");

  if (documento.length === 11) {
    // Token fornecedor
    repository.buscarCPF(documento, (err, fornecedor) => {
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!fornecedor || fornecedor.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

      const token = crypto.randomBytes(20).toString("hex");
      const expira = new Date(Date.now() + 3600000); // 1h

      repository.salvarTokenF({ cpf: documento, token_redefinicao: token, expira_token: expira }, (err2) => {
        if (err2) return res.status(500).render("login", { mensagem: "Erro ao salvar token" });

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: { user: "", pass: "" }
        });

        const link = `http://localhost:6767/atualizarSenha/${token}`;
        transporter.sendMail({
          to: fornecedor[0].email,
          from: "",
          subject: "Trade Link - Redefinição de senha",
          html: `<p>Clique no link para redefinir sua senha:</p>
                 <a href="${link}">${link}</a>`
        });

        res.render("login", { mensagem: "Link de redefinição enviado ao seu email" });
      });
    });

  } else if (documento.length === 14) {
    // Token empresa
    repository.buscarCNPJ(documento, (err, empresa) => {
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!empresa || empresa.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

      const token = crypto.randomBytes(20).toString("hex");
      const expira = new Date(Date.now() + 3600000);

      repository.salvarTokenE({ cnpj: documento, token_redefinicao: token, expira_token: expira }, (err2) => {
        if (err2) return res.status(500).render("login", { mensagem: "Erro ao salvar token" });

        const transporter = nodemailer.createTransport({
          service: "Gmail",
          auth: { user: "", pass: "" }
        });

        const link = `http://localhost:6767/atualizarSenha/${token}`;
        transporter.sendMail({
          to: empresa[0].email,
          from: "",
          subject: "Trade Link - Redefinição de senha",
          html: `<p>Clique no link para redefinir sua senha:</p>
                 <a href="${link}">${link}</a>`
        });

        res.render("login", { mensagem: "Link de redefinição enviado ao seu email" });
      });
    });

  } else {
    res.render("login", { mensagem: "Documento inválido" });
  }
};

exports.formResetarSenha = (req, res) => {
  const { token } = req.params;

  repository.buscarPorToken(token, (err, user) => {
    if (err || !user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }
    res.render("resetarSenha", { token });
  });
};

exports.resetarSenha = (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;

  repository.buscarPorToken(token, (err, user) => {
    if (err || !user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    repository.atualizarSenha(user.id, senhaHash, (err2) => {
      if (err2) return res.status(500).render("login", { mensagem: "Erro ao atualizar senha" });

      res.render("login", { mensagem: "Senha alterada com sucesso!" });
    });
  });
};


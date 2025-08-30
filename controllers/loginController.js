const usuario = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt')
const nodeMailer = require('nodemailer');

exports.cadastrar = (req, res) => {
  const usuario = req.body;

  if (usuario.cnpj != null) {
    usuario.inserirEmpresa({
      nome_fantasia: usuario.nome,
      email: usuario.email,
      telefone: usuario.telefone,
      cnpj: usuario.cnpj? usuario.cnpj.replace(/\D/g, '') : '',
    }, (err, resultado) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao cadastrar"); // trocar pro metodo de enviar msg de erro
      }
      req.session.usuario = { 
        id: resultado.id,
         tipo: 'empresa' 
        };
      res.render('fornecedores');
    });
  } else if (dados.cpf != null) {
    usuario.inserirFornecedor({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cpf: dados.cpf? dados.cpf.replace(/\D/g, '') : '',
    }, (err, resultado) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao cadastrar"); // trocar pro metodo de enviar msg de erro
      }
      req.session.usuario = { 
        id: resultado.id,
         tipo: 'fornecedor' 
        };
      res.render('fornecedores');
    });
  } else {
    res.send("Dados inválidos"); // trocar pro metodo de enviar msg de erro
  }
}; 

exports.logar = (req, res) => {
    let { documento, senha } = req.body;

    documento = documento ? documento.replace(/\D/g, '') : '';

    if (documento && documento.length === 11) {
        usuario.buscarCPF(documento, (err, fornecedor) => {
            if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
            if (fornecedor.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

            bcrypt.compare(senha, fornecedor[0].senha, (erro, mesmaSenha) => {
                if (mesmaSenha) {
                    req.session.usuario = fornecedor[0];
                    res.redirect("/fornecedor/dashboard");
                } else {
                    res.render("login", { erro: "Senha incorreta" });
                }
            });
        });

    } else if (documento && documento.length === 14) {
        usuario.buscarCNPJ(documento, (err, empresa) => {
            if (err) return res.status(500).render("login", { erro: "Erro no servidor" });
            if (empresa.length === 0) return res.render("login", { erro: "Usuário não encontrado" });

            bcrypt.compare(senha, empresa[0].senha, (erro, mesmaSenha) => {
                if (mesmaSenha) {
                    req.session.usuario = empresa[0];
                    res.redirect("/empresa/dashboard");
                } else {
                    res.render("login", { erro: "Senha incorreta" });
                }
            });
        });

    } else {
        res.render("login", { erro: "Documento inválido" });
    }
};

exports.redefinirSenha = (req, res) => {
  const documento = req.body.documento.replace(/\D/g, "");

  if (documento && documento.length === 11) {
    usuario.buscarCPF(documento, (err, fornecedor) => {
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!fornecedor || fornecedor.length === 0) {
        return res.render("login", { mensagem: "Usuário não encontrado" });
      }

      // gerar token
      const token = crypto.randomBytes(20).toString("hex");
      const expira = new Date(Date.now() + 3600000); // 1h

      usuario.salvarTokenF({ documento, token, expira }, (err2) => {
        if (err2) return res.status(500).render("login", { mensagem: "Erro no servidor" });

        // enviar email
        const transporter = nodeMailer.createTransport({
          service: "Gmail",
          auth: {
            user: "", // email
            pass: ""  // senha / app password
          }
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
  } else if (documento && documento.length === 14) {
    usuario.buscarCNPJ(documento, (err, empresa) => {
      if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
      if (!empresa || empresa.length === 0) {
        return res.render("login", { mensagem: "Usuário não encontrado" });
      }

      const token = crypto.randomBytes(20).toString("hex");
      const expira = new Date(Date.now() + 3600000);

      usuario.salvarTokenE({ 
  cnpj: documento, 
  token_redefinicao: token, 
  expira_token: expira 
}, (err2) => {
        if (err2) return res.status(500).render("login", { mensagem: "Erro no servidor" });

        const transporter = nodeMailer.createTransport({
          service: "Gmail",
          auth: {
            user: "",
            pass: ""
          }
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
  }
};

exports.formResetarSenha = (req, res) => {
  const { token } = req.params;

  usuario.buscarPorToken(token, (err, user) => {
    if (err || !user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }
    res.render("resetarSenha", { token });
  });
};

exports.resetarSenha = (req, res) => {
  const { token } = req.params;
  const { senha } = req.body;

  usuario.buscarPorToken(token, (err, user) => {
    if (err || !user || user.reset_expira < new Date()) {
      return res.render("login", { mensagem: "Token inválido ou expirado" });
    }

    const senhaHash = bcrypt.hashSync(senha, 10);
    usuario.atualizarSenha(user.id, senhaHash, (err2) => {
      if (err2) return res.status(500).render("login", { mensagem: "Erro ao atualizar senha" });

      res.render("login", { mensagem: "Senha alterada com sucesso!" });
    });
  });
};
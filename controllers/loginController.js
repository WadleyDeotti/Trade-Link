const repository = require('../Repository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');

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

    let user;

    if (documento.length === 11) {
      user = await repository.buscarCPF(documento);

    } else if (documento.length === 14) {
      user = await repository.buscarCNPJ(documento);

    } else {
      return res.redirect("login", { mensagem: "Documento inválido" });
    }

    if (!user) return res.redirect("login", { mensagem: "Usuário não encontrado" });

    const mesmaSenha = await bcrypt.compare(senha, user.senha_hash);
    if (!mesmaSenha) return res.redirect("login", { mensagem: "Senha incorreta" });

    req.session.usuario = user;
    return res.redirect("/fornecedores");

  } catch (err) {
    console.error(err);
    return res.status(500).redirect("login", { mensagem: "Erro no servidor" });
  }
};

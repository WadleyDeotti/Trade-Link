// controllers/loginController.js
import * as repository from "../Repository.js"; // ajuste o caminho conforme seu projeto
import bcrypt from "bcrypt";

export const cadastrar = async (req, res) => {
  try {
    const dadosUsuario = req.body;
    console.log("Recebendo dados do cadastro:", dadosUsuario);

    if (dadosUsuario.cnpj) {
      // Cadastro de empresa
      await repository.inserirEmpresa({
        nome_fantasia: dadosUsuario.nome_completo,
        email: dadosUsuario.email,
        cnpj: dadosUsuario.cnpj.replace(/\D/g, ""),
        senha_hash: await bcrypt.hash(dadosUsuario.senha, 10),
      });

      const empresa = await repository.buscarCNPJ(dadosUsuario.cnpj.replace(/\D/g, ""));
      req.session.usuario = empresa;
      return res.redirect("/fornecedores");

    } else if (dadosUsuario.cpf) {
      // Cadastro de fornecedor
      await repository.inserirFornecedor({
        nome_fantasia: dadosUsuario.nome_completo,
        cpf: dadosUsuario.cpf.replace(/\D/g, ""),
        email: dadosUsuario.email,
        senha_hash: await bcrypt.hash(dadosUsuario.senha, 10),
      });

      const fornecedor = await repository.buscarCPF(dadosUsuario.cpf.replace(/\D/g, ""));
      req.session.usuario = fornecedor;
      return res.redirect("/fornecedores");

    } else {
      return res.status(400).send("Dados inválidos");
    }
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao cadastrar usuário");
  }
};

export const logar = async (req, res) => {
  try {
    let { documento, senha } = req.body;
    documento = documento.replace(/\D/g, "");

    let user;

    if (documento.length === 11) {
      user = await repository.buscarCPF(documento);

    } else if (documento.length === 14) {
      user = await repository.buscarCNPJ(documento);

    } else {
      return res.render("login", { mensagem: "Documento inválido" });
    }

    if (user.tipo === "fornecedor") {
    req.session.usuario = {
        id_fornecedor: user.id_fornecedor,
        nome: user.nome_fantasia,
        email: user.email,
        tipo: "fornecedor"
    };
}


console.log(req.session.usuario);


    if (!user) return res.render("login", { mensagem: "Usuário não encontrado" });

    const mesmaSenha = await bcrypt.compare(senha, user.senha_hash);
    if (!mesmaSenha) return res.render("login", { mensagem: "Senha incorreta" });

    req.session.usuario = user;
    return res.redirect("/fornecedores");

  } catch (err) {
    console.error(err);
    return res.status(500).render("login", { mensagem: "Erro no servidor" });
  }
};

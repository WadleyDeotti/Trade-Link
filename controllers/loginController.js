import { repository } from '../repository/usuarioRepository.js';
import bcrypt from 'bcrypt';

export const loginController = {
  cadastrar: (req, res) => {
    const dadosUsuario = req.body;
    console.log("Recebendo dados do cadastro:", dadosUsuario);

    if (dadosUsuario.cnpj) {
      repository.inserirEmpresa({
        nome_fantasia: dadosUsuario.nome,
        email: dadosUsuario.email,
        cnpj: dadosUsuario.cnpj.replace(/\D/g, ''),
        senha: bcrypt.hashSync(dadosUsuario.senha, 10)
      }, (err, resultado) => {
        if (err) return res.status(500).send("Erro ao cadastrar empresa");

        req.session.usuario = { tipo: 'empresa' };
        res.redirect('/fornecedores');
      });

    } else if (dadosUsuario.cpf) {
      repository.inserirFornecedor({
        nome_fantasia: dadosUsuario.nome,
        cpf: dadosUsuario.cpf.replace(/\D/g, ''),
        email: dadosUsuario.email,
        senha: bcrypt.hashSync(dadosUsuario.senha, 10)
      }, (err, resultado) => {
        if (err) return res.status(500).send(err);

        req.session.usuario = { tipo: 'fornecedor' };
        res.redirect('/fornecedores');
      });

    } else {
      res.status(400).send("Dados inválidos");
    }
  },

  logar: (req, res) => {
    let { documento, senha } = req.body;
    documento = documento.replace(/\D/g, '');

    if (documento.length === 11) {
      repository.buscarCPF(documento, (err, fornecedor) => {
        if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
        if (!fornecedor || fornecedor.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

        bcrypt.compare(senha, fornecedor[0].senha_hash, (erro, mesmaSenha) => {
          if (erro) return res.status(500).render("login", { mensagem: "Erro ao validar senha" });

          if (mesmaSenha) res.redirect("/fornecedores");
          else res.render("login", { mensagem: "Senha incorreta" });

          req.session.usuario = { tipo: 'fornecedor' };
        });
      });

    } else if (documento.length === 14) {
      repository.buscarCNPJ(documento, (err, empresa) => {
        if (err) return res.status(500).render("login", { mensagem: "Erro no servidor" });
        if (!empresa || empresa.length === 0) return res.render("login", { mensagem: "Usuário não encontrado" });

        bcrypt.compare(senha, empresa[0].senha_hash, (erro, mesmaSenha) => {
          if (erro) return res.status(500).render("login", { mensagem: "Erro ao validar senha" });

          if (mesmaSenha) res.redirect("/empresa/dashboard");
          else res.render("login", { mensagem: "Senha incorreta" });

          req.session.usuario = { tipo: 'empresa' };
        });
      });

    } else {
      res.render("login", { mensagem: "Documento inválido" });
    }
  },

  // ... continue exportando redefinirSenha, formResetarSenha e resetarSenha da mesma forma
};

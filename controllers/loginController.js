const usuario = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt')

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
        return res.status(500).send("Erro ao cadastrar");
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
        return res.status(500).send("Erro ao cadastrar");
      }
      req.session.usuario = { 
        id: resultado.id,
         tipo: 'fornecedor' 
        };
      res.render('fornecedores');
    });
  } else {
    res.send("Dados inválidos");
  }
}; 

exports.logar = (req, res) => {
    let { documento, senha } = req.body;

    documento = documento ? documento.replace(/\D/g, '') : '';

    if (documento && documento.length === 11) {
        usuario.buscarCPF(documento, (err, fornecedor) => {
            if (err) return res.status(500).render("login", { erro: "Erro no servidor" });
            if (fornecedor.length === 0) return res.render("login", { erro: "Usuário não encontrado" });

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


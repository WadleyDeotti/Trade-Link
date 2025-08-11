const usuario = require('../models/usuarioModel');
const bycript = require('bcrypt')

exports.cadastrar = (req, res) => {
  const dados = req.body;

  if (dados.cnpj != null) {
    usuario.inserirEmpresa2({
      nome: dados.nome,
      email: dados.email,
      telefone: dados.telefone,
      cnpj: dados.cnpj? dados.cnpj.replace(/\D/g, '') : '',
    }, (err, resultado) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erro ao cadastrar");
      }
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
      res.render('fornecedores');
    });
  } else {
    res.send("Dados inválidos");
  }
}; 


exports.login=(req,res)=>{
const {documento,senha}= req.body;
const login = documento ?documento.replace(/\D/g, ''):'';
if(login && login.length ===11){
    usuario.buscarCPF(login,(err, resultado)=>{
        if(err){
            return res.status(500).send("erro no servidor");
        }
        if(resultado.length===0){
            res.send("usuario não encontrado")
        }
        const querySQL = resultado[0];
        bycript.compare(senha,querySQL.senha,(erro,mesmasenha)=>{
            if(mesmasenha){
                req.session.querySQL={id:querySQL.id,nome:querySQL.nome};
                res.render("fornecedor");
            }else{res.send("senha incorreta")}
        });
    });

}

};
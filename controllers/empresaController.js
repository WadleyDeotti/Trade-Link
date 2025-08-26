const empresa = require('../repository/empresaRepository');



exports.formCadastro = (req,res) =>{
    res.send('registro')
};

exports.cadastrar = (req,res)=> {
    const {nome_fantasia,razao_social,cnpj,email}=req.body;

    empresa.inserirEmpresa({nome_fantasia,razao_social,cnpj,email},(err,resultado)=>{
        if(err){
            console.error(err);
            return res.status(500).send("erro ao cadastrar")
        }
        res.render('fornecedores')
    });
};


const mysql = require('mysql2');
const empresa =  require('../models/empresaModel');
const fornecedor = require('../models/fornecedorModel');

const conexao = mysql.createConnection({
 host:"localhost",
 user:"root",
password:"zasx",
database:"pit"
});

conexao.connect(err=>{
    if(err){
        console.error('Erro ao conectar ao db ',err);
        return;
    }
    console.log("conectado à db")

});

module.exports = {
    buscarCNPJ:(cnpj,callback)=>{
        const sql ="select cnpj,senha,email from empresas where cnpj = ?";
        conexao.query(sql,[cnpj],(err,resultado)=>{
            if(err){return callback(err);}
            const empresas= resultado.map(row => new empresa(row));
            callback(null,empresas);
        });
    },

    buscarCPF:(cpf,callback)=>{
        const sql = "select cpf,senha,email from fornecedores where cpf = ?";
        conexao.query(sql,[cpf],(err,resultado)=>{
            if(err){return callback(err);}
            const fornecedores = resultado.map(row => new fornecedor(row));
            callback(null,fornecedores);
        });
    },


    inserirEmpresa:(empresa,callback)=>{
        const sql = "insert into empresas(nome_fantasia,razao_social,cnpj,email,senha) values (?,?,?,?,?)";
        const valores = [empresa.nome_fantasia, empresa.razao_social,empresa.cnpj,empresa.email,empresa.senha];
        conexao.query(sql,valores,callback);
    },

    
    inserirFornecedor:(fornecedor,callback)=>{
        const sql = "insert into fornecedor(nome_fantasia,razao_social,cpf,email,senha) values (?,?,?,?,?)";
        const valores=[fornecedor.nome_fantasia,fornecedor.razao_social,fornecedor.cpf,fornecedor.email,fornecedor.senha];
        conexao.query(sql,valores,callback);
    },

    salvarTokenE: (empresa, callback) => {
    const sql = "update empresas set token_redefinicao=?, expira_token=? where cnpj=?";
    const valores = [empresa.token_redefinicao, empresa.expira_token, empresa.cnpj];
    conexao.query(sql, valores, callback);
},

salvarTokenF: (fornecedor, callback) => {
    const sql = "update fornecedores set token_redefinicao=?, expira_token=? where cpf=?";
    const valores = [fornecedor.token_redefinicao, fornecedor.expira_token, fornecedor.cpf];
    conexao.query(sql, valores, callback);
},

procurarTokenE: (token, callback) => {
    const sql = "select * from empresas where token_redefinicao=?";
    conexao.query(sql, [token], (err, resultado) => {
        if (err) return callback(err);
        // Se não tiver classe Empresa definida, retorna o objeto puro
        callback(null, resultado.length > 0 ? resultado[0] : null);
    });
},

procurarTokenF: (token, callback) => {
    const sql = "select * from fornecedores where token_redefinicao=?";
    conexao.query(sql, [token], (err, resultado) => {
        if (err) return callback(err);
        callback(null, resultado.length > 0 ? resultado[0] : null);
    });
}

};
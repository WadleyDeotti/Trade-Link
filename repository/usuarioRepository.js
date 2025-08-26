const mysql = require('mysql2');

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
        const sql ="select * from empresas where cnpj = ?";
        conexao.query(sql,[cnpj],callback)
    },
    inserirEmpresa:(empresa,callback)=>{
        const sql = "insert into empresas(nome_fantasia,razao_social,cnpj,email) values (?,?,?,?)";
        const valores = [empresa.nome_fantasia, empresa.razao_social,empresa.cnpj,empresa.email];
        conexao.query(sql,valores,callback);
    },

    inserirEmpresa2:(empresa,callback)=>{
        const sql = "insert into empresas(nome,email,telefone,cnpj) values (?,?,?,?)";
        const valores=[empresa.nome,empresa.email,empresa.telefone,empresa.cnpj]
        conexao.query(sql,valores,callback);
    },

    inserirFornecedor:(fornecedor,callback)=>{
        const sql = "insert into fornecedor(nome,email,telefone,cpf) values (?,?,?,?)";
        const valores=[fornecedor.nome,fornecedor.email,fornecedor.telefone,fornecedor.cpf]
        conexao.query(sql,valores,callback);
    },

    buscarCPF:(cpf,callback)=>{
        const sql = "select * from fornecedores where cpf = ?";
        conexao.query(sql,[cpf],callback);
    },
    
};
const mysql= require('mysql2');

const conexao = mysql.createConnection({
 host:"localhost",
 user:"root",
password:"zasx",
database:"pit"
});


 module.exports = {
inserirFornecedor:(fornecedor,callback)=>{
        const sql = "insert into fornecedor(nome,email,telefone,cnpj) values (?,?,?,?)";
        const valores=[fornecedor.nome,fornecedor.email,fornecedor.telefone,fornecedor.cnpj]
        conexao.query(sql,valores,callback);
    },

    buscarCPF:(cpf,callback)=>{
        const sql = "select * from fornecedores where cnpj = ?";
        conexao.query(sql,[cpf],callback);
    }, 
};
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

})

module.exports = {
    inserirEmpresa:(empresa,callback)=>{
        const sql = "insert into empresas(nome_fantasia,razao_social,cnpj,email) values (?,?,?,?)";
        const valores = [empresa.nome_fantasia, empresa.razao_social,empresa.cnpj,empresa.email];
        conexao.query(sql,valores,callback);
    }
}
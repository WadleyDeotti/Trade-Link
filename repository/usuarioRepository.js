import mysql from "mysql2";
import Empresa from '../models/empresaModel.js';
import Fornecedor from '../models/fornecedorModel.js';

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "zasx",
    database: "pit"
});

conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao db ', err);
        return;
    }
    console.log("conectado à db");
});

export const buscarCNPJ = (cnpj, callback) => {
    const sql = "select cnpj, senha_hash, email from empresas where cnpj = ?";
    conexao.query(sql, [cnpj], (err, resultado) => {
        if (err) return callback(err);
        const empresas = resultado.map(row => new Empresa(row));
        callback(null, empresas);
    });
};

export const buscarCPF = (cpf, callback) => {
    const sql = "select cpf, senha_hash, email from fornecedores where cpf = ?";
    conexao.query(sql, [cpf], (err, resultado) => {
        if (err) return callback(err);
        const fornecedores = resultado.map(row => new Fornecedor(row));
        callback(null, fornecedores);
    });
};

export const inserirEmpresa = (empresa, callback) => {
    const sql = "insert into empresas(nome_fantasia, cnpj, email, senha_hash) values (?,?,?,?)";
    const valores = [empresa.nome_fantasia, empresa.cnpj, empresa.email, empresa.senha];
    conexao.query(sql, valores, callback);
};

export const inserirFornecedor = (fornecedor, callback) => {
    const sql = "insert into fornecedores(nome_fantasia, cpf, email, senha_hash) values (?,?,?,?)";
    const valores = [fornecedor.nome_fantasia, fornecedor.cpf, fornecedor.email, fornecedor.senha];
    conexao.query(sql, valores, callback);
};

export const salvarTokenE = (empresa, callback) => {
    const sql = "update empresas set token_redefinicao=?, expira_token=? where cnpj=?";
    const valores = [empresa.token_redefinicao, empresa.expira_token, empresa.cnpj];
    conexao.query(sql, valores, callback);
};

export const salvarTokenF = (fornecedor, callback) => {
    const sql = "update fornecedores set token_redefinicao=?, expira_token=? where cpf=?";
    const valores = [fornecedor.token_redefinicao, fornecedor.expira_token, fornecedor.cpf];
    conexao.query(sql, valores, callback);
};

export const procurarTokenE = (token, callback) => {
    const sql = "select * from empresas where token_redefinicao=?";
    conexao.query(sql, [token], (err, resultado) => {
        if (err) return callback(err);
        callback(null, resultado.length > 0 ? resultado[0] : null);
    });
};

export const procurarTokenF = (token, callback) => {
    const sql = "select * from fornecedores where token_redefinicao=?";
    conexao.query(sql, [token], (err, resultado) => {
        if (err) return callback(err);
        callback(null, resultado.length > 0 ? resultado[0] : null);
    });
};

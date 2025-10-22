const mysql = require('mysql2');
const empresa =  require('../models/empresaModel');
const fornecedor = require('../models/fornecedorModel');

const conexao = mysql.createConnection({
 host:"localhost",
 user:"root",
password:"espes201005",
database:"pit"
});

conexao.connect(err=>{
    if(err){
        console.error('Erro ao conectar ao db ',err);
        return;
    }
    console.log("conectado à db")

});

const db = conexao.promise();

module.exports = {
    conexao,

    buscarCNPJ:(cnpj,callback)=>{
        const sql ="select cnpj,senha_hash,email from empresas where cnpj = ?";
        conexao.query(sql,[cnpj],(err,resultado)=>{
            if(err){return callback(err);}
            const empresas= resultado.map(row => new empresa(row));
            callback(null,empresas);
        });
    },

    buscarCPF:(cpf,callback)=>{
        const sql = "select cpf,senha_hash,email from fornecedores where cpf = ?";
        conexao.query(sql,[cpf],(err,resultado)=>{
            if(err){return callback(err);}
            const fornecedores = resultado.map(row => new fornecedor(row));
            callback(null,fornecedores);
        });
    },


    inserirEmpresa:(empresa,callback)=>{
        const sql = "insert into empresas(nome_fantasia,cnpj,email,senha_hash) values (?,?,?,?)";
        const valores = [empresa.nome_fantasia,empresa.cnpj,empresa.email,empresa.senha];
        conexao.query(sql,valores,callback);
    },

    
    inserirFornecedor:(fornecedor,callback)=>{
        const sql = "insert into fornecedores(nome_fantasia,cpf,email,senha_hash) values (?,?,?,?)";
        const valores=[fornecedor.nome_fantasia,fornecedor.cpf,fornecedor.email,fornecedor.senha];
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
},

 buscarHistorico: async ({ year, type, search }) => {
    try {
      // Compras
      let queryCompras = `
        SELECT 
          c.id_compra AS id,
          'compra' AS tipo,
          c.data_compra AS data,
          c.valor_total AS valor,
          c.status,
          e.nome_fantasia AS nome_empresa,
          f.nome_fantasia AS nome_fornecedor
        FROM compras c
        INNER JOIN empresas e ON c.id_empresa = e.id_empresa
        INNER JOIN fornecedores f ON c.id_fornecedor = f.id_fornecedor
        WHERE 1=1
      `;
      const params = [];

      if (year) {
        queryCompras += " AND YEAR(c.data_compra) = ?";
        params.push(year);
      }
      if (type && type !== "all") {
        queryCompras += " AND c.status = ?";
        params.push(type);
      }
      if (search) {
        queryCompras += " AND (e.nome_fantasia LIKE ? OR f.nome_fantasia LIKE ?)";
        params.push(`%${search}%`, `%${search}%`);
      }

      const [compras] = await db.execute(queryCompras, params);

      // Vendas (Contratos)
      let queryVendas = `
        SELECT 
          ct.id_contrato AS id,
          'venda' AS tipo,
          ct.data_inicio AS data,
          ct.valor_total AS valor,
          ct.status,
          e.nome_fantasia AS nome_empresa,
          f.nome_fantasia AS nome_fornecedor
        FROM contratos ct
        INNER JOIN empresas e ON ct.id_empresa = e.id_empresa
        INNER JOIN fornecedores f ON ct.id_fornecedor = f.id_fornecedor
        WHERE 1=1
      `;
      const paramsVendas = [];
      if (year) {
        queryVendas += " AND YEAR(ct.data_inicio) = ?";
        paramsVendas.push(year);
      }
      if (type && type !== "all") {
        queryVendas += " AND ct.status = ?";
        paramsVendas.push(type);
      }
      if (search) {
        queryVendas += " AND (e.nome_fantasia LIKE ? OR f.nome_fantasia LIKE ?)";
        paramsVendas.push(`%${search}%`, `%${search}%`);
      }

      const [vendas] = await db.execute(queryVendas, paramsVendas);

      // Junta e ordena por data
      return [...compras, ...vendas].sort((a, b) => new Date(b.data) - new Date(a.data));

    } catch (error) {
      throw error;
    }
  },

  resumoFinanceiro: async () => {
    try {
      const [results] = await db.execute(`
        SELECT
          SUM(c.valor_total) AS total_compras,
          (SELECT SUM(ct.valor_total) FROM contratos ct) AS total_vendas,
          (SELECT SUM(ct.valor_total) FROM contratos ct) - SUM(c.valor_total) AS saldo
        FROM compras c
      `);
      return results[0];
    } catch (error) {
      throw error;
    }
  },

  dadosGrafico: async () => {
    try {
      const [resultsCompras] = await db.execute(`
        SELECT MONTH(data_compra) AS mes, SUM(valor_total) AS compras
        FROM compras
        WHERE YEAR(data_compra) = YEAR(CURDATE())
        GROUP BY MONTH(data_compra)
      `);

      const [resultsVendas] = await db.execute(`
        SELECT MONTH(data_inicio) AS mes, SUM(valor_total) AS vendas
        FROM contratos
        WHERE YEAR(data_inicio) = YEAR(CURDATE())
        GROUP BY MONTH(data_inicio)
      `);

      // Normalizar para 12 meses
      const meses = Array.from({ length: 12 }, (_, i) => ({
        mes: i + 1,
        compras: 0,
        vendas: 0
      }));

      resultsCompras.forEach(r => {
        meses[r.mes - 1].compras = r.compras;
      });
      resultsVendas.forEach(r => {
        meses[r.mes - 1].vendas = r.vendas;
      });

      return meses;

    } catch (error) {
      throw error;
    }
  }
};
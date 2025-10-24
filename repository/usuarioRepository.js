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

// No arquivo: repository/usuarioRepository.js

buscarHistorico: async ({ year, type, search }) => {
    try {
        let resultados = [];
        const searchTerm = search ? `%${search}%` : null;
        
        // CORREÇÃO 1: Mapeamento de tipo para controlar a execução
        const isPurchase = (type === 'all' || type === 'compra' || type === 'purchase');
        const isSale = (type === 'all' || type === 'venda' || type === 'sale');
        
        // CORREÇÃO 2: Determinar se o filtro de status deve ser aplicado.
        // Se o 'type' for 'purchase' ou 'sale', ele é um filtro de CATEGORIA, não de STATUS.
        const isCategoryFilter = (type === 'purchase' || type === 'sale' || type === 'compra' || type === 'venda');

        // ======================= COMPRAS =======================
        if (isPurchase) { // EXECUTA SOMENTE SE FOR 'all', 'compra' ou 'purchase'
            let queryCompras = `
                SELECT 
                    c.id_compra AS id, 'compra' AS tipo, c.data_compra AS data,
                    c.valor_total AS valor, c.status,
                    NULL AS nome_empresa, f.nome_fantasia AS nome_fornecedor
                FROM compras c
                LEFT JOIN fornecedores f ON c.id_fornecedor = f.id_fornecedor
                WHERE 1=1
            `;
            let paramsCompras = [];

            // Filtro por Ano
            if (year) {
                queryCompras += " AND YEAR(c.data_compra) = ?";
                paramsCompras.push(year);
            }
            
            // Filtro por Tipo (STATUS) - SÓ APLICA SE O TIPO NÃO FOR UM FILTRO DE CATEGORIA GERAL
            // Ex: Se type='aprovada', aplica. Se type='purchase', NÃO aplica aqui.
            if (type && type !== "all" && !isCategoryFilter) { 
                queryCompras += " AND c.status = ?";
                paramsCompras.push(type); 
            }
            
            // Filtro por Busca
            if (searchTerm) {
                queryCompras += " AND (f.nome_fantasia LIKE ?)";
                paramsCompras.push(searchTerm);
            }

            const [compras] = await db.execute(queryCompras, paramsCompras);
            resultados = [...resultados, ...compras];
        }

        // ======================= VENDAS (Contratos) =======================
        if (isSale) { // EXECUTA SOMENTE SE FOR 'all', 'venda' ou 'sale'
            let queryVendas = `
                SELECT 
                    ct.id_contrato AS id, 'venda' AS tipo, ct.data_inicio AS data,
                    ct.valor_total AS valor, ct.status,
                    e.nome_fantasia AS nome_empresa, NULL AS nome_fornecedor
                FROM contratos ct
                LEFT JOIN empresas e ON ct.id_empresa = e.id_empresa
                WHERE 1=1
            `;
            let paramsVendas = [];
            
            // Filtro por Ano
            if (year) {
                queryVendas += " AND YEAR(ct.data_inicio) = ?";
                paramsVendas.push(year);
            }
            
            // Filtro por Tipo (STATUS)
            if (type && type !== "all" && !isCategoryFilter) { 
                queryVendas += " AND ct.status = ?";
                paramsVendas.push(type);
            }
            
            // Filtro por Busca
            if (searchTerm) {
                queryVendas += " AND (e.nome_fantasia LIKE ?)";
                paramsVendas.push(searchTerm);
            }

            const [vendas] = await db.execute(queryVendas, paramsVendas);
            resultados = [...resultados, ...vendas];
        }

        // Junta e ordena por data (mais recente primeiro)
        return resultados.sort((a, b) => new Date(b.data) - new Date(a.data));

    } catch (error) {
        console.error("Erro no repository buscarHistorico:", error);
        throw error;
    }
},

resumoFinanceiro: async () => {
    try {
        // Consultas separadas para garantir a estabilidade e evitar NULLs
        const [totalCompras] = await db.execute(`SELECT IFNULL(SUM(valor_total), 0) AS total_purchases FROM compras`);
        const [totalVendas] = await db.execute(`SELECT IFNULL(SUM(valor_total), 0) AS total_sales FROM contratos`);

        // Extrai os valores (já garantidos como não-nulos pelo IFNULL)
        const purchases = totalCompras[0].total_purchases || 0;
        const sales = totalVendas[0].total_sales || 0;
        const balance = sales - purchases;

        // ESTE É O JSON FINAL ESPERADO
        return {
            total_purchases: parseFloat(purchases), 
            total_sales: parseFloat(sales),
            balance: parseFloat(balance)
        };

    } catch (error) {
        // ESSENCIAL: Logar o erro completo para ver o SQL que falhou!
        console.error("Erro ao calcular resumo financeiro (SQL falhou):", error);
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



const produtoRepository = {

    // Função para buscar um produto e seus detalhes pelo ID
    buscarProdutoPorId: async (id_produto) => {
        try {
            // A query traz o produto, o nome do fornecedor e o preço
            const query = `
                SELECT 
                    p.id_produto, p.nome_produto, p.descricao, p.preco, p.disponivel,
                    f.nome_fantasia AS nome_fornecedor
                FROM produtos p
                LEFT JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
                WHERE p.id_produto = ?
            `;
            const [rows] = await db.execute(query, [id_produto]);

            if (rows.length === 0) {
                return null; // Produto não encontrado
            }
            return rows[0]; // Retorna o primeiro e único resultado

        } catch (error) {
            console.error("Erro no repository buscarProdutoPorId:", error);
            throw error; // Propaga o erro para o Controller
        }
    },

    // Você pode adicionar funções para buscar avaliações, produtos relacionados, etc.
    buscarAvaliacoes: async (id_produto) => {
        // Exemplo: SELECT * FROM avaliacoes WHERE id_produto = ?
        return []; // Retornando vazio por enquanto
    }
};


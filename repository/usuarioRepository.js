const mysql = require('mysql2');
const empresa = require('../models/empresaModel');
const fornecedor = require('../models/fornecedorModel');

const conexao = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "espes201005",
    database: "pit"
});

conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao db ', err);
        return;
    }
    console.log("conectado à db");
});

const db = conexao.promise(); // Versão Promise para usar async/await nas novas funções

module.exports = {
    // ------------------- Métodos Antigos (Padrão Callback) -------------------
    conexao, // Necessário se você usa 'conexao.query' em outros lugares

    buscarCNPJ: (cnpj, callback) => {
        const sql = "select cnpj,senha_hash,email from empresas where cnpj = ?";
        conexao.query(sql, [cnpj], (err, resultado) => {
            if (err) { return callback(err); }
            const empresas = resultado.map(row => new empresa(row));
            callback(null, empresas);
        });
    },

    buscarCPF: (cpf, callback) => {
        const sql = "select cpf,senha_hash,email from fornecedores where cpf = ?";
        conexao.query(sql, [cpf], (err, resultado) => {
            if (err) { return callback(err); }
            const fornecedores = resultado.map(row => new fornecedor(row));
            callback(null, fornecedores);
        });
    },

    inserirEmpresa: (empresa, callback) => {
        const sql = "insert into empresas(nome_fantasia,cnpj,email,senha_hash) values (?,?,?,?)";
        const valores = [empresa.nome_fantasia, empresa.cnpj, empresa.email, empresa.senha];
        conexao.query(sql, valores, callback);
    },

    inserirFornecedor: (fornecedor, callback) => {
        const sql = "insert into fornecedores(nome_fantasia,cpf,email,senha_hash) values (?,?,?,?)";
        const valores = [fornecedor.nome_fantasia, fornecedor.cpf, fornecedor.email, fornecedor.senha];
        conexao.query(sql, valores, callback);
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
    
    // ------------------- Funções de HISTÓRICO (Async/Await) -------------------
    
    buscarHistorico: async ({ year, type, search }) => {
        try {
            // Seu código de busca de histórico (usando db.execute)
            let resultados = [];
            const searchTerm = search ? `%${search}%` : null;
            const isPurchase = (type === 'all' || type === 'compra' || type === 'purchase');
            const isSale = (type === 'all' || type === 'venda' || type === 'sale');
            const isCategoryFilter = (type === 'purchase' || type === 'sale' || type === 'compra' || type === 'venda');
            
            // Lógica de Compras
            if (isPurchase) {
                let queryCompras = `
                    SELECT c.id_compra AS id, 'compra' AS tipo, c.data_compra AS data,
                           c.valor_total AS valor, c.status,
                           NULL AS nome_empresa, f.nome_fantasia AS nome_fornecedor
                    FROM compras c LEFT JOIN fornecedores f ON c.id_fornecedor = f.id_fornecedor
                    WHERE 1=1
                `;
                let paramsCompras = [];
                if (year) { queryCompras += " AND YEAR(c.data_compra) = ?"; paramsCompras.push(year); }
                if (type && type !== "all" && !isCategoryFilter) { queryCompras += " AND c.status = ?"; paramsCompras.push(type); }
                if (searchTerm) { queryCompras += " AND (f.nome_fantasia LIKE ?)"; paramsCompras.push(searchTerm); }

                const [compras] = await db.execute(queryCompras, paramsCompras);
                resultados = [...resultados, ...compras];
            }

            // Lógica de Vendas/Contratos
            if (isSale) {
                let queryVendas = `
                    SELECT ct.id_contrato AS id, 'venda' AS tipo, ct.data_inicio AS data,
                           ct.valor_total AS valor, ct.status,
                           e.nome_fantasia AS nome_empresa, NULL AS nome_fornecedor
                    FROM contratos ct LEFT JOIN empresas e ON ct.id_empresa = e.id_empresa
                    WHERE 1=1
                `;
                let paramsVendas = [];
                if (year) { queryVendas += " AND YEAR(ct.data_inicio) = ?"; paramsVendas.push(year); }
                if (type && type !== "all" && !isCategoryFilter) { queryVendas += " AND ct.status = ?"; paramsVendas.push(type); }
                if (searchTerm) { queryVendas += " AND (e.nome_fantasia LIKE ?)"; paramsVendas.push(searchTerm); }

                const [vendas] = await db.execute(queryVendas, paramsVendas);
                resultados = [...resultados, ...vendas];
            }
            
            return resultados.sort((a, b) => new Date(b.data) - new Date(a.data));
        } catch (error) {
            console.error("Erro no repository buscarHistorico:", error);
            throw error;
        }
    },

    resumoFinanceiro: async () => {
        try {
            const [totalCompras] = await db.execute(`SELECT IFNULL(SUM(valor_total), 0) AS total_purchases FROM compras`);
            const [totalVendas] = await db.execute(`SELECT IFNULL(SUM(valor_total), 0) AS total_sales FROM contratos`);

            const purchases = totalCompras[0].total_purchases || 0;
            const sales = totalVendas[0].total_sales || 0;
            const balance = sales - purchases;

            return {
                total_purchases: parseFloat(purchases),
                total_sales: parseFloat(sales),
                balance: parseFloat(balance)
            };
        } catch (error) {
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

            const meses = Array.from({ length: 12 }, (_, i) => ({ mes: i + 1, compras: 0, vendas: 0 }));
            resultsCompras.forEach(r => { meses[r.mes - 1].compras = r.compras; });
            resultsVendas.forEach(r => { meses[r.mes - 1].vendas = r.vendas; });

            return meses;
        } catch (error) {
            throw error;
        }
    },

    // ------------------- Funções de PRODUTO (Async/Await) -------------------

    buscarProdutoPorId: async (id_produto) => {
        try {
            const query = `
                SELECT 
                    p.id_produto, p.nome_produto, p.descricao, p.preco, p.disponivel,
                    f.nome_fantasia AS nome_fornecedor
                FROM produtos p
                LEFT JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
                WHERE p.id_produto = ?
            `;
            const [rows] = await db.execute(query, [id_produto]);
            return rows.length === 0 ? null : rows[0];
        } catch (error) {
            console.error("Erro no repository buscarProdutoPorId:", error);
            throw error;
        }
    },

    buscarCaracteristicas: async (id_produto) => {
        try {
            const query = `
                SELECT texto_caracteristica
                FROM produto_caracteristicas
                WHERE id_produto = ?
            `;
            const [rows] = await db.execute(query, [id_produto]);
            return rows;
        } catch (error) {
            console.error("Erro no repository buscarCaracteristicas:", error);
            throw error;
        }
    },

    buscarAvaliacoes: async (id_produto) => {
        // Implementação futura: SELECT * FROM avaliacoes WHERE id_produto = ?
        return []; 
    }
};


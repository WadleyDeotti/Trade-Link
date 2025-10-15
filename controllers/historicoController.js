//alterações italo
const db = require("../database/db");

const Historico = require('../models/historico');

// Buscar histórico com filtros
exports.getHistorico = (req, res) => {
  const { year, type, search } = req.query;

  let query = "SELECT * FROM historico WHERE 1=1";
  const params = [];

  if (year) {
    query += " AND YEAR(data) = ?";
    params.push(year);
  }

  if (type && type !== "all") {
    query += " AND tipo = ?";
    params.push(type);
  }

  if (search) {
    query += " AND (parceiro LIKE ? OR detalhes LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  query += " ORDER BY data DESC";

  db.query(query, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar histórico" });
    }
    res.json(results);
  });
};

// Resumo financeiro
exports.getResumo = (req, res) => {
  const query = `
    SELECT
      SUM(CASE WHEN tipo = 'purchase' THEN valor ELSE 0 END) AS total_purchases,
      SUM(CASE WHEN tipo = 'sale' THEN valor ELSE 0 END) AS total_sales,
      SUM(CASE WHEN tipo = 'sale' THEN valor ELSE 0 END) -
      SUM(CASE WHEN tipo = 'purchase' THEN valor ELSE 0 END) AS balance
    FROM historico
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao calcular resumo" });
    }
    res.json(results[0]);
  });
};

// Resumo mensal para gráfico
exports.getGrafico = (req, res) => {
  const query = `
    SELECT 
      MONTH(data) AS mes,
      SUM(CASE WHEN tipo = 'purchase' THEN valor ELSE 0 END) AS compras,
      SUM(CASE WHEN tipo = 'sale' THEN valor ELSE 0 END) AS vendas
    FROM historico
    WHERE YEAR(data) = YEAR(CURDATE())
    GROUP BY MONTH(data)
    ORDER BY mes;
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao gerar dados do gráfico" });
    }

    // Normalizar resposta (garantir 12 meses mesmo sem registros)
    const meses = Array.from({ length: 12 }, (_, i) => ({
      mes: i + 1,
      compras: 0,
      vendas: 0,
    }));

    results.forEach(r => {
      meses[r.mes - 1].compras = r.compras;
      meses[r.mes - 1].vendas = r.vendas;
    });

    res.json(meses);
  });
};



//juntando dados das 3 tabelas
exports.listarHistorico = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT 
        h.id_historico,
        h.tipo,
        h.valor,
        h.status,
        h.data,
        e.nome_fantasia AS nome_empresa,
        f.nome_fantasia AS nome_fornecedor
      FROM historico h
      LEFT JOIN empresa e ON h.id_empresa = e.id_empresa
      LEFT JOIN fornecedor f ON h.id_fornecedor = f.id_fornecedor
      ORDER BY h.data DESC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Erro ao listar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
};

exports.listarHistorico = async (req, res) => {
  try {
    // Compra (Empresa comprando de Fornecedor)
    const [compras] = await db.execute(`
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
    `);

    // Contrato (Fornecedor vendendo para Empresa) (do tipo venda)
    const [vendas] = await db.execute(`
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
    `);

    // Junta os dois tipos de histórico
    const historico = [...compras, ...vendas].sort((a, b) => new Date(b.data) - new Date(a.data));

    res.json(historico);
  } catch (error) {
    console.error('Erro ao listar histórico:', error);
    res.status(500).json({ error: 'Erro ao buscar histórico.' });
  }
};
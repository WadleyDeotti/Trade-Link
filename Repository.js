//DOTENV
import dotenv from 'dotenv';
dotenv.config();

// repository.js
import mysql from 'mysql2/promise';
import { Empresa } from './models/empresaModel.js';
import { Fornecedor } from './models/fornecedorModel.js';
import { Produto } from './models/produtoModel.js';


// 🧩 Cria a conexão (ou pool)
const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namedPlaceholders: true
});

// ✅ Teste de conexão
(async () => {
  try {
    const conn = await conexao.getConnection();
    console.log("Conectado ao banco de dados com sucesso!");
    conn.release();
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();

// ---------------- Funções ----------------
export async function testeUsuario() {
  const [rows] = await conexao.query("SELECT * FROM fornecedores WHERE id_fornecedor = 5");
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

export async function getProdutos() {
  const [rows] = await conexao.execute(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f USING(id_fornecedor)
  `);
  return rows.map(row => new Produto(row));
}

export async function getFornecedor() {
  const [rows] = await conexao.execute("SELECT * FROM fornecedores");
  return rows.map(row => new Fornecedor(row));
}

export async function buscarCNPJ(cnpj) {
  const [rows] = await conexao.execute(
    "SELECT * FROM empresas WHERE cnpj = ?",
    [cnpj]
  );
  return rows.length > 0 ? new Empresa(rows[0]) : null;
}

export async function buscarCPF(cpf) {
  const [rows] = await conexao.execute(
    "SELECT * FROM fornecedores WHERE cpf = ?",
    [cpf]
  );
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

// Atualizações
export async function updateEmpresa(dados) {
  const sql = `
    UPDATE empresas SET
      visibility = ?, data_sharing = ?, show_activity = ?, search_visibility = ?,
      notify_messages = ?, notify_mentions = ?, notify_updates = ?, notify_comments = ?,
      important_only = ?, email_notifications = ?, push_notifications = ?, language = ?,
      datetime_format = ?, timezone = ?
    WHERE id_empresa = ?
  `;
  const values = [
    dados.visibility, dados.data_sharing, dados.show_activity, dados.search_visibility,
    dados.notify_messages, dados.notify_mentions, dados.notify_updates, dados.notify_comments,
    dados.important_only, dados.email_notifications, dados.push_notifications,
    dados.language, dados.datetime_format, dados.timezone, dados.id_empresa
  ];
  const [resultado] = await conexao.execute(sql, values);
  return resultado;
}

export async function updateFornecedor(dados) {
  const sql = `
    UPDATE fornecedores SET
      visibility = ?, data_sharing = ?, show_activity = ?, search_visibility = ?,
      notify_messages = ?, notify_mentions = ?, notify_updates = ?, notify_comments = ?,
      important_only = ?, email_notifications = ?, push_notifications = ?, language = ?,
      datetime_format = ?, timezone = ?
    WHERE id_fornecedor = ?
  `;
  const values = [
    dados.visibility, dados.data_sharing, dados.show_activity, dados.search_visibility,
    dados.notify_messages, dados.notify_mentions, dados.notify_updates, dados.notify_comments,
    dados.important_only, dados.email_notifications, dados.push_notifications,
    dados.language, dados.datetime_format, dados.timezone, dados.id_fornecedor
  ];
  const [resultado] = await conexao.execute(sql, values);
  return resultado;
}

// Atualizar senha
export async function updateSenhaEmpresa({ senha_hash, id_empresa }) {
  const sql = "UPDATE empresas SET senha_hash = ? WHERE id_empresa = ?";
  const [resultado] = await conexao.execute(sql, [senha_hash, id_empresa]);
  return resultado;
}

export async function updateSenhaFornecedor({ senha_hash, id_fornecedor }) {
  const sql = "UPDATE fornecedores SET senha_hash = ? WHERE id_fornecedor = ?";
  const [resultado] = await conexao.execute(sql, [senha_hash, id_fornecedor]);
  return resultado;
}

// Buscar senha
export async function buscarSenhaEmpresa(id_empresa) {
  const sql = "SELECT senha_hash FROM empresas WHERE id_empresa = ?";
  const [rows] = await conexao.execute(sql, [id_empresa]);
  return rows.length > 0 ? rows[0].senha_hash : null;
}

export async function buscarSenhaFornecedor(id_fornecedor) {
  const sql = "SELECT senha_hash FROM fornecedores WHERE id_fornecedor = ?";
  const [rows] = await conexao.execute(sql, [id_fornecedor]);
  return rows.length > 0 ? rows[0].senha_hash : null;
}

// Buscar por ID
export async function buscarEmpresaPorId(id_empresa) {
  const sql = "SELECT * FROM empresas WHERE id_empresa = ?";
  const [rows] = await conexao.execute(sql, [id_empresa]);
  return rows.length > 0 ? new Empresa(rows[0]) : null;
}

export async function buscarFornecedorPorId(id_fornecedor) {
  const sql = "SELECT * FROM fornecedores WHERE id_fornecedor = ?";
  const [rows] = await conexao.execute(sql, [id_fornecedor]);
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

// Inserções
export async function inserirEmpresa({ nome_fantasia, cnpj, email, senha_hash }) {
  const sql = "INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash) VALUES (?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, cnpj, email, senha_hash]);
  return resultado;
}

export async function inserirFornecedor({ nome_fantasia, cpf, email, senha_hash }) {
  const sql = "INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash) VALUES (?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, cpf, email, senha_hash]);
  return resultado;
}

// Atualizar dados gerais
export async function atualizarFornecedor({ id_fornecedor, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE fornecedores SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_fornecedor = ?";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_fornecedor]);
  return resultado;
}

export async function atualizarEmpresa({ id_empresa, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE empresas SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_empresa = ?";
  const [resultado] = await conexao.execute(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_empresa]);
  return resultado;
}

// Cadastrar produto
export async function cadastrarProduto({ id_fornecedor, nome_produto, descricao, preco, categoria }) {
  const sql = "INSERT INTO produtos (id_fornecedor, nome_produto, descricao, preco, categoria) VALUES (?,?,?,?,?)";
  const [resultado] = await conexao.execute(sql, [id_fornecedor, nome_produto, descricao, preco, categoria]);
  return resultado;
}

// ========== CONVERSAS ==========

export async function buscarOuCriarConversa(usuario1, usuario2, tipo1, tipo2) {
    const sql = `
        SELECT * FROM conversas 
        WHERE (usuario1_id = ? AND usuario2_id = ?)
        OR (usuario1_id = ? AND usuario2_id = ?)
    `;

    const [rows] = await conexao.query(sql, [
        usuario1, usuario2,
        usuario2, usuario1
    ]);

    if (rows.length > 0) return rows[0];

    const insert = `
        INSERT INTO conversas (usuario1_id, usuario2_id, tipo1, tipo2)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await conexao.query(insert, [
        usuario1, usuario2,
        tipo1, tipo2
    ]);

    return {
        id_conversa: result.insertId,
        usuario1_id: usuario1,
        usuario2_id: usuario2,
        tipo1,
        tipo2
    };
}

export async function listarConversasDoUsuario(id_usuario) {
    const sql = `
        SELECT c.*,
            (SELECT conteudo FROM mensagens 
              WHERE id_conversa = c.id_conversa 
              ORDER BY id_mensagem DESC LIMIT 1) AS ultima_msg,

            (SELECT COUNT(*) FROM mensagens 
              WHERE id_conversa = c.id_conversa 
              AND lida = 0
              AND remetente_id != ?) AS nao_lidas

        FROM conversas c
        WHERE c.usuario1_id = ? OR c.usuario2_id = ?
    `;

    const [rows] = await conexao.query(sql, [
        id_usuario,
        id_usuario,
        id_usuario
    ]);

    return rows;
}

// ========== MENSAGENS ==========

export async function salvarMensagem(id_conversa, remetente_id, tipo_remetente, conteudo) {
    const sql = `
        INSERT INTO mensagens (id_conversa, remetente_id, tipo_remetente, conteudo)
        VALUES (?, ?, ?, ?)
    `;

    const [result] = await conexao.query(sql, [
        id_conversa,
        remetente_id,
        tipo_remetente,
        conteudo
    ]);

    return result.insertId;
}

export async function listarMensagens(id_conversa) {
    const sql = `
        SELECT *
        FROM mensagens
        WHERE id_conversa = ?
        ORDER BY enviado_em ASC
    `;

    const [rows] = await conexao.query(sql, [id_conversa]);
    return rows;
}

export async function marcarLidas(id_conversa, usuario_id) {
    const sql = `
        UPDATE mensagens
        SET lida = 1
        WHERE id_conversa = ?
          AND remetente_id != ?
    `;

    await conexao.query(sql, [id_conversa, usuario_id]);
}




// Historico completo
// ------------------- Funções de token -------------------
export const salvarTokenE = async (empresa) => {
  const sql = 'UPDATE empresas SET token_redefinicao=?, expira_token=? WHERE cnpj=?';
  const [result] = await conexao.execute(sql, [empresa.token_redefinicao, empresa.expira_token, empresa.cnpj]);
  return result;
};

export const salvarTokenF = async (fornecedor) => {
  const sql = 'UPDATE fornecedores SET token_redefinicao=?, expira_token=? WHERE cpf=?';
  const [result] = await conexao.execute(sql, [fornecedor.token_redefinicao, fornecedor.expira_token, fornecedor.cpf]);
  return result;
};

export const procurarTokenE = async (token) => {
  const sql = 'SELECT * FROM empresas WHERE token_redefinicao=?';
  const [rows] = await conexao.execute(sql, [token]);
  return rows.length > 0 ? rows[0] : null;
};

export const procurarTokenF = async (token) => {
  const sql = 'SELECT * FROM fornecedores WHERE token_redefinicao=?';
  const [rows] = await conexao.execute(sql, [token]);
  return rows.length > 0 ? rows[0] : null;
};


// ------------------- HISTÓRICO / RELATÓRIOS -------------------
export const buscarHistorico = async ({ year, type, search }) => {
    try {
        let resultados = [];

        const searchTerm = search ? `%${search}%` : null;

        const isPurchase =
            type === "all" || type === "compra" || type === "purchase";

        const isSale =
            type === "all" || type === "venda" || type === "sale";

        const isCategoryFilter =
            type === "purchase" ||
            type === "sale" ||
            type === "compra" ||
            type === "venda";

        // --------------------------- COMPRAS ---------------------------

        if (isPurchase) {
            let queryCompras = `
                SELECT 
                    c.id_compra AS id,
                    'compra' AS tipo,
                    c.data_compra AS data,
                    c.valor_total AS valor,
                    c.status,
                    NULL AS nome_empresa,
                    f.nome_fantasia AS nome_fornecedor
                FROM compras c
                LEFT JOIN fornecedores f ON c.id_fornecedor = f.id_fornecedor
                WHERE 1 = 1
            `;

            const paramsCompras = [];

            if (year) {
                queryCompras += " AND YEAR(c.data_compra) = ?";
                paramsCompras.push(year);
            }

            // filtra status apenas se o tipo NÃO for compra/venda puro
            if (type && type !== "all" && !isCategoryFilter) {
                queryCompras += " AND c.status = ?";
                paramsCompras.push(type);
            }

            if (searchTerm) {
                queryCompras += " AND f.nome_fantasia LIKE ?";
                paramsCompras.push(searchTerm);
            }

            const [compras] = await conexao.execute(queryCompras, paramsCompras);
            resultados.push(...compras);
        }

        // --------------------------- VENDAS / CONTRATOS ---------------------------

        if (isSale) {
            let queryVendas = `
                SELECT 
                    ct.id_contrato AS id,
                    'venda' AS tipo,
                    ct.data_inicio AS data,
                    ct.valor_total AS valor,
                    ct.status,
                    e.nome_fantasia AS nome_empresa,
                    NULL AS nome_fornecedor
                FROM contratos ct
                LEFT JOIN empresas e ON ct.id_empresa = e.id_empresa
                WHERE 1 = 1
            `;

            const paramsVendas = [];

            if (year) {
                queryVendas += " AND YEAR(ct.data_inicio) = ?";
                paramsVendas.push(year);
            }

            if (type && type !== "all" && !isCategoryFilter) {
                queryVendas += " AND ct.status = ?";
                paramsVendas.push(type);
            }

            if (searchTerm) {
                queryVendas += " AND e.nome_fantasia LIKE ?";
                paramsVendas.push(searchTerm);
            }

            const [vendas] = await conexao.execute(queryVendas, paramsVendas);
            resultados.push(...vendas);
        }

        // --------------------------- Ordenação Final ---------------------------

        return resultados.sort((a, b) => new Date(b.data) - new Date(a.data));

    } catch (error) {
        console.error("Erro no repository buscarHistorico:", error);
        throw error;
    }
};


// =================================================
// DASHBOARD DO FORNECEDOR - VERSÃO FINAL OTIMIZADA
// =================================================

// 1. Faturamento no período selecionado (contratos ativos + compras concluídas)
export async function getFaturamentoPeriodoFornecedor(id_fornecedor, dataInicio, dataFim) {
  const sql = `
    SELECT COALESCE(SUM(valor_calculado), 0) AS faturamento
    FROM (
      SELECT (cp.quantidade * cp.preco_unitario) AS valor_calculado
      FROM contratos c
      JOIN contrato_produtos cp ON c.id_contrato = cp.id_contrato
      WHERE c.id_fornecedor = ?
        AND c.status = 'ativo'
        AND c.data_inicio BETWEEN ? AND ?

      UNION ALL

      SELECT (cp.quantidade * cp.preco_unitario) AS valor_calculado
      FROM compras c
      JOIN compra_produtos cp ON c.id_compra = cp.id_compra
      WHERE c.id_fornecedor = ?
        AND c.status IN ('aprovada', 'enviada', 'concluída')
        AND c.data_compra BETWEEN ? AND ?
    ) AS vendas
  `;

  const [rows] = await conexao.execute(sql, [
    id_fornecedor, dataInicio, dataFim,
    id_fornecedor, dataInicio, dataFim
  ]);

  return parseFloat(rows[0].faturamento) || 0;
}

// 2. Faturamento mensal (últimos 12 meses) - com meses completos e zerados
export async function getFaturamentoMensalFornecedor(id_fornecedor) {
  const sql = `
    SELECT 
      DATE_FORMAT(data_ref, '%Y-%m') AS mes,
      COALESCE(SUM(valor_calculado), 0) AS valor
    FROM (
      SELECT c.data_inicio AS data_ref, (cp.quantidade * cp.preco_unitario) AS valor_calculado
      FROM contratos c
      JOIN contrato_produtos cp ON c.id_contrato = cp.id_contrato
      WHERE c.id_fornecedor = ? AND c.status = 'ativo'
        AND c.data_inicio >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)

      UNION ALL

      SELECT c.data_compra AS data_ref, (cp.quantidade * cp.preco_unitario) AS valor_calculado
      FROM compras c
      JOIN compra_produtos cp ON c.id_compra = cp.id_compra
      WHERE c.id_fornecedor = ?
        AND c.status IN ('aprovada', 'enviada', 'concluída')
        AND c.data_compra >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
    ) AS todas_vendas
    GROUP BY YEAR(data_ref), MONTH(data_ref)
    ORDER BY mes
  `;

  const [rows] = await conexao.execute(sql, [id_fornecedor, id_fornecedor]);

  const hoje = new Date();
  const resultado = [];

  for (let i = 11; i >= 0; i--) {
    const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const mesStr = data.toISOString().slice(0, 7);

    const encontrado = rows.find(r => r.mes === mesStr);
    resultado.push({
      mes: mesStr,
      valor: encontrado ? parseFloat(encontrado.valor) : 0
    });
  }

  return resultado;
}

// 3. Métricas rápidas do fornecedor
export async function getMetricasFornecedor(id_fornecedor) {
  const [metricas] = await conexao.execute(`
    SELECT
      (SELECT COUNT(DISTINCT c.id_contrato) FROM contratos c WHERE c.id_fornecedor = ? AND c.status = 'ativo') +
      (SELECT COUNT(DISTINCT c.id_compra) FROM compras c WHERE c.id_fornecedor = ? AND c.status IN ('aprovada', 'enviada', 'concluída')) AS total_pedidos,

      (SELECT COUNT(*) FROM compras WHERE id_fornecedor = ? AND status = 'pendente') AS pedidos_pendentes,

      (SELECT COUNT(DISTINCT id_empresa)
       FROM (
         SELECT c.id_empresa FROM compras c
         WHERE c.id_fornecedor = ? AND c.status IN ('aprovada', 'enviada', 'concluída')
           AND c.data_compra >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
         UNION
         SELECT ct.id_empresa FROM contratos ct
         WHERE ct.id_fornecedor = ? AND ct.status = 'ativo'
           AND ct.data_inicio >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
       ) AS clientes_recentes
      ) AS novos_clientes
  `, [id_fornecedor, id_fornecedor, id_fornecedor, id_fornecedor, id_fornecedor]);

  const m = metricas[0];
  return {
    total_pedidos: Number(m.total_pedidos) || 0,
    pedidos_pendentes: Number(m.pedidos_pendentes) || 0,
    novos_clientes: Number(m.novos_clientes) || 0
  };
}

// 4. Tendência de faturamento (% em relação ao período anterior)
export async function getTendenciaFornecedor(id_fornecedor, dataInicio, dataFim) {
  const inicioAtual = new Date(dataInicio);
  const fimAtual = new Date(dataFim);
  const duracaoMs = fimAtual - inicioAtual;

  const inicioAnterior = new Date(inicioAtual);
  inicioAnterior.setTime(inicioAtual.getTime() - duracaoMs - 1);
  const fimAnterior = new Date(inicioAtual);
  fimAnterior.setTime(inicioAtual.getTime() - 1);

  const formatar = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

  const atual = await getFaturamentoPeriodoFornecedor(id_fornecedor, formatar(inicioAtual), formatar(fimAtual));
  const anterior = await getFaturamentoPeriodoFornecedor(id_fornecedor, formatar(inicioAnterior), formatar(fimAnterior));

  if (anterior === 0) return atual > 0 ? 100.0 : 0.0;

  const tendencia = ((atual - anterior) / anterior) * 100;
  return Math.round(tendencia * 10) / 10;
}

export const dashboardRepository = {
    totalFaturamento(id_fornecedor) {
        return new Promise((resolve, reject) => {
            conexao.query(
                `SELECT SUM(valor_total) AS total FROM pedidos WHERE id_fornecedor = ?`,
                [id_fornecedor],
                (err, result) => err ? reject(err) : resolve(result[0])
            );
        });
    },

    totalPedidos(id_fornecedor) {
        return new Promise((resolve, reject) => {
            conexao.query(
                `SELECT COUNT(*) AS total FROM pedidos WHERE id_fornecedor = ?`,
                [id_fornecedor],
                (err, result) => err ? reject(err) : resolve(result[0])
            );
        });
    },

    totalPendentes(id_fornecedor) {
        return new Promise((resolve, reject) => {
            conexao.query(
                `SELECT COUNT(*) AS total FROM pedidos WHERE status = 'pendente' AND id_fornecedor = ?`,
                [id_fornecedor],
                (err, result) => err ? reject(err) : resolve(result[0])
            );
        });
    },

    totalClientes(id_fornecedor) {
        return new Promise((resolve, reject) => {
            conexao.query(
                `SELECT COUNT(DISTINCT id_cliente) AS total FROM pedidos WHERE id_fornecedor = ?`,
                [id_fornecedor],
                (err, result) => err ? reject(err) : resolve(result[0])
            );
        });
    },

    pedidosRecentes(id_fornecedor) {
        return new Promise((resolve, reject) => {
            conexao.query(
                `SELECT id_pedido AS id, nome_cliente AS customer, data AS date, valor_total AS value, status, tipo AS type 
                 FROM pedidos 
                 WHERE id_fornecedor = ?
                 ORDER BY data DESC LIMIT 10`,
                [id_fornecedor],
                (err, result) => err ? reject(err) : resolve(result)
            );
        });
    },
};  
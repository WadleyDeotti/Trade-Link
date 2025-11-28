//DOTENV
import dotenv from 'dotenv';
dotenv.config();

// repository.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Empresa } from './models/empresaModel.js';
import { Fornecedor } from './models/fornecedorModel.js';
import { Produto } from './models/produtoModel.js';

// 🧩 Cria a conexão SQLite
const conexao = await open({
  filename: './database.db',
  driver: sqlite3.Database
});

// ✅ Teste de conexão
(async () => {
  try {
    await conexao.get("SELECT 1");
    console.log("Conectado ao banco SQLite com sucesso!");
  } catch (err) {
    console.error("Erro ao conectar ao banco:", err);
  }
})();

// ---------------- Funções ----------------
export async function testeUsuario() {
  const rows = await conexao.all("SELECT * FROM fornecedores WHERE id_fornecedor = 5");
  return rows.length > 0 ? new Fornecedor(rows[0]) : null;
}

export async function getProdutos() {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
  `);
  return rows.map(row => new Produto(row));
}

export async function getProdutosPorCategoria(categoria) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE p.categoria = ?
  `, [categoria]);
  return rows.map(row => new Produto(row));
}

export async function getCategorias() {
  const rows = await conexao.all(`
    SELECT DISTINCT categoria
    FROM produtos
    WHERE categoria IS NOT NULL
    ORDER BY categoria
  `);
  return rows.map(row => row.categoria);
}

export async function buscarProdutos(termo, categoria, precoMin, precoMax) {
  let sql = `
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE 1=1
  `;
  const params = [];

  if (termo) {
    sql += ` AND (p.nome_produto LIKE ? OR p.descricao LIKE ?)`;
    params.push(`%${termo}%`, `%${termo}%`);
  }

  if (categoria) {
    sql += ` AND p.categoria = ?`;
    params.push(categoria);
  }

  if (precoMin) {
    sql += ` AND p.preco >= ?`;
    params.push(precoMin);
  }

  if (precoMax) {
    sql += ` AND p.preco <= ?`;
    params.push(precoMax);
  }

  sql += ` ORDER BY p.nome_produto`;

  const rows = await conexao.all(sql, params);
  return rows.map(row => new Produto(row));
}

export async function buscarProdutoPorId(id_produto) {
  const row = await conexao.get(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria,
           f.nome_fantasia, f.telefone, f.email
    FROM produtos p
    JOIN fornecedores f ON p.id_fornecedor = f.id_fornecedor
    WHERE p.id_produto = ?
  `, [id_produto]);
  return row ? new Produto(row) : null;
}

export async function buscarProdutosRelacionados(categoria, id_produto_atual) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.nome_produto, p.preco, p.categoria
    FROM produtos p
    WHERE p.categoria = ? AND p.id_produto != ? AND p.disponivel = 1
    ORDER BY RANDOM()
    LIMIT 3
  `, [categoria, id_produto_atual]);
  return rows.map(row => new Produto(row));
}

export async function buscarProdutosPorFornecedor(id_fornecedor) {
  const rows = await conexao.all(`
    SELECT p.id_produto, p.id_fornecedor, p.nome_produto, p.descricao, p.preco, p.disponivel, p.categoria
    FROM produtos p
    WHERE p.id_fornecedor = ?
    ORDER BY p.nome_produto
  `, [id_fornecedor]);
  return rows.map(row => new Produto(row));
}

export async function getFornecedor() {
  const rows = await conexao.all("SELECT * FROM fornecedores");
  return rows.map(row => new Fornecedor(row));
}

export async function buscarCNPJ(cnpj) {
  const row = await conexao.get(
    "SELECT * FROM empresas WHERE cnpj = ?",
    [cnpj]
  );
  return row ? new Empresa(row) : null;
}

export async function buscarCPF(cpf) {
  const row = await conexao.get(
    "SELECT * FROM fornecedores WHERE cpf = ?",
    [cpf]
  );
  return row ? new Fornecedor(row) : null;
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
  const resultado = await conexao.run(sql, values);
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
  const resultado = await conexao.run(sql, values);
  return resultado;
}

// Atualizar senha
export async function updateSenhaEmpresa({ senha_hash, id_empresa }) {
  const sql = "UPDATE empresas SET senha_hash = ? WHERE id_empresa = ?";
  const resultado = await conexao.run(sql, [senha_hash, id_empresa]);
  return resultado;
}

export async function updateSenhaFornecedor({ senha_hash, id_fornecedor }) {
  const sql = "UPDATE fornecedores SET senha_hash = ? WHERE id_fornecedor = ?";
  const resultado = await conexao.run(sql, [senha_hash, id_fornecedor]);
  return resultado;
}

// Buscar senha
export async function buscarSenhaEmpresa(id_empresa) {
  const sql = "SELECT senha_hash FROM empresas WHERE id_empresa = ?";
  const row = await conexao.get(sql, [id_empresa]);
  return row ? row.senha_hash : null;
}

export async function buscarSenhaFornecedor(id_fornecedor) {
  const sql = "SELECT senha_hash FROM fornecedores WHERE id_fornecedor = ?";
  const row = await conexao.get(sql, [id_fornecedor]);
  return row ? row.senha_hash : null;
}

// Buscar por ID
export async function buscarEmpresaPorId(id_empresa) {
  const sql = "SELECT * FROM empresas WHERE id_empresa = ?";
  const row = await conexao.get(sql, [id_empresa]);
  return row ? new Empresa(row) : null;
}

export async function buscarFornecedorPorId(id_fornecedor) {
  const sql = "SELECT * FROM fornecedores WHERE id_fornecedor = ?";
  const row = await conexao.get(sql, [id_fornecedor]);
  return row ? new Fornecedor(row) : null;
}

// Inserções
export async function inserirEmpresa({ nome_fantasia, cnpj, email, senha_hash }) {
  const sql = "INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash) VALUES (?,?,?,?)";
  const resultado = await conexao.run(sql, [nome_fantasia, cnpj, email, senha_hash]);
  return resultado;
}

export async function inserirFornecedor({ nome_fantasia, cpf, email, senha_hash }) {
  const sql = "INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash) VALUES (?,?,?,?)";
  const resultado = await conexao.run(sql, [nome_fantasia, cpf, email, senha_hash]);
  return resultado;
}

// Atualizar dados gerais
export async function atualizarFornecedor({ id_fornecedor, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE fornecedores SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_fornecedor = ?";
  const resultado = await conexao.run(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_fornecedor]);
  return resultado;
}

export async function atualizarEmpresa({ id_empresa, nome_fantasia, email, localizacao, telefone, descricao }) {
  const sql = "UPDATE empresas SET nome_fantasia = ?, email = ?, localizacao = ?, telefone = ?, descricao = ? WHERE id_empresa = ?";
  const resultado = await conexao.run(sql, [nome_fantasia, email, localizacao, telefone, descricao, id_empresa]);
  return resultado;
}

// Cadastrar produto
export async function cadastrarProduto({ id_fornecedor, nome_produto, descricao, preco, categoria }) {
  const sql = "INSERT INTO produtos (id_fornecedor, nome_produto, descricao, preco, categoria) VALUES (?,?,?,?,?)";
  const resultado = await conexao.run(sql, [id_fornecedor, nome_produto, descricao, preco, categoria]);
  return resultado;
}

export async function editarProduto(id_produto, { nome_produto, descricao, preco, categoria }) {
  const sql = "UPDATE produtos SET nome_produto = ?, descricao = ?, preco = ?, categoria = ? WHERE id_produto = ?";
  const resultado = await conexao.run(sql, [nome_produto, descricao, preco, categoria, id_produto]);
  return resultado;
}

export async function inserirProduto(produto) {
  const sql = `
    INSERT INTO produtos (
      id_fornecedor,
      nome_produto,
      preco,
      descricao,
      disponivel,
      categoria
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

  const valores = [
    produto.id_fornecedor,
    produto.nome_produto,
    produto.preco,
    produto.descricao,
    produto.disponivel,
    produto.categoria
  ];

  const resultado = await conexao.run(sql, valores);
  return resultado;
}

export async function updateProdutos(dados) {
  const sql = `
    UPDATE produtos SET
      nome_produto = ?,
      preco = ?,
      descricao = ?,
      categoria = ?
    WHERE id_produto = ?
  `;

  const values = [
    dados.nome_produto,
    dados.preco,
    dados.descricao,
    dados.categoria,
    dados.id_produto
  ];

  console.log('📦 Dados recebidos no repository:', dados);

  const resultado = await conexao.run(sql, values);
  console.log('🧾 Resultado do UPDATE:', resultado);

  return resultado;
}

export async function deleteProduto(id_produto) {
  const sql = `
    DELETE FROM produtos
    WHERE id_produto = ?
  `;

  const values = [id_produto];

  console.log('🗑️ ID recebido para exclusão:', id_produto);

  const resultado = await conexao.run(sql, values);
  console.log('🧾 Resultado do DELETE:', resultado);

  return resultado;
}

// ========== CONVERSAS ==========

export async function buscarOuCriarConversa(usuario1, usuario2, tipo1, tipo2) {
    try {
        const sql = `
            SELECT * FROM conversas 
            WHERE (usuario1_id = ? AND usuario2_id = ?)
            OR (usuario1_id = ? AND usuario2_id = ?)
        `;

        const rows = await conexao.all(sql, [
            usuario1, usuario2,
            usuario2, usuario1
        ]);

        if (rows.length > 0) return rows[0];

        const insert = `
            INSERT INTO conversas (usuario1_id, usuario2_id, tipo1, tipo2)
            VALUES (?, ?, ?, ?)
        `;

        const result = await conexao.run(insert, [
            usuario1, usuario2,
            tipo1, tipo2
        ]);

        return {
            id_conversa: result.lastID,
            usuario1_id: usuario1,
            usuario2_id: usuario2,
            tipo1,
            tipo2
        };
    } catch (error) {
        console.error('Erro ao buscar ou criar conversa:', error);
        throw error;
    }
}

export async function listarConversasDoUsuario(id_usuario) {
    try {
        const sql = `
            SELECT c.*,
                (SELECT conteudo FROM mensagens 
                  WHERE id_conversa = c.id_conversa 
                  ORDER BY id_mensagem DESC LIMIT 1) AS ultima_msg,

                (SELECT COUNT(*) FROM mensagens 
                  WHERE id_conversa = c.id_conversa 
                  AND lida = 0
                  AND remetente_id != ?) AS nao_lidas,

                COALESCE(f1.nome_fantasia, e1.nome_fantasia, f2.nome_fantasia, e2.nome_fantasia) AS nome_contato

            FROM conversas c
            LEFT JOIN fornecedores f1 ON (c.usuario1_id != ? AND c.usuario1_id = f1.id_fornecedor AND c.tipo1 = 'fornecedor')
            LEFT JOIN empresas e1 ON (c.usuario1_id != ? AND c.usuario1_id = e1.id_empresa AND c.tipo1 = 'empresa')
            LEFT JOIN fornecedores f2 ON (c.usuario2_id != ? AND c.usuario2_id = f2.id_fornecedor AND c.tipo2 = 'fornecedor')
            LEFT JOIN empresas e2 ON (c.usuario2_id != ? AND c.usuario2_id = e2.id_empresa AND c.tipo2 = 'empresa')
            WHERE c.usuario1_id = ? OR c.usuario2_id = ?
            ORDER BY c.criado_em DESC
        `;

        const rows = await conexao.all(sql, [
            id_usuario,
            id_usuario,
            id_usuario,
            id_usuario,
            id_usuario,
            id_usuario,
            id_usuario
        ]);

        console.log('Conversas encontradas:', rows);
        return rows;
    } catch (error) {
        console.error('Erro ao listar conversas:', error);
        throw error;
    }
}

// ========== MENSAGENS ==========

export async function salvarMensagem(id_conversa, remetente_id, tipo_remetente, conteudo) {
    try {
        const sql = `
            INSERT INTO mensagens (id_conversa, remetente_id, tipo_remetente, conteudo)
            VALUES (?, ?, ?, ?)
        `;

        const result = await conexao.run(sql, [
            id_conversa,
            remetente_id,
            tipo_remetente,
            conteudo
        ]);

        return result.lastID;
    } catch (error) {
        console.error('Erro ao salvar mensagem:', error);
        throw error;
    }
}

export async function listarMensagens(id_conversa) {
    try {
        const sql = `
            SELECT *
            FROM mensagens
            WHERE id_conversa = ?
            ORDER BY enviado_em ASC
        `;

        const rows = await conexao.all(sql, [id_conversa]);
        return rows;
    } catch (error) {
        console.error('Erro ao listar mensagens:', error);
        throw error;
    }
}

export async function marcarLidas(id_conversa, usuario_id) {
    try {
        const sql = `
            UPDATE mensagens
            SET lida = 1
            WHERE id_conversa = ?
              AND remetente_id != ?
        `;

        await conexao.run(sql, [id_conversa, usuario_id]);
    } catch (error) {
        console.error('Erro ao marcar mensagens como lidas:', error);
        throw error;
    }
}

// ------------------- Funções de token -------------------
export async function salvarTokenE(empresa) {
  const sql = 'UPDATE empresas SET token_redefinicao=?, expira_token=? WHERE cnpj=?';
  const resultado = await conexao.run(sql, [empresa.token_redefinicao, empresa.expira_token, empresa.cnpj]);
  return resultado;
}

export async function salvarTokenF(fornecedor) {
  const sql = 'UPDATE fornecedores SET token_redefinicao=?, expira_token=? WHERE cpf=?';
  const resultado = await conexao.run(sql, [fornecedor.token_redefinicao, fornecedor.expira_token, fornecedor.cpf]);
  return resultado;
}

export async function procurarTokenE(token) {
  const sql = 'SELECT * FROM empresas WHERE token_redefinicao=?';
  const row = await conexao.get(sql, [token]);
  return row || null;
}

export async function procurarTokenF(token) {
  const sql = 'SELECT * FROM fornecedores WHERE token_redefinicao=?';
  const row = await conexao.get(sql, [token]);
  return row || null;
}

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
                queryCompras += " AND strftime('%Y', c.data_compra) = ?";
                paramsCompras.push(year.toString());
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

            const compras = await conexao.all(queryCompras, paramsCompras);
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
                queryVendas += " AND strftime('%Y', ct.data_inicio) = ?";
                paramsVendas.push(year.toString());
            }

            if (type && type !== "all" && !isCategoryFilter) {
                queryVendas += " AND ct.status = ?";
                paramsVendas.push(type);
            }

            if (searchTerm) {
                queryVendas += " AND e.nome_fantasia LIKE ?";
                paramsVendas.push(searchTerm);
            }

            const vendas = await conexao.all(queryVendas, paramsVendas);
            resultados.push(...vendas);
        }

        // --------------------------- Ordenação Final ---------------------------

        return resultados.sort((a, b) => new Date(b.data) - new Date(a.data));

    } catch (error) {
        console.error("Erro no repository buscarHistorico:", error);
        throw error;
    }
};
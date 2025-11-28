// routes/usuarioRoutes.js
import express from "express";
import * as usuarioController from "../controllers/usuarioController.js";
import * as configController from "../controllers/configController.js";
import * as loginController from "../controllers/loginController.js";
import * as inicialController from "../controllers/inicialController.js";
import * as categoriaController from "../controllers/categoriaController.js";
import * as produtoController from "../controllers/produtoController.js";
import * as historicoController from "../controllers/historicoController.js";
import MessageController from "../controllers/MessageController.js";
import { sendMessage } from "../controllers/chatController.js"; // usar .js com ES Module
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

// ------------------- GETs -------------------
// Página inicial pública
router.get('/inicial', inicialController.IniciarSite);

// Login e Registro (públicas)  
router.get("/registro", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("registro", { mensagem: mensagem || null });
});

router.get("/login", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("login", { mensagem: mensagem || null });
});

// ---------------- ROTAS PROTEGIDAS ----------------

// Dashboard
router.get("/dashboard", autenticar, (req, res) => res.render("dashboard"));

// Fornecedores
router.get("/fornecedores", autenticar, (req, res) =>
  res.renderizador.render(res, "fornecedores", {})
);

// Pedidos e Vendas
router.get("/pedidos", autenticar, (req, res) => res.render("pedidos"));

// Histórico (páginas + API)
router.get("/historico", autenticar, (req, res) => res.render("historico"));
router.get("/api/historico", autenticar, historicoController.getHistorico);
router.get("/api/historico/resumo", autenticar, historicoController.getResumo);
router.get("/api/historico/grafico", autenticar, historicoController.getGrafico);

// Mensagens
router.get("/mensagens", autenticar, (req, res) => {
  res.render("mensagens", { usuario: req.session.usuario });
});

// Configurações
router.get("/configuracoes", autenticar, (req, res) =>
  res.renderizador.render(res, "configuracoes", {})
);

// Categorias
router.get("/categoria", autenticar, (req, res) => {
  if (req.query.categoria) {
    return categoriaController.getCategoriasPage(req, res);
  }
  res.renderizador.render(res, 'categoria', { produtos: [], categorias: [], categoriaAtual: 'eletronicos' });
});
router.get("/api/produtos/buscar", autenticar, categoriaController.buscarProdutos);
router.get("/api/categoria/:categoria", autenticar, categoriaController.getCategoriasProdutos);

// Produtos
router.get("/produto", autenticar, (req, res) => res.renderizador.render(res, 'produto', { produto: null, produtosRelacionados: [], produtos: [] }));
router.get("/produto/:id", autenticar, produtoController.getProdutoPage);
router.get("/produtos", autenticar, produtoController.getListaProdutos);

// Chat
router.get("/chat", autenticar, (req, res) => res.render("chat"));

// API do usuário atual
router.get("/api/usuario-atual", autenticar, (req, res) => {
  res.json(req.session.usuario);
});

// API para listar contatos (empresas e fornecedores)
router.get("/api/contatos", autenticar, async (req, res) => {
  try {
    const { getFornecedor, buscarEmpresaPorId } = await import("../Repository.js");
    
    // Buscar fornecedores
    const fornecedores = await getFornecedor();
    
    // Buscar empresas (você pode precisar criar uma função similar no Repository)
    const empresas = []; // Por enquanto vazio, você pode implementar depois
    
    const contatos = [
      ...fornecedores.map(f => ({ ...f, tipo: 'fornecedor' })),
      ...empresas.map(e => ({ ...e, tipo: 'empresa' }))
    ];
    
    res.json(contatos);
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    res.status(500).json({ error: "Erro ao buscar contatos" });
  }
});

// Conversas e mensagens (API)
router.get("/listar-conversas/:id_usuario", autenticar, MessageController.listarConversas);
router.get("/listar-mensagens/:id_conversa", autenticar, MessageController.listarMensagens);

// Criar nova conversa
router.post("/criar-conversa", autenticar, async (req, res) => {
  try {
    const { buscarOuCriarConversa } = await import("../Repository.js");
    const usuario = req.session.usuario;
    const usuario1 = usuario.id_fornecedor || usuario.id_empresa;
    const tipo1 = usuario.id_fornecedor ? 'fornecedor' : 'empresa';
    const { usuario2, tipo2 } = req.body;
    
    const conversa = await buscarOuCriarConversa(usuario1, usuario2, tipo1, tipo2);
    res.json(conversa);
  } catch (error) {
    console.error("Erro ao criar conversa:", error);
    res.status(500).json({ error: "Erro ao criar conversa" });
  }
});

// ------------------- POSTs (PROTEGIDOS) -------------------

// Mensagem chat
router.post("/send", autenticar, sendMessage);

// Alterar senha
router.post("/alterarSenha", autenticar, usuarioController.alterarSenha);

// Salvar configurações
router.post("/salvarConfiguracoes", autenticar, configController.salvarConfiguracoes);

// Atualizar dados
router.post("/updateDados", autenticar, usuarioController.updateDados);

// Cadastrar produto
router.post("/cadastrarProduto", autenticar, produtoController.cadastrarProduto);

// Editar produto
router.post("/editarProduto/:id", autenticar, produtoController.editarProduto);

// API para buscar produto (JSON)
router.get("/api/produto/:id", autenticar, produtoController.buscarProduto);

// Buscar produtos do fornecedor
router.get("/produtos/fornecedor/:id", autenticar, produtoController.buscarProdutosFornecedor);

// Excluir produto
router.post("/excluirProduto/:id", autenticar, produtoController.excluirProduto);

// enviar mensagem no chat
router.post("/enviar", autenticar, MessageController.enviar);

// salvar mensagem no chat
router.post("/salvar-mensagem", autenticar, MessageController.salvarMensagemChat);

// ------------------- POSTs PÚBLICAS -------------------
// Cadastro
router.post("/cadastrar", loginController.cadastrar);

// Login
router.post("/logar", loginController.logar);

export default router;
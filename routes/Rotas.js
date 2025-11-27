// routes/usuarioRoutes.js
import express from "express";
import * as configuracoesController from "../controllers/configuracoesController.js";
import * as loginController from "../controllers/loginController.js";
import * as inicialController from "../controllers/inicialController.js";
import * as categoriaController from "../controllers/categoriaController.js";
import * as produtoController from "../controllers/produtoController.js";
import * as historicoController from "../controllers/historicoController.js";
import MessageController from "../controllers/MessageController.js";
<<<<<<< Updated upstream
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
router.get("/mensagens", autenticar, (req, res) => res.render("mensagens"));

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

// Conversas e mensagens (API)
router.get("/listar-conversas/:id_usuario", autenticar, MessageController.listarConversas);
router.get("/listar-mensagens/:id_conversa", autenticar, MessageController.listarMensagens);

// ------------------- POSTs (PROTEGIDOS) -------------------

// Mensagem chat
router.post("/send", autenticar, sendMessage);

// Alterar senha
router.post("/alterarSenha", autenticar, configuracoesController.alterarSenha);

// Salvar configurações
router.post("/salvarConfiguracoes", autenticar, configuracoesController.salvarConfiguracoes);

// Atualizar dados
router.post("/updateDados", autenticar, configuracoesController.updateDados);

// Cadastrar produto
router.post("/cadastrarProduto", autenticar, configuracoesController.cadastrarProduto);

// enviar mensagem no chat
router.post("/enviar", autenticar, MessageController.enviar);

// ------------------- POSTs PÚBLICAS -------------------
// Cadastro
router.post("/cadastrar", loginController.cadastrar);

// Login
router.post("/logar", loginController.logar);

export default router;
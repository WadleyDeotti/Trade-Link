// routes/usuarioRoutes.js
import express from "express";
import * as configuracoesController from "../controllers/configuracoesController.js";
import * as loginController from "../controllers/loginController.js";
import * as inicialController from "../controllers/inicialController.js";
import * as categoriaController from "../controllers/categoriaController.js";
import MessageController from "../controllers/MessageController.js";
import { sendMessage } from "../controllers/chatController.js";
import * as historicoController from "../controllers/historicoController.js";
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

router.get("/categoria", autenticar, (req, res) => res.render("categoria"));

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
// routes/usuarioRoutes.js
import express from "express";
import * as configuracoesController from "../controllers/configuracoesController.js";
import * as loginController from "../controllers/loginController.js";
import * as inicialController from "../controllers/inicialController.js";
import { sendMessage } from "../controllers/chatController.js"; // usar .js com ES Module
const router = express.Router();

// ------------------- GETs -------------------
// Inicial
router.get('/inicial', inicialController.IniciarSite);

// Dashboard
router.get("/dashboard", (req, res) => res.render("dashboard"));

// Registro
router.get("/registro", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("registro", { mensagem: mensagem || null });
});

// Login
router.get("/login", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("login", { mensagem: mensagem || null });
});

// Fornecedores
router.get("/fornecedores", (req, res) => res.renderizador.render(res, 'fornecedores', {}));

// Pedidos e Vendas
router.get("/pedidos", (req, res) => res.render("pedidos"));

// Histórico
router.get("/historico", (req, res) => res.render("historico"));

// Mensagens
router.get("/mensagens", (req, res) => res.render("mensagens"));

// Configurações
router.get("/configuracoes", (req, res) => res.renderizador.render(res, 'configuracoes', {}));

router.get("/categoria", (req, res) => res.render("categoria"));

router.get("/chat", (req, res) => res.render("chat"));

// ------------------- POSTs -------------------
//Mensagem chat
router.post("/send", sendMessage);

// Cadastro
router.post("/cadastrar", loginController.cadastrar);

// Login
router.post("/logar", loginController.logar);

// Alterar senha
router.post("/alterarSenha", configuracoesController.alterarSenha);

// Salvar configurações
router.post("/salvarConfiguracoes", configuracoesController.salvarConfiguracoes);

// Atualizar dados
router.post("/updateDados", configuracoesController.updateDados);

// Cadastrar produto
router.post("/cadastrarProduto", configuracoesController.cadastrarProduto);

export default router;

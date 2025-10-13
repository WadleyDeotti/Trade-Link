const express = require("express");
const router = express.Router();
const configuracoesController = require("../controllers/configuracoesController");

// ------------------- GETs -------------------
router.get("/", (req, res) => res.render("configuracoes"));

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
router.get("/fornecedores", (req, res) => res.render("fornecedores"));

// Pedidos e Vendas
router.get("/pedidos", (req, res) => res.render("pedidos"));

// Histórico
router.get("/historico", (req, res) => res.render("historico"));

// Mensagens
router.get("/mensagens", (req, res) => res.render("mensagens"));

// Configurações
router.get("/configuracoes", (req, res) => res.render("configuracoes"));

// ------------------- POSTs -------------------
// Cadastro
router.post("/cadastrar", configuracoesController.cadastrar);

// // Login
router.post("/logar", configuracoesController.logar);

//alterar senha
router.post("/alterarSenha", configuracoesController.alterarSenha);

//salvar configurações
router.post("/salvarConfiguracoes", configuracoesController.salvarConfiguracoes);

module.exports = router;

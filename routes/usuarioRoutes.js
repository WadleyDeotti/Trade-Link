const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");


// ------------------- GETs -------------------
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
//alterações italo
router.get("/", historicoController.getHistorico);
router.get("/resumo", historicoController.getResumo);
router.get("/grafico", historicoController.getGrafico);
router.get('/', historicoController.listarHistorico);

// Mensagens
router.get("/mensagens", (req, res) => res.render("mensagens"));

// Configurações
router.get("/configuracoes", (req, res) => res.render("configuracoes"));

// ------------------- POSTs -------------------
// Cadastro
router.post("/registro", loginController.cadastrar);

// Login
router.post("/login", loginController.logar);

module.exports = router;
const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const historicoController = require("../controllers/historicoController");
const produtoController = require('../controllers/produtoController');

// ------------------- GETs -------------------
// Dashboard
router.get("/dashboard", (req, res) => res.render("dashboard"));

// Registro
router.get("/registro", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem; 
  res.render("registro", { mensagem: mensagem || null });
});

//Produto
router.get('/produto/:id', produtoController.getProdutoPage);
router.get("/produto", produtoController.getListaProdutos);

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
router.get("/api/historico", historicoController.getHistorico);
router.get("/api/historico/resumo", historicoController.getResumo);
router.get("/api/historico/grafico", historicoController.getGrafico);


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
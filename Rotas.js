const express = require("express");
const router = express.Router();
const configuracoesController = require("./controllers/configuracoesController");
const loginController = require("./controllers/loginController");
const repository = require('./Repository');
const inicialController = require("./controllers/inicialController");

// ------------------- GETs -------------------
//router.get("/",inicialController.IniciarSite);

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

//inicial 
router.get("/inicial", (req, res) => {
  const produtos = repository.getProdutos();
  const fornecedor = repository.getFornecedor();
  res.render("inicial", { produtos, fornecedor });
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
router.get("/configuracoes", (req, res) => res.renderizador.render(res, "configuracoes",{}));

// ------------------- POSTs -------------------
// Cadastro
router.post("/cadastrar", loginController.cadastrar);

// // Login
router.post("/logar", loginController.logar);

//alterar senha
router.post("/alterarSenha", configuracoesController.alterarSenha);

//salvar configurações
router.post("/salvarConfiguracoes", configuracoesController.salvarConfiguracoes);

router.post("/alterarFornecedor", configuracoesController.alterarFornecedor);

module.exports = router;

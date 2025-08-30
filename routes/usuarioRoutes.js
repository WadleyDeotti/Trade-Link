const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// GETs
router.get("/configuracoes", (req, res) => res.render("configuracoes"));
router.get("/registro", (req, res) => res.render("registro"));
router.get("/login", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem; 
  res.render("login", { mensagem: mensagem || null });
});
router.get("/fornecedores", (req, res) => res.render("fornecedores"));
router.get("/redefinirSenha", (req, res) => res.render("redefinirSenha"));

// POSTs
router.post("/registro", loginController.cadastrar); // era /cadastro
router.post("/login", loginController.logar);
router.post("/redefinirSenha", loginController.redefinirSenha); // corrigido
router.post("/atualizarSenha/:token", loginController.atualizarSenha); // token via URL

module.exports = router;

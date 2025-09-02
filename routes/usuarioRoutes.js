const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// --- GETs ---

router.get("/login", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("login", { mensagem: mensagem || null });
});

router.get("/registro", (req, res) => {
  const mensagem = req.session.mensagem;
  delete req.session.mensagem;
  res.render("registro", { mensagem: mensagem || null });
});
router.get("/fornecedores", (req, res) => res.render("fornecedores"));
router.get("/empresa/dashboard", (req, res) => res.render("empresa"));
router.get("/fornecedor/dashboard", (req, res) => res.render("fornecedores"));
router.get("/redefinirSenha", (req, res) => res.render("redefinirSenha"));
router.get("/resetarSenha/:token", loginController.formResetarSenha);

// --- POSTs ---
router.post("/registro", loginController.cadastrar);
router.post("/login", loginController.logar);
router.post("/redefinirSenha", loginController.redefinirSenha);
router.post("/atualizarSenha/:token", loginController.resetarSenha);

module.exports = router;

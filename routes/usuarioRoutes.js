const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");

// GETs
router.get("/configuracoes", (req, res) => res.render("configuracoes"));
router.get("/registro", (req, res) => res.render("registro"));
router.get("/login", (req, res) => {
  const erro = req.session.erro;
  delete req.session.erro; 
  res.render("login", { erro: erro || null });
});
router.get("/fornecedores",(req,res)=>res.render("fornecedores"));

// POSTs
router.post("/cadastro", loginController.cadastrar);
router.post("/login", loginController.logar);



module.exports = router;

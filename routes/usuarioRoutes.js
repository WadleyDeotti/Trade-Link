// routes/usuarioRoutes.js
import express from "express";
import loginController from "../controllers/loginController.js"; // também precisa ser ES Module

const router = express.Router();

// ------------------- GETs -------------------
router.get("/", (req, res) => res.render("dashboard"));
router.get("/dashboard", (req, res) => res.render("dashboard"));
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
router.get("/fornecedores", (req, res) => res.render("fornecedores"));
router.get("/pedidos", (req, res) => res.render("pedidos"));
router.get("/historico", (req, res) => res.render("historico"));
router.get("/mensagens", (req, res) => res.render("mensagens"));
router.get("/configuracoes", (req, res) => res.render("configuracoes"));

// ------------------- POSTs -------------------
router.post("/registro", loginController.cadastrar);
router.post("/login", loginController.logar);

// Exporta como ES Module
export default router;

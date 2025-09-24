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



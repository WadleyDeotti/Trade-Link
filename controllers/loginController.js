// controllers/loginController.js
import * as repository from "../Repository.js";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// ================================
// CONFIGURAÇÃO DO TRANSPORTER (EMAIL)
// ================================
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_SECURE === "TRUE", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// ================================
// FUNÇÃO GERADORA DO CÓDIGO
// ================================
function gerarCodigo2FA() {
  return Math.floor(100000 + Math.random() * 900000); // 6 dígitos
}

// ================================
// CADASTRAR (CPF / CNPJ)
// ================================
export const cadastrar = async (req, res) => {
  try {
    const dadosUsuario = req.body;

    const senhaHash = await bcrypt.hash(dadosUsuario.senha, 10);

    if (dadosUsuario.cnpj) {
      await repository.inserirEmpresa({
        nome_fantasia: dadosUsuario.nome_completo,
        email: dadosUsuario.email,
        cnpj: dadosUsuario.cnpj.replace(/\D/g, ""),
        senha_hash: senhaHash,
      });

      const empresa = await repository.buscarCNPJ(dadosUsuario.cnpj.replace(/\D/g, ""));
      req.session.usuario = empresa;
      return res.redirect("/fornecedores");
    }

    if (dadosUsuario.cpf) {
      await repository.inserirFornecedor({
        nome_fantasia: dadosUsuario.nome_completo,
        cpf: dadosUsuario.cpf.replace(/\D/g, ""),
        email: dadosUsuario.email,
        senha_hash: senhaHash,
      });

      const fornecedor = await repository.buscarCPF(dadosUsuario.cpf.replace(/\D/g, ""));
      req.session.usuario = fornecedor;
      return res.redirect("/fornecedores");
    }

    return res.status(400).send("Dados inválidos");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Erro ao cadastrar usuário");
  }
};

// ================================
// LOGIN – INICIA 2FA
// ================================
export const logar = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: "Email e senha são obrigatórios" });
    }

    if (!user) return res.render("login", { mensagem: "Usuário não encontrado" });

    const mesmaSenha = await bcrypt.compare(senha, user.senha_hash);
    if (!mesmaSenha) return res.render("login", { mensagem: "Senha incorreta" });

    req.session.usuario = user;
    return res.redirect("/fornecedores");

  } catch (err) {
    console.error(err);
    return res.status(500).render("login", { mensagem: "Erro no servidor" });
  }
};


// Função auxiliar para gerar o código 2FA
function gerarCodigo2FA() {
  return Math.floor(100000 + Math.random() * 900000); // 6 dígitos
}

export const validar2FA = (req, res) => {
  const { codigoDigitado } = req.body;

  if (!req.session.codigo2FA) {
    return res.status(400).json({ erro: "Nenhum código pendente." });
  }

  const { codigo, expira, userId } = req.session.codigo2FA;

  if (Date.now() > expira) {
    delete req.session.codigo2FA;
    return res.status(400).json({ erro: "Código expirado." });
  }

  if (String(codigoDigitado) !== String(codigo)) {
    return res.status(400).json({ erro: "Código incorreto." });
  }

  // Sucesso
  req.session.usuario = { id: userId };
  delete req.session.codigo2FA;

  return res.json({ sucesso: true, mensagem: "Login concluído!" });
};

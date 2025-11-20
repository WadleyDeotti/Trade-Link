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

    const usuario = await repository.buscarPorEmail(email);
    if (!usuario) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaOk = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaOk) {
      return res.status(400).json({ erro: "Senha incorreta" });
    }

    // Gera o código 2FA
    const codigo = gerarCodigo2FA();

    req.session.codigo2FA = {
      userId: usuario.id,
      codigo,
      expira: Date.now() + 5 * 60 * 1000, // 5 min
    };

    // Envia E-MAIL com o código
    await transporter.sendMail({
      to: usuario.email,
      from: process.env.SMTP_FROM || "NO-REPLY@SISTEMA.COM",
      subject: "Seu código de verificação (2FA)",
      text: `Seu código é: ${codigo}\nEle expira em 5 minutos.`,
    });

    return res.json({ etapa: "2FA_REQUIRED" });
  } catch (erro) {
    console.error("Erro no login:", erro);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
};

// ================================
// VALIDAÇÃO DO 2FA
// ================================
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

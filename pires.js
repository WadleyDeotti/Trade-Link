// pires.js
import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";

// Imports locais
import repository from "./Repository.js";
import Rotas from "./Rotas.js";

// Decorators
import Renderizador from "./utils/Renderizador.js";
import UsuarioDecorator from "./utils/usuarioDecorator.js";
import ProdutoDecorator from "./utils/produtoDecorator.js";
import FornecedorDecorator from "./utils/fornecedoresDecorator.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuração do EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware para formulários
app.use(express.urlencoded({ extended: true }));

// Sessão
app.use(
  session({
    secret: "chave-secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 },
  })
);

// Configuração de renderizador com decorators
let renderizador = new Renderizador();
renderizador = new UsuarioDecorator(renderizador);
renderizador = new ProdutoDecorator(renderizador);
renderizador = new FornecedorDecorator(renderizador);

app.use((req, res, next) => {
  res.renderizador = renderizador;
  next();
});

// Arquivos estáticos
app.use(express.static(path.join(__dirname, "public")));

// Rota principal
app.get("/", async (req, res) => {
  req.session.usuario = await repository.testeUsuario();
  const usuario = req.session.usuario;
  res.render("fornecedores", { usuario });
});

// Rotas
app.use("/", Rotas);

// Página não encontrada
app.use((req, res) => {
  res.status(404).send("Página não encontrada");
});

// Tratamento de erros gerais
app.use((err, req, res, next) => {
  console.error(err.stack);
  if (process.env.NODE_ENV === "development") {
    res.status(500).send(`<pre>${err.stack}</pre>`);
  } else {
    res.status(500).send("Erro interno do servidor");
  }
});

// Inicialização
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log("Pressione Ctrl+C para encerrar o servidor.");
  console.log("wallahi im cooking");
});

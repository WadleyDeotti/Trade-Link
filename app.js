import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import chatRoutes from "./routes/chatRoutes.js";
import usuarioRoutes from "./routes/usuarioRoutes.js";

dotenv.config();

console.log("Chave carregada?", process.env.OPENAI_API_KEY ? "Sim" : "Não");


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }
}));
app.use(express.static(path.join(__dirname, "public")));

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Rotas
app.use("/chat", chatRoutes);
app.use("/", usuarioRoutes);

// 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
});

// Porta
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

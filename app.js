// app.js
import express from "express";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";

// Importa rotas
import Rotas from './routes/Rotas.js';

// Decorators
import Renderizador from "./utils/Renderizador.js";
import UsuarioDecorator from "./utils/usuarioDecorator.js";
import ProdutoDecorator from "./utils/produtoDecorator.js";
import FornecedorDecorator from "./utils/fornecedoresDecorator.js";
import { testeUsuario } from "./Repository.js";
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
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 } // 10 anos
}));

// Configuração de renderizador com decorators

let renderizador = new Renderizador();
renderizador = new UsuarioDecorator(renderizador);
renderizador = new ProdutoDecorator(renderizador);
renderizador = new FornecedorDecorator(renderizador);

app.use((req, res, next) => {
  res.renderizador = renderizador;
  next();
});

// Configuração de views
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rota principal
// app.get('/', (req, res) => {
//   if (req.session.usuario) {
//     res.renderizador.render(res, 'fornecedores', {});
//   }
//   else { res.redirect('/login'); }
// });

app.get('/', async (req, res) => {
  req.session.usuario = await testeUsuario(); // Simula usuário logador
  res.renderizador.render(res, 'inicial', {});
});

// Rotas da aplicação
app.use('/', Rotas);

// 404
app.use((req, res) => {
  res.status(404).send('Página não encontrada');
});

// Erro interno
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Erro interno do servidor');
});

// Inicia servidor
const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar o servidor.');
  console.log('wallahi im cooking');
});

const express = require("express");
const path = require("path");
const session = require("express-session")
const app = express();
const repository = require('./Repository.js');
const Rotas = require('./Rotas');

const Renderizador = require('./utils/Renderizador.js');
const UsuarioDecorator = require('./utils/UsuarioDecorator.js');
const ProdutoDecorator = require('./utils/produtoDecorator.js');
const FornecedorDecorator = require('./utils/fornecedoresDecorator.js');

let renderizador = new Renderizador();
renderizador = new UsuarioDecorator(renderizador);
renderizador = new ProdutoDecorator(renderizador);
renderizador = new FornecedorDecorator(renderizador);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }
}));

app.use((req, res, next) => {
  res.renderizador = renderizador;
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  const usuario = await repository.testeUsuario();
  console.log(usuario);
  
  res.render('fornecedores', { usuario });
});

app.use('/', Rotas);

app.use((req, res) => {
  res.status(404).send('pagina não encontrada');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (process.env.NODE_ENV === 'development') {
    res.status(500).send(`<pre>${err.stack}</pre>`);
  } else {
    res.status(500).send('Erro interno do servidor');
  }
});

const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar o servidor.');
  console.log('wallahi im cooking');
})
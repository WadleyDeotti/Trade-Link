const express = require("express");
const path = require("path");
const session = require("express-session")
const app = express();
const repository = require('./repository/configuracoesRepository');

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use((req, res, next) => {
  res.locals.usuario = req.session.usuario || null;
  next();
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', async (req, res) => {
  if (req.session.usuario) {
    if (req.session.usuario.cnpj) {
      res.render('dashboard');
    } else if (req.session.usuario.cpf) {
      res.render('fornecedores');
    }
  } else { res.render("registro") }
});



const Rotas = require('./routes/configuracoesRoutes');

app.use('/', Rotas);

app.use((req, res) => {
  res.status(404).send('pagina não encontrada');
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('erro interno do servidor');
});

const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar o servidor.');
  console.log('wallahi im cooking');
})
const express = require("express");
const path = require("path");
const session = require("express-session")
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false
}));

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

const usuarioRoutes = require('./routes/usuarioRoutes');

app.get('/', (req, res) => {
  res.render('registro');
});

app.get("/", (req, res) => {
  if (!req.session.querySQL) return res.redirect("/login");
  res.render("fornecedores")
});

app.get('/:pagina', (req, res) => {
  const pagina = req.params.pagina;

  res.render(pagina, (err, html) => {
    if (err) {
      // Se a view não existir, mostra erro 404
      return res.status(404).send('Página não encontrada');
    }
    res.send(html);
  });
});

app.use('/',usuarioRoutes);

app.use((req,res)=> {
res.status(404).send('pagina não encontrada');
});

app.use((err,req,res,next) =>{

console.error(err.stack);
res.status(500).send('erro interno do servidor');
});

const PORT = process.env.PORT || 6767;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log(`http://localhost:${PORT}`)
})
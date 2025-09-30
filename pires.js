const express = require("express");
const path = require("path");
const session = require("express-session")
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: "chave-secreta",
  resave: false,
  saveUninitialized: false,
   cookie: { maxAge: 1000 * 60 * 60 * 24 * 365 * 10 }
}));

app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  if(req.session.usuario){
    if(req.session.usuario.cnpj){
      res.render('empresa');
    res.render('fornecedores');
  }}else{
  const mensagem = req.session.mensagem;
  delete req.session.mensagem; 
  res.render("configuracoes", { mensagem: mensagem || null }); //padrao registro mudar pra pagina q quer ver
  }
});

const Rotas = require('./routes/configuracoesRoutes');

app.use('/',Rotas);

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
  console.log(`http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar o servidor.');
  console.log('wallahi im cooking');
})
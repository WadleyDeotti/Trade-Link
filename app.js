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



app.use(express.static(path.join(__dirname,'public')));

app.get('/', (req, res) => {
  console.log(req.session.usuario);
  if(req.session.usuario){
    if(req.session.usuario.tipo === "empresa"){
      res.render('fornecedores'); // colocar pagina de empresas
    
  }else{
    res.render('fornecedores');}
    }else{
      res.render('registro');
    }
});

const usuarioRoutes = require('./routes/usuarioRoutes');

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
  console.log(`http://localhost:${PORT}`);
  console.log('Pressione Ctrl+C para encerrar o servidor.');
  console.log('wallahi im cooking');
})
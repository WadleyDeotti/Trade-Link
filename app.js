const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 6969;

// Configurações ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));

//carregar css js e imagens
app.use(express.static(path.join(__dirname, "public")));


//falta configurar a parte de manter login, n esquecer porra !!!!!!!!!!!!!!!!!!!!

//mudar oq ta escrito para abrir a pagina
app.get('/', (req, res) => {
    res.render('registro'); 
});

//interpreta uma troca de paginas automaticamente 

const criarRotasAutomaticas = () => {
    const pastaViews = path.join(__dirname, "views");
    const arquivos = fs.readdirSync(pastaViews);

    arquivos.forEach(arquivo => {
        if (arquivo.endsWith(".ejs")) {
            let nomePagina = arquivo.replace(".ejs", "");
            let rota = nomePagina === "index" ? "/" : `/${nomePagina}`;

            app.get(rota, (req, res) => {
                res.render(nomePagina);
            });

            console.log(`Rota criada: ${rota} → ${arquivo}`);
        }
    });
};

criarRotasAutomaticas();


//n tem database - corrigir dps

// Carrega automaticamente todas as rotas da pasta /routes
// const routesPath = path.join(__dirname, 'routes');
// fs.readdirSync(routesPath).forEach(file => {
//     const route = require(path.join(routesPath, file));
//     const routeName = '/' + file.replace('.js', '');
//     app.use(routeName, route);
// });

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
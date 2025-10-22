const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/CadastroProdutos');


// ------------------- POSTs -------------------
// Cadastro
router.post('/produtos/cadastrar', produtoController.cadastrarProduto);
const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/CadastroProdutos');

router.post('/cadastrar', produtoController.cadastrarProduto);
router.put('/editar', produtoController.editarProduto);
router.delete('/deletar', produtoController.deletarProduto);

module.exports = router;
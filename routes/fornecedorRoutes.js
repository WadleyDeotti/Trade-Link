const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/FornecedorController');

// Gets Fornecedor
router.get('/Fornecedores', fornecedorController.getAll);
router.get('/Fornecedores:id', fornecedorController.getById);

// Posts Fornecedor
router.post('/CreateFornecedor', fornecedorController.create);
router.put('/CreateFornecedor:id', fornecedorController.update);

// Del Fornecedor
router.delete('/DeleteFornecedor:id', fornecedorController.remove);
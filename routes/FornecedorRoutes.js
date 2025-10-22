const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/FornecedorController');

// Gets Fornecedor
router.get('/Fornecedores', fornecedorController.getAll);
router.get('/Fornecedores:id', fornecedorController.getById);

// Posts Fornecedor
router.post('/CreateFornecedor', fornecedorController.create);
app.post('/fornecedores/editar', async (req, res) => {
  // Aqui você pega os dados enviados pelo form
  const { endereco, email, telefone} = req.body;
  // Atualiza no banco
  await repository.updateFornecedor(req.body);
  res.redirect('/fornecedores');
});

// Del Fornecedor
router.delete('/DeleteFornecedor:id', fornecedorController.remove);
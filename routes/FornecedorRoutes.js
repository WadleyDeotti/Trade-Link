const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/FornecedorController');
const repository = require('../repository/fornecedoresRepository');

// GETs
router.get('/fornecedores', fornecedorController.getAll);
router.get('/fornecedores/:id', fornecedorController.getById);

// POST - criar fornecedor
router.post('/fornecedores', fornecedorController.create);

// PUT - editar fornecedor
router.put('/fornecedores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await repository.updateFornecedor(id, req.body);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar fornecedor');
  }
});

// DELETE
router.delete('/fornecedores/:id', fornecedorController.remove);

module.exports = router;

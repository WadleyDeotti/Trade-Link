const express  = require('express');
const router = express.Router();
const conexao = require('../db.js');



// Insert user
router.post('/cadastrar', (req, res) => {
  const { nome, cpf } = req.body;
  conexao.query('INSERT INTO fornecedor (nome, cpf) VALUES (?, ?)', [nome, cpf], (err) => {
    if (err) return res.status(500).send(err);
    res.render("principal");
  });
});


//select 
router.get('/SelectF', (req, res) => {
  db.query('SELECT * FROM fornecedor', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// delete usuario
router.delete('/deletar', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM (nome tabela) WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('deletado!');
  });
});


module.exports = router;

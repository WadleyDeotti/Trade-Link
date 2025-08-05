const express  = require('express');
const router = express.Router();
const conexao = require('../db.js');


// Insert user
router.post('/cadastrar', (req, res) => {
  const { nome, cnpj } = req.body;
  conexao.query('INSERT INTO empresa (nome, cnpj) VALUES (?, ?)', [nome, cnpj], (err) => {
    if (err) return res.status(500).send(err);
    res.render("principal");   
    });
  });
  
  //select 
router.get('/SelectE', (req, res) => {
  db.query('SELECT * FROM empresa', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// DELETE
router.delete('/DeleteE', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM empresa WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Usuário deletado!');
  });
});

module.exports = router;
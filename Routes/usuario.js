const express  = require('express');
const router = express.Router();
const conexao = require('../db.js');


//não usar, é só exemplo

//insert
router.post('/', (req, res) => {
  const { nome, email } = req.body;
  db.query('INSERT INTO (nome tabela) (campos, campos) VALUES (?, ?)', [nome, email], (err) => {
    if (err) return res.status(500).send(err);
    res.send('Usuário criado!');
  });
});

//select 
router.get('/', (req, res) => {
  db.query('SELECT * FROM (nome tabela)', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// UPDATE
router.put('/:id', (req, res) => {
  const { nome, email } = req.body;
  const { id } = req.params;
  db.query('UPDATE (nome tabela) SET campo_mudar = ?, campo_mudar = ? WHERE id = ?', [campo1, campo, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('atualizado!');
  });
});

// DELETE
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM (nome tabela) WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.send('deletado!');
  });
});

module.exports = router;
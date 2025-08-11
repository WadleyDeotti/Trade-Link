const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuarioController");


router.post('/cadastro',usuarioController.cadastrar);


router.post('/logar',usuarioController.logar);

module.exports = router;
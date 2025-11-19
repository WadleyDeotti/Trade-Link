const usuarioRepository = require('../repository/usuarioRepository');

exports.getCategoriasPage = (req, res) => {
    res.render('categoria'); // Renderiza o views/categoria.ejs
};
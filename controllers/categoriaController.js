import usuarioRepository from '../repository/usuarioRepository.js';

export const getCategoriasPage = (req, res) => {
    res.render('categoria'); // Renderiza o views/categoria.ejs
};
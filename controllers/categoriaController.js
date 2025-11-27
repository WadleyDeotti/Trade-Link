<<<<<<< Updated upstream
<<<<<<< Updated upstream
export const getCategoriasPage = (req, res) => {
    res.render('categoria'); 
=======
=======
>>>>>>> Stashed changes
import * as repository from "../Repository.js";

export const getCategoriasPage = async (req, res) => {
  try {
    const categoria = req.query.categoria || 'eletronicos';
    const produtos = await repository.getProdutosPorCategoria(categoria);
    const categorias = await repository.getCategorias();
    
    req.session.categoriaData = { produtos, categorias, categoriaAtual: categoria };
    return res.redirect('/categoria');
  } catch (error) {
    console.error('Erro ao carregar categorias:', error);
    req.session.categoriaData = { produtos: [], categorias: [], categoriaAtual: 'eletronicos' };
    return res.redirect('/categoria');
  }
};

export const buscarProdutos = async (req, res) => {
  try {
    const { termo, categoria, precoMin, precoMax } = req.query;
    const produtos = await repository.buscarProdutos(termo, categoria, precoMin, precoMax);
    
    res.json({ produtos });
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

export const getCategoriasProdutos = async (req, res) => {
  try {
    const { categoria } = req.params;
    const produtos = await repository.getProdutosPorCategoria(categoria);
    
    res.json({ produtos });
  } catch (error) {
    console.error('Erro ao buscar produtos por categoria:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
};
import * as repository from "../Repository.js";

export const getProdutoPage = async (req, res) => {
  try {
    const id_produto = req.params.id;
    const produto = await repository.buscarProdutoPorId(id_produto);
    
    if (!produto) {
      req.session.produtoData = { produto: null, produtosRelacionados: [] };
      return res.redirect('/produto');
    }

    const produtosRelacionados = await repository.buscarProdutosRelacionados(produto.categoria, id_produto);
    
    req.session.produtoData = { produto, produtosRelacionados };
    return res.redirect('/produto');
  } catch (error) {
    console.error('Erro ao carregar produto:', error);
    req.session.produtoData = { produto: null, produtosRelacionados: [] };
    return res.redirect('/produto');
  }
};

export const getListaProdutos = async (req, res) => {
  try {
    const produtos = await repository.getProdutos();
    req.session.produtoData = { produtos, produto: null, produtosRelacionados: [] };
    return res.redirect('/produto');
  } catch (error) {
    console.error('Erro ao carregar produtos:', error);
    req.session.produtoData = { produtos: [], produto: null, produtosRelacionados: [] };
    return res.redirect('/produto');
  }
};

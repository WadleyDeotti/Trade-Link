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

export const cadastrarProduto = async (req, res) => {
  const dadosProduto = req.body;
  dadosProduto.id_fornecedor = req.session.usuario.id_fornecedor;
  try {
    await repository.cadastrarProduto(dadosProduto);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).send('Erro ao cadastrar produto');
  }
  res.redirect('/fornecedores');
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

export const editarProduto = async (req, res) => {
  const dadosProduto = req.body;
  dadosProduto.id_produto = req.params.id;

  try {
    await repository.updateProdutos(dadosProduto);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    res.status(500).send('Erro ao editar produto');
  }
};

export const buscarProduto = async (req, res) => {
  try {
    const produto = await repository.buscarProdutoPorId(req.params.id);
    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }
    res.json(produto);
  } catch (err) {
    console.error('Erro ao buscar produto:', err);
    res.status(500).json({ error: 'Erro ao buscar produto' });
  }
};

export const buscarProdutosFornecedor = async (req, res) => {
  try {
    const produtos = await repository.buscarProdutosPorFornecedor(req.params.id);
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos do fornecedor:', err);
    res.status(500).json({ error: 'Erro ao buscar produtos' });
  }
};

export const excluirProduto = async (req, res) => {
  try {
    await repository.deleteProduto(req.params.id);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao excluir produto:', err);
    res.status(500).send('Erro ao excluir produto');
  }
};
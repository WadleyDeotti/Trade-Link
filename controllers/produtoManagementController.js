import * as repository from "../Repository.js";

// atualizar dados salvos na sessão
async function atualizarSessaoUsuario(req) {
  const usuario = req.session.usuario;
  if (!usuario) throw new Error('Usuário não está logado');

  const tipo = usuario.id_empresa ? 'empresa' : 'fornecedor';
  const id = tipo === 'empresa' ? usuario.id_empresa : usuario.id_fornecedor;

  let novoUsuario;
  if (tipo === 'empresa') {
    novoUsuario = await repository.buscarEmpresaPorId(id);
  } else {
    novoUsuario = await repository.buscarFornecedorPorId(id);
  }

  req.session.usuario = novoUsuario;
  return req.session.usuario;
}

export const cadastrarProduto = async (req, res) => {
  const dadosProduto = req.body;
  dadosProduto.id_fornecedor = req.session.usuario.id_fornecedor;

  try {
    await repository.cadastrarProduto(dadosProduto);
    await atualizarSessaoUsuario(req);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).send('Erro ao cadastrar produto');
  }
};

export const editarProduto = async (req, res) => {
  const id_produto = req.params.id;
  const dadosProduto = req.body;

  try {
    await repository.editarProduto(id_produto, dadosProduto);
    await atualizarSessaoUsuario(req);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao editar produto:', err);
    res.status(500).send('Erro ao editar produto');
  }
};
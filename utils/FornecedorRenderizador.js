// utils/FornecedorRenderizador.js
import * as repository from '../Repository.js';

export default class FornecedorRenderizador {
  async render(res, data = {}) {
    const usuario = res.req.session?.usuario;
    
    if (usuario && usuario.id_fornecedor) {
      try {
        const produtosFornecedor = await repository.buscarProdutosPorFornecedor(usuario.id_fornecedor);
        data.produtosFornecedor = produtosFornecedor;
        console.log('Produtos encontrados:', produtosFornecedor.length);
      } catch (error) {
        console.error('Erro ao buscar produtos do fornecedor:', error);
        data.produtosFornecedor = [];
      }
    } else {
      console.log('Usuário não é fornecedor ou não está logado');
      data.produtosFornecedor = [];
    }
    
    res.render('fornecedores', data);
  }
}
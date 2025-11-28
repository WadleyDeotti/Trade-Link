// utils/FornecedorRenderizador.js
import * as repository from '../Repository.js';

export default class FornecedorRenderizador {
  async render(res, data = {}) {
    const usuario = res.req.session?.usuario;
    console.log('=== FornecedorRenderizador ===');
    console.log('Usuario:', usuario ? { id_fornecedor: usuario.id_fornecedor, nome: usuario.nome_fantasia } : 'null');
    
    if (usuario && usuario.id_fornecedor) {
      try {
        console.log('Buscando produtos para fornecedor ID:', usuario.id_fornecedor);
        const produtosFornecedor = await repository.buscarProdutosPorFornecedor(usuario.id_fornecedor);
        data.produtosFornecedor = produtosFornecedor;
        console.log('Produtos encontrados:', produtosFornecedor.length);
        console.log('Produtos:', produtosFornecedor);
      } catch (error) {
        console.error('Erro ao buscar produtos do fornecedor:', error);
        data.produtosFornecedor = [];
      }
      
    } else {
      console.log('Usuário não é fornecedor ou não está logado');
      data.produtosFornecedor = [];
    }
    
    console.log('Data final:', { produtosFornecedor: data.produtosFornecedor?.length || 0 });
    res.render('fornecedores', data);
  }
}
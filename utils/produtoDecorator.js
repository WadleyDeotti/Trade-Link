// decorators/ProdutoDecorator.js
import * as repository from '../Repository.js';

export default class ProdutoDecorator {
  constructor(renderizador) {
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    if (!data) data = {};
    try {
      // Busca todos os produtos apenas se não for página de fornecedores
      if (view !== 'fornecedores') {
        const produtos = await repository.getProdutos();
        data.produtos = produtos;
      }
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }

    // Chama o renderizador interno (decorator ou renderizador base)
    await this.renderizador.render(res, view, data);
  }
}

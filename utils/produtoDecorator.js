// decorators/ProdutoDecorator.js
import Renderizador from './Renderizador.js';
import repository from '../Repository.js';

export default class ProdutoDecorator extends Renderizador {
  constructor(renderizador) {
    super();
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    if (!data) data = {};
    data.produtos = [];

    try {
      // Busca todos os produtos
      const produtos = await repository.getProdutos();
      data.produtos = produtos;
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
    }

    // Chama o renderizador interno (decorator ou renderizador base)
    this.renderizador.render(res, view, data);
  }
}

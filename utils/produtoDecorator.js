const Renderizador = require('./Renderizador');
const repository = require('../Repository');

class ProdutoDecorator extends Renderizador {
  constructor(renderizador) {
    super();
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    try {
      // Busca todos os produtos
      const produtos = await repository.getProdutos();
      data.produtos = produtos;
    } catch (err) {
      console.error('Erro ao carregar produtos:', err);
      data.produtos = [];
    }

    // Chama o renderizador interno (decorator ou renderizador base)
    this.renderizador.render(res, view, data);
  }
}

module.exports = ProdutoDecorator;

// utils/Renderizador.js
import CategoriaRenderizador from './CategoriaRenderizador.js';
import ProdutoRenderizador from './ProdutoRenderizador.js';

export default class Renderizador {
  constructor() {
    this.categoriaRenderizador = new CategoriaRenderizador();
    this.produtoRenderizador = new ProdutoRenderizador();
  }

  async render(res, view, data = {}) {
    switch (view) {
      case 'categoria':
        return this.categoriaRenderizador.render(res, data);
      case 'produto':
        return this.produtoRenderizador.render(res, data);
      default:
        return res.render(view, data);
    }
  }
}

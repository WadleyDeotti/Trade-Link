// utils/Renderizador.js
import CategoriaRenderizador from './CategoriaRenderizador.js';
import ProdutoRenderizador from './ProdutoRenderizador.js';
import FornecedorRenderizador from './FornecedorRenderizador.js';

export default class Renderizador {
  constructor() {
    this.categoriaRenderizador = new CategoriaRenderizador();
    this.produtoRenderizador = new ProdutoRenderizador();
    this.fornecedorRenderizador = new FornecedorRenderizador();
  }

  async render(res, view, data = {}) {
    switch (view) {
      case 'categoria':
        return this.categoriaRenderizador.render(res, data);
      case 'produto':
        return this.produtoRenderizador.render(res, data);
      case 'fornecedores':
        return await this.fornecedorRenderizador.render(res, data);
      default:
        return res.render(view, data);
    }
  }
}

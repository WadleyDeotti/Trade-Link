// utils/Renderizador.js
import CategoriaRenderizador from './CategoriaRenderizador.js';
import ProdutoRenderizador from './ProdutoRenderizador.js';
import MensagemRenderizador from './MensagemRenderizador.js';

export default class Renderizador {
  constructor() {
    this.categoriaRenderizador = new CategoriaRenderizador();
    this.produtoRenderizador = new ProdutoRenderizador();
    this.mensagemRenderizador = new MensagemRenderizador();
  }

  async render(res, view, data = {}) {
    switch (view) {
      case 'categoria':
        return this.categoriaRenderizador.render(res, data);
      case 'produto':
        return this.produtoRenderizador.render(res, data);
      case 'mensagens':
        return this.mensagemRenderizador.render(res, data);
      default:
        return res.render(view, data);
    }
  }
}

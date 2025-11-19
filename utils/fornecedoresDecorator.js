// decorators/FornecedorDecorator.js
import Renderizador from './Renderizador.js';
import * as repository from '../Repository.js';
export default class FornecedorDecorator extends Renderizador {
  constructor(renderizador) {
    super();
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    if (!data) data = {};

    try {
      const fornecedores = await repository.getFornecedor();
      data.fornecedores = fornecedores;
    } catch (err) {
      console.error('Erro ao carregar fornecedores:', err);
      data.fornecedores = [];
    }

    // Chama o renderizador interno
    this.renderizador.render(res, view, data);
  }
}

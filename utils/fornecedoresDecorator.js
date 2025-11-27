// decorators/FornecedorDecorator.js
import * as repository from '../Repository.js';

export default class FornecedorDecorator {
  constructor(renderizador) {
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    if (!data) data = {};

    try {
      // Busca fornecedores apenas se não for página de fornecedores (perfil)
      if (view !== 'fornecedores') {
        const fornecedores = await repository.getFornecedor();
        data.fornecedores = fornecedores;
      }
    } catch (err) {
      console.error('Erro ao carregar fornecedores:', err);
      data.fornecedores = [];
    }

    // Chama o renderizador interno
    await this.renderizador.render(res, view, data);
  }
}

// utils/UsuarioDecorator.js
import Renderizador from './Renderizador.js';

export default class UsuarioDecorator extends Renderizador {
  constructor(renderizador) {
    super();
    this.renderizador = renderizador;
  }

  render(res, view, data = {}) {
    const usuario = res.req.session?.usuario || null;
    data.usuario = usuario;
    this.renderizador.render(res, view, data);
  }
}

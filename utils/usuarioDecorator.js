// utils/UsuarioDecorator.js
import Renderizador from './Renderizador.js';

export default class UsuarioDecorator extends Renderizador {
  constructor(renderizador) {
    super();
    this.renderizador = renderizador;
  }

  render(res, view, data = {}) {
    const usuario = res.req.session?.usuario || res.req.session?.user || null;
    data.usuario = usuario;
    console.log('Usuario na sessão:', usuario);
    this.renderizador.render(res, view, data);
  }
}

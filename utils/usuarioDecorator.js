// utils/UsuarioDecorator.js
export default class UsuarioDecorator {
  constructor(renderizador) {
    this.renderizador = renderizador;
  }

  render(res, view, data = {}) {
    const usuario = res.req.session?.usuario || null;
    data.usuario = usuario;
    console.log(usuario);
    this.renderizador.render(res, view, data);
  }
}

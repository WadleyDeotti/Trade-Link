// utils/UsuarioDecorator.js
export default class UsuarioDecorator {
  constructor(renderizador) {
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    const usuario = res.req.session?.usuario || null;
    data.usuario = usuario;
    console.log(usuario);
    await this.renderizador.render(res, view, data);
  }
}

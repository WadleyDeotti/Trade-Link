// utils/Renderizador.js
export default class Renderizador {
  render(res, view, data = {}) {
    res.render(view, data);
  }
}

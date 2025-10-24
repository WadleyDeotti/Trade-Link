// utils/Renderizador.js
class Renderizador {
  render(res, view, data = {}) {
    res.render(view, data);
  }
}

module.exports = Renderizador;
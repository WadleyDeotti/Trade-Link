// utils/Renderizador.js
export default class Renderizador {
  render(res, view, data = {}) {
    if (view === 'categoria' && res.req.session.categoriaData) {
      const categoriaData = res.req.session.categoriaData;
      delete res.req.session.categoriaData;
      res.render(view, { ...data, ...categoriaData });
    } else {
      res.render(view, data);
    }
  }
}

// utils/CategoriaRenderizador.js
export default class CategoriaRenderizador {
  render(res, data = {}) {
    if (res.req.session.categoriaData) {
      const categoriaData = res.req.session.categoriaData;
      delete res.req.session.categoriaData;
      res.render('categoria', { ...data, ...categoriaData });
    } else {
      res.render('categoria', data);
    }
  }
}
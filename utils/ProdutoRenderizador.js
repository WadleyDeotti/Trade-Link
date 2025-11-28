// utils/ProdutoRenderizador.js
export default class ProdutoRenderizador {
  render(res, data = {}) {
    if (res.req.session.produtoData) {
      const produtoData = res.req.session.produtoData;
      delete res.req.session.produtoData;
      res.render('produto', { ...data, ...produtoData });
    } else {
      res.render('produto', data);
    }
    
  }
}
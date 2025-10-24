const repository = require('../Repository');

exports.IniciarSite = async (req, res) => {
  try { 
    res.renderizador.render(res, 'inicial', {});
  } catch (err) {
    console.error('Erro ao iniciar site:', err);
    res.status(500).send('Erro interno');
}};

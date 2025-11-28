export const autenticar = (req, res, next) => {
  if (!req.session.usuario) {
    // Se for uma requisição AJAX/API, retorna JSON
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
      return res.status(401).json({ error: "Você precisa estar logado para acessar essa página." });
    }
    // Se for uma requisição normal, redireciona
    req.session.mensagem = "Você precisa estar logado para acessar essa página.";
    return res.redirect("/login");
  }
  next();
};
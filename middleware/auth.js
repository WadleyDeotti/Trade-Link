export const autenticar = (req, res, next) => {
  if (!req.session.usuario) {
    req.session.mensagem = "Você precisa estar logado para acessar essa página.";
    return res.redirect("/login");
  }
  next();
};
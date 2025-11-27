import bcrypt from "bcrypt";
import * as repository from "../Repository.js";

// atualizar dados salvos na sessão
async function atualizarSessaoUsuario(req) {
  const usuario = req.session.usuario;
  if (!usuario) throw new Error('Usuário não está logado');

  const tipo = usuario.id_empresa ? 'empresa' : 'fornecedor';
  const id = tipo === 'empresa' ? usuario.id_empresa : usuario.id_fornecedor;

  let novoUsuario;
  if (tipo === 'empresa') {
    novoUsuario = await repository.buscarEmpresaPorId(id);
  } else {
    novoUsuario = await repository.buscarFornecedorPorId(id);
  }

  req.session.usuario = novoUsuario;
  return req.session.usuario;
}

export const alterarSenha = async (req, res) => {
  const usuario = req.session.usuario;
  const { current_password, new_password, confirm_password } = req.body;

  if (!current_password || !new_password || !confirm_password) {
    return res.redirect("configuracoes");
  }

  if (!usuario) return res.status(401).send('Usuário não logado');

  try {
    if (usuario.id_empresa) {
      const senhaCorreta = await bcrypt.compare(current_password, usuario.senha_hash);
      if (!senhaCorreta) return res.redirect("configuracoes");

      if (new_password !== confirm_password) return res.redirect("configuracoes");

      const senhaHash = await bcrypt.hash(new_password, 10);
      await repository.updateSenhaEmpresa({ senha_hash: senhaHash, id_empresa: usuario.id_empresa });
    } else if (usuario.id_fornecedor) {
      const senhaCorreta = await bcrypt.compare(current_password, usuario.senha_hash);

      if (!senhaCorreta) return res.redirect("configuracoes");
      if (new_password !== confirm_password) return res.redirect("configuracoes");

      const senhaHash = await bcrypt.hash(new_password, 10);
      await repository.updateSenhaFornecedor({ senha_hash: senhaHash, id_fornecedor: usuario.id_fornecedor });
    }

    await atualizarSessaoUsuario(req);
    res.redirect("configuracoes");
  } catch (err) {
    console.error("Erro ao alterar senha:", err);
    res.status(500).send("Erro ao alterar senha");
  }
};

export const updateDados = async (req, res) => {
  const usuario = req.session.usuario;
  const dados = req.body;

  try {
    if (usuario.id_fornecedor) {
      dados.id_fornecedor = usuario.id_fornecedor;
      await repository.atualizarFornecedor(dados);
    } else if (usuario.id_empresa) {
      dados.id_empresa = usuario.id_empresa;
      await repository.atualizarEmpresa(dados);
    }
    await atualizarSessaoUsuario(req);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao atualizar dados:', err);
    res.status(500).send('Erro ao atualizar dados');
  }
};
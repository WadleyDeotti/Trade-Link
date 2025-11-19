import bcrypt from "bcrypt";
import * as repository from "../Repository.js"; // ajuste o caminho conforme seu arquivo
const safeBool = val => val === 'on' ? 1 : 0;

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
  console.log(req.session.usuario);
  return req.session.usuario;
}

// ---------------- Funções exportadas ----------------

export const salvarConfiguracoes = async (req, res) => {
  const usuario = req.session.usuario;
  if (!usuario) return res.status(401).send('Usuário não logado');

  const {
    visibility = 'public',
    data_sharing = 'off',
    show_activity = 'off',
    search_visibility = 'off',
    notify_messages = 'off',
    notify_mentions = 'off',
    notify_updates = 'off',
    notify_comments = 'off',
    important_only = 'off',
    email_notifications = 'off',
    push_notifications = 'off',
    language = 'pt-br',
    datetime_format = '24h',
    timezone = '-3',
  } = req.body;

  const safe = val => (val === undefined || val === '' ? null : val);

  try {
    if (usuario.id_empresa) {
      await repository.updateEmpresa({
        visibility,
        data_sharing: safe(safeBool(data_sharing)),
        show_activity: safe(safeBool(show_activity)),
        search_visibility: safe(safeBool(search_visibility)),
        notify_messages: safe(safeBool(notify_messages)),
        notify_mentions: safe(safeBool(notify_mentions)),
        notify_updates: safe(safeBool(notify_updates)),
        notify_comments: safe(safeBool(notify_comments)),
        important_only: safe(safeBool(important_only)),
        email_notifications: safe(safeBool(email_notifications)),
        push_notifications: safe(safeBool(push_notifications)),
        language,
        datetime_format,
        timezone,
        id_empresa: usuario.id_empresa
      });
    } else if (usuario.id_fornecedor) {
      await repository.updateFornecedor({
        visibility,
        data_sharing: safe(safeBool(data_sharing)),
        show_activity: safe(safeBool(show_activity)),
        search_visibility: safe(safeBool(search_visibility)),
        notify_messages: safe(safeBool(notify_messages)),
        notify_mentions: safe(safeBool(notify_mentions)),
        notify_updates: safe(safeBool(notify_updates)),
        notify_comments: safe(safeBool(notify_comments)),
        important_only: safe(safeBool(important_only)),
        email_notifications: safe(safeBool(email_notifications)),
        push_notifications: safe(safeBool(push_notifications)),
        language,
        datetime_format,
        timezone,
        id_fornecedor: usuario.id_fornecedor
      });
    }

    await atualizarSessaoUsuario(req);
    console.log('Usuário atualizado com sucesso');
    res.redirect("/configuracoes");
  } catch (err) {
    console.error('Erro ao atualizar usuário:', err);
    res.status(500).send('Erro ao atualizar usuário');
  }
};

export const alterarSenha = async (req, res) => {
  const usuario = req.session.usuario;
  const { current_password, new_password, confirm_password } = req.body;
  console.log(usuario);
  console.log(req.body);
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

export const cadastrarProduto = async (req, res) => {
  const dadosProduto = req.body;
  dadosProduto.id_fornecedor = req.session.usuario.id_fornecedor;

  try {
    await repository.cadastrarProduto(dadosProduto);
    await atualizarSessaoUsuario(req);
    res.redirect('/fornecedores');
  } catch (err) {
    console.error('Erro ao cadastrar produto:', err);
    res.status(500).send('Erro ao cadastrar produto');
  }
};

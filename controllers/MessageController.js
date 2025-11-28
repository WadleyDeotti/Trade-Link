import {
  listarConversasDoUsuario,
  listarMensagens,
  salvarMensagem,
  marcarLidas
} from "../Repository.js";
import MessageService from "../service.js";
import chatObserver from "../utils/MessageObserver.js";

const service = new MessageService(chatObserver);

class ChatController {

  // =======================
  // LISTAR CONVERSAS\
  // =======================
  async listarConversas(req, res) {
    try {
      const id_usuario = req.session.usuario.id_usuario;

      const conversas = await listarConversasDoUsuario(id_usuario);

      res.json(conversas);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao listar conversas" });
    }
  }

  // =======================
  // LISTAR MENSAGENS
  // =======================
  async listarMensagens(req, res) {
    try {
      const usuario = req.session.usuario.id_usuario;
      const { id_conversa } = req.params;

      const msgs = await service.listarMensagens(id_conversa);

      // marca como lidas
      await marcarLidas(id_conversa, usuario);

      res.json(msgs);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao carregar mensagens" });
    }
  }

  // =======================
  // ENVIAR MENSAGEM
  // =======================
  async enviar(req, res) {
    try {
      const remetente_id = req.session.usuario.id_usuario;
      const { id_conversa, tipo_remetente, conteudo } = req.body;

      // Salva + notifica via Observer
      const msg = await service.enviarMensagem(
        id_conversa,
        remetente_id,
        tipo_remetente,
        conteudo
      );

      res.json(msg);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  }

  // =======================
  // SALVAR MENSAGEM
  // =======================
  async salvarMensagemChat(req, res) {
    try {
      const remetente_id = req.session.usuario.id_usuario;
      const { id_conversa, tipo_remetente, conteudo } = req.body;

      const id_mensagem = await salvarMensagem(
        id_conversa,
        remetente_id,
        tipo_remetente,
        conteudo
      );

      res.json({ id_mensagem, success: true });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao salvar mensagem" });
    }
  }

  // =======================
  // CARREGAR CONVERSA (versão antiga compatível)
  // =======================
  async conversa(req, res) {
    try {
      const usuario = req.session.usuario.id_usuario;
      const { contatoId } = req.params;

      const msgs = await listarMensagens(usuario, contatoId);

      res.json(msgs);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao carregar conversa" });
    }
  }
}

export default new ChatController();

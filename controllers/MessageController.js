import MessageModel from "../models/MessageModel.js";
import MessageObserver from "../utils/MessageObserver.js";

class MessageController {
  async enviarMensagem(req, res) {
    const { remetenteId, destinatarioId, conteudo } = req.body;

    try {
      const msg = await MessageModel.create(remetenteId, destinatarioId, conteudo);
      MessageObserver.notify(msg);
      res.status(201).json(msg);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  }

  async listarMensagens(req, res) {
    const { usuarioId, contatoId } = req.params;

    try {
      const mensagens = await MessageModel.getConversa(usuarioId, contatoId);
      res.json(mensagens);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar mensagens" });
    }
  }
}

export default new MessageController();

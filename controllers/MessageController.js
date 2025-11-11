import { 
  enviarMensagem,
  buscarMensagensEntre,
  marcarComoLida
} from "../Repository.js";
import Mensagem from "../models/Mensagem.js";
import { buscarMensagensEntre } from "../Repository.js";
import Conversa from "../models/Conversa.js";
import { buscarConversasDoUsuario } from "../Repository.js";

const conversas = await buscarConversasDoUsuario(req.session.usuario.id);

res.json(conversas.map(c => Conversa(c)));

const msgs = await buscarMensagensEntre(usuario, contatoId);
res.json(msgs.map(m => Mensagem(m)));

class ChatController {

  async enviar(req, res) {
    try {
      const remetente_id = req.session.usuario.id_usuario;
      const { destinatario_id, conteudo } = req.body;

      const msg = await enviarMensagem({
        remetente_id,
        destinatario_id,
        conteudo
      });

      res.json(msg);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao enviar mensagem" });
    }
  }

  async conversa(req, res) {
    try {
      const usuario = req.session.usuario.id_usuario;
      const { contatoId } = req.params;

      const msgs = await buscarMensagensEntre(usuario, contatoId);

      res.json(msgs);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao carregar conversa" });
    }
  }
}

export default new ChatController();

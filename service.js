import * as Repository from "./Repository.js";
import { Mensagem } from "./models/MessageModel.js";

class MessageService {
    constructor(observer) {
        this.observer = observer;
    }

    async iniciarConversa(usuario1, usuario2, tipo1, tipo2) {
        return await Repository.buscarOuCriarConversa(usuario1, usuario2, tipo1, tipo2);
    }

    async listarConversas(id_usuario) {
        return await Repository.listarConversasDoUsuario(id_usuario);
    }

    async enviarMensagem(id_conversa, remetente_id, tipo_remetente, conteudo) {
        const id_mensagem = await Repository.salvarMensagem(
            id_conversa, remetente_id, tipo_remetente, conteudo
        );

        const msg = new Mensagem(
            id_mensagem, id_conversa, remetente_id, tipo_remetente, conteudo
        );

        this.observer.notificarUsuarios(id_conversa, msg);

        return msg;
    }

    async listarMensagens(id_conversa) {
        return await Repository.listarMensagens(id_conversa);
    }
}

export default MessageService;

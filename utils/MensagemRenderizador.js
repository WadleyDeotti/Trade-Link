// utils/MensagemRenderizador.js
import { listarConversasDoUsuario } from '../Repository.js';

export default class MensagemRenderizador {
  async render(res, data = {}) {
    const usuario = res.req.session?.usuario;
    
    if (usuario && usuario.id_usuario) {
      try {
        const conversas = await listarConversasDoUsuario(usuario.id_usuario);
        data.conversas = conversas;
        data.totalConversas = conversas.length;
        data.conversasNaoLidas = conversas.filter(c => c.nao_lidas > 0).length;
      } catch (error) {
        console.error('Erro ao buscar conversas:', error);
        data.conversas = [];
        data.totalConversas = 0;
        data.conversasNaoLidas = 0;
      }
    } else {
      data.conversas = [];
      data.totalConversas = 0;
      data.conversasNaoLidas = 0;
    }
    
    res.render('mensagens', data);
  }
}
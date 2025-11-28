// utils/mensagemDecorator.js
import { listarConversasDoUsuario } from '../Repository.js';

export default class MensagemDecorator {
  constructor(renderizador) {
    this.renderizador = renderizador;
  }

  async render(res, view, data = {}) {
    const usuario = res.req.session?.usuario;
    
    // Adiciona dados de mensagens apenas se o usuário estiver logado
    if (usuario && usuario.id_usuario) {
      try {
        const conversas = await listarConversasDoUsuario(usuario.id_usuario);
        data.totalMensagensNaoLidas = conversas.reduce((total, conversa) => total + (conversa.nao_lidas || 0), 0);
        data.temMensagensNaoLidas = data.totalMensagensNaoLidas > 0;
      } catch (error) {
        console.error('Erro ao buscar mensagens não lidas:', error);
        data.totalMensagensNaoLidas = 0;
        data.temMensagensNaoLidas = false;
      }
    } else {
      data.totalMensagensNaoLidas = 0;
      data.temMensagensNaoLidas = false;
    }

    await this.renderizador.render(res, view, data);
  }
}
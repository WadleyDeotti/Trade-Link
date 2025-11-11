class Mensagem {
    constructor(id_mensagem, id_conversa, remetente_id, tipo_remetente, conteudo, enviado_em, lida) {
        this.id_mensagem = id_mensagem;
        this.id_conversa = id_conversa;
        this.remetente_id = remetente_id;
        this.tipo_remetente = tipo_remetente;
        this.conteudo = conteudo;
        this.enviado_em = enviado_em;
        this.lida = lida;
    }
}

module.exports = { Mensagem };
class MessageObserver {
    constructor() {
        this.clientes = new Map(); 
    }

    registrar(conversaId, socket) {
        if (!this.clientes.has(conversaId)) {
            this.clientes.set(conversaId, []);
        }
        this.clientes.get(conversaId).push(socket);
    }

    remover(socket) {
        for (const [id, lista] of this.clientes.entries()) {
            this.clientes.set(id, lista.filter(s => s.id !== socket.id));
        }
    }

    notificarUsuarios(conversaId, mensagem) {
        const sockets = this.clientes.get(conversaId);
        if (!sockets) return;
        
        for (const s of sockets) {
            s.emit("mensagemRecebida", mensagem);
        }
    }
}

const observer = new MessageObserver();
export default observer;

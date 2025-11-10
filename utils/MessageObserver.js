class MessageObserver {
  constructor() {
    this.sockets = [];
  }

  subscribe(socket) {
    this.sockets.push(socket);
  }

  notify(message) {
    this.sockets.forEach((socket) => {
      socket.emit("novaMensagem", message);
    });
  }
}

export default new MessageObserver();

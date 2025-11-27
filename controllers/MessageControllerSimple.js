class MessageControllerSimple {
  async listarConversas(req, res) {
    try {
      res.json([]);
    } catch (err) {
      res.status(500).json({ error: "Erro" });
    }
  }

  async listarMensagens(req, res) {
    try {
      res.json([]);
    } catch (err) {
      res.status(500).json({ error: "Erro" });
    }
  }

  async enviar(req, res) {
    try {
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: "Erro" });
    }
  }
}

export default new MessageControllerSimple();
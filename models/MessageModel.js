import pool from "../utils/db.js";

class MessageModel {
  async create(remetenteId, destinatarioId, conteudo) {
    const [result] = await pool.query(
      "INSERT INTO mensagens (remetente_id, destinatario_id, conteudo) VALUES (?, ?, ?)",
      [remetenteId, destinatarioId, conteudo]
    );
    return { id: result.insertId, remetenteId, destinatarioId, conteudo };
  }

  async getConversa(usuarioId, contatoId) {
    const [rows] = await pool.query(
      `SELECT * FROM mensagens
       WHERE (remetente_id = ? AND destinatario_id = ?)
       OR (remetente_id = ? AND destinatario_id = ?)
       ORDER BY data_envio ASC`,
      [usuarioId, contatoId, contatoId, usuarioId]
    );
    return rows;
  }
}

export default new MessageModel();

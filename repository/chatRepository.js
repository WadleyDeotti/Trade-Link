import db from '../db.js';

export async function saveMessage(userMessage, botResponse) {
  const query = `
    INSERT INTO chat_messages (user_message, bot_response)
    VALUES ($1, $2)
    RETURNING *;
  `;
  const values = [userMessage, botResponse];
  const { rows } = await db.query(query, values);
  return rows[0];
}

export async function getMessages(limit = 20) {
  const query = `
    SELECT * FROM chat_messages
    ORDER BY created_at DESC
    LIMIT $1;
  `;
  const { rows } = await db.query(query, [limit]);
  return rows;
}

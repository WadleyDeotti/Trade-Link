import OpenAI from "openai";
import { findFAQAnswer } from "../models/chatModel.js";
import { saveMessage, getMessages } from "../repositories/chatRepository.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🧠 Controlador principal do chat
export async function sendMessage(req, res) {
  try {
    const { message } = req.body;

    // Salva mensagem do usuário
    await saveMessage('user', message);

    // 1️⃣ Tenta responder com base nas FAQs locais
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      await saveMessage('ai', localAnswer);
      return res.json({ reply: localAnswer });
    }

    // 2️⃣ Caso contrário, usa a API da OpenAI
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Você é um assistente útil do Trade Link." },
        { role: "user", content: message }
      ]
    });

    const reply = completion.choices[0].message.content;

    // Salva resposta da IA
    await saveMessage('ai', reply);

    res.json({ reply });
  } catch (error) {
    console.error("Erro no controlador de chat:", error);
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
}

// 📜 Lista todas as mensagens (para histórico do chat)
export async function listMessages(req, res) {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar mensagens" });
  }
}

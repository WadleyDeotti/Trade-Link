import OpenAI from "openai";
import { findFAQAnswer } from "../models/chatModel.js";
import { handleUserMessage } from '../services/chatService.js';
import { getMessages } from '../repositories/chatRepository.js';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Tenta encontrar resposta no Excel primeiro
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
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
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
};

export async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    const saved = await handleUserMessage(message);
    res.json(saved);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
}

export async function listMessages(req, res) {
  try {
    const messages = await getMessages();
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar mensagens' });
  }
}
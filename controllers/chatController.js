import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Garante que o .env é carregado do diretório raiz
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

// Log pra confirmar se a variável foi lida
console.log("🔑 OPENAI_API_KEY carregada:", process.env.OPENAI_API_KEY ? "sim" : "não");

import OpenAI from "openai";
import { findFAQAnswer } from "../models/chatModel.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Verifica perguntas frequentes primeiro
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      return res.json({ reply: localAnswer });
    }

    // 2️⃣ Usa a IA da OpenAI
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
    console.error("Erro no chat:", error);
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
};

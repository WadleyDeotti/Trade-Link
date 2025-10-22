import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";
import { findFAQAnswer } from "../models/chatModel.js";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Função principal do chat
export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Verifica perguntas frequentes primeiro (Excel)
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      return res.json({ reply: localAnswer });
    }

    // 2️⃣ Caso contrário, usa a IA da OpenAI
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

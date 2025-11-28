import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { findFAQAnswer } from "../models/chatModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔑 GEMINI_API_KEY carregada:", process.env.GEMINI_API_KEY ? "sim" : "não");

// Inicializa Gemini
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Tenta achar resposta no FAQ local primeiro
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) return res.json({ reply: localAnswer });

    // Chamada correta usando nova lib
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Você é um assistente do Trade Link. Responda de forma breve e útil:\nUsuário: ${message}`
    });

    const reply = response?.text || "Desculpe, não consegui gerar uma resposta.";

    res.json({ reply });
  } catch (error) {
    console.error("Erro no chat:", error);
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(503).json({ reply: "O servidor de IA atingiu o limite de uso. Tente novamente mais tarde." });
    }
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
};
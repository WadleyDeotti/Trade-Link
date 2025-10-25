import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findFAQAnswer } from "../models/chatModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔑 GEMINI_API_KEY carregada:", process.env.GEMINI_API_KEY ? "sim" : "não");

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // Tenta achar resposta no FAQ local
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      return res.json({ reply: localAnswer });
    }

    // Usa o Gemini corretamente (apenas strings ou { text: "..." })
    const result = await model.generateContent([
      "Você é um assistente útil do Trade Link. Responda de forma clara e breve.",
      message
    ]);

    // Extrai a resposta
    const reply = result.response[0].text ?? "Não consegui gerar uma resposta 😅";

    res.json({ reply });
  } catch (error) {
    console.error("Erro no chat:", error);
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(503).json({ reply: "O servidor de IA atingiu o limite de uso. Tente novamente mais tarde." });
    }
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
};
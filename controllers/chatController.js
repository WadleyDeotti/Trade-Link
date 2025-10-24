import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findFAQAnswer } from "../models/chatModel.js";

// Carregar .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

console.log("🔑 GEMINI_API_KEY carregada:", process.env.GEMINI_API_KEY ? "sim" : "não");

// Inicializa Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // modelo rápido e gratuito

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;

    // 1️⃣ Primeiro tenta achar resposta no FAQ local
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      return res.json({ reply: localAnswer });
    }

    // 2️⃣ Usa o Gemini
    const prompt = `Você é um assistente do Trade Link. Responda de forma útil e breve:\n\nUsuário: ${message}`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    res.json({ reply });
  } catch (error) {
    console.error("Erro no chat:", error);
    if (error.message.includes("429") || error.message.includes("quota")) {
      return res.status(503).json({ reply: "O servidor de IA atingiu o limite de uso. Tente novamente mais tarde." });
    }
    res.status(500).json({ reply: "Erro ao se conectar com a IA." });
  }
};

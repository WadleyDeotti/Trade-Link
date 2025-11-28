// controllers/chatController.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { findFAQAnswer } from "../models/chatModel.js";
import dotenv from "dotenv";

dotenv.config();

// Inicializa Gemini apenas se a API key existir
let genAI = null;
if (process.env.GEMINI_API_KEY) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ reply: "Mensagem não pode estar vazia." });
    }

    // Tenta achar resposta no FAQ local primeiro
    const localAnswer = findFAQAnswer(message);
    if (localAnswer) {
      return res.json({ reply: localAnswer });
    }

    // Tenta usar Gemini se disponível
    if (genAI) {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(`Você é um assistente do Trade Link, uma plataforma que conecta empresas e fornecedores. Responda de forma breve e útil:\n\nUsuário: ${message}`);
        
        const reply = result.response.text();
        return res.json({ reply });
      } catch (geminiError) {
        console.error("Erro na API do Gemini:", geminiError.message);
        // Continua para resposta padrão
      }
    }

    // Resposta padrão se Gemini não estiver disponível
    const reply = "Olá! Sou o assistente do Trade Link. Como posso ajudar você hoje? Você pode perguntar sobre como funciona nossa plataforma, cadastro, contratos ou suporte.";
    res.json({ reply });
    
  } catch (error) {
    console.error("Erro no chat:", error);
    res.status(500).json({ reply: "Erro ao processar sua mensagem." });
  }
};

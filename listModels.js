import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function main() {
  const models = await genAI.listModels();
  console.log("Modelos disponíveis:", models);
}

main().catch(console.error);

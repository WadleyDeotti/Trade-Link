import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const faqPath = path.join(__dirname, "../data/faq.xlsx");

// Função para ler e transformar o Excel em array de objetos
function loadFAQ() {
  const workbook = xlsx.readFile(faqPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
}

// Função para procurar resposta no Excel
export function findFAQAnswer(userMessage) {
  const faqs = loadFAQ();
  const lowerMsg = userMessage.toLowerCase();

  for (const row of faqs) {
    const keyword = String(row["Pergunta (ou palavras-chave)"] || "").toLowerCase();
    if (lowerMsg.includes(keyword)) {
      return row["Resposta"] || null;
    }
  }

  return null;
}

import fs from "fs";
import path from "path";
import xlsx from "xlsx";

const faqPath = path.resolve("data/faq.xlsx");

export function findFAQAnswer(userQuestion) {
  if (!fs.existsSync(faqPath)) return null;

  const workbook = xlsx.readFile(faqPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = xlsx.utils.sheet_to_json(sheet);

  const match = data.find(item =>
    userQuestion.toLowerCase().includes(item.pergunta.toLowerCase())
  );

  return match ? match.resposta : null;
}

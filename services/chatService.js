import { saveMessage } from '../repositories/chatRepository.js';
import faqData from '../utils/faqData.js'; // perguntas e respostas do Excel

export async function handleUserMessage(message) {
  // Busca resposta automática simples no FAQ
  const found = faqData.find(item =>
    message.toLowerCase().includes(item.pergunta.toLowerCase())
  );

  const botResponse = found ? found.resposta : "Ainda não tenho uma resposta pra isso 😅";

  // Salva no banco
  const saved = await saveMessage(message, botResponse);
  return saved;
}

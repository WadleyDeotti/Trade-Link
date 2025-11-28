// models/chatModel.js
const faqData = [
  { pergunta: "como funciona", resposta: "O Trade Link conecta empresas e fornecedores para facilitar negociações e contratos." },
  { pergunta: "cadastro", resposta: "Você pode se cadastrar como empresa ou fornecedor na página de registro." },
  { pergunta: "contrato", resposta: "Nossa plataforma automatiza a criação de contratos comerciais entre as partes." },
  { pergunta: "suporte", resposta: "Para suporte técnico, entre em contato através do chat ou email." }
];

export function findFAQAnswer(userQuestion) {
  const match = faqData.find(item =>
    userQuestion.toLowerCase().includes(item.pergunta.toLowerCase())
  );
  
  return match ? match.resposta : null;
}

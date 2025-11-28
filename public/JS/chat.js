const messagesContainer = document.getElementById('messages-container');
const messageInput = document.getElementById('message-text');
const sendButton = document.getElementById('send-message');

async function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;

    // Adiciona a mensagem do usuário
    addMessage(text, 'sent');
    messageInput.value = '';

    // Chamada para API GPT
    try {

       const res = await fetch('/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        addMessage(data.reply, 'received');
    } catch (err) {
        console.error(err);
        addMessage("Erro ao se conectar com a IA.", 'received');
    }
}

function addMessage(text, type) {
    const div = document.createElement('div');
    div.classList.add('message', type);
    div.textContent = text;
    messagesContainer.appendChild(div);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

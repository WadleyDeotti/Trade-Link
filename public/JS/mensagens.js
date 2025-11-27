// mensagens.js
let usuarioId = USER_ID;            // vindo do EJS
let usuarioTipo = USER_TIPO;        // "empresa" ou "fornecedor"
let conversaAtiva = null;
let socket = io(); // se ainda não tiver socket.io, pode comentar esta linha

// ==============================
// 1️⃣ Carregar conversas
// ==============================
async function carregarConversas() {
  try {
    const res = await fetch(`/listar-conversas/${usuarioId}`);
    const conversas = await res.json();

    const lista = document.getElementById("conversations-list");
    lista.innerHTML = "";

    conversas.forEach(c => {
      const item = document.createElement("div");
      item.classList.add("conversa-item");
      item.dataset.id = c.id_conversa;
      item.innerHTML = `
        <strong>${c.nome_contato || "Contato"}</strong><br>
        <span>${c.ultima_mensagem ? c.ultima_mensagem.conteudo : "Sem mensagens"}</span>
      `;
      item.onclick = () => abrirConversa(c.id_conversa);
      lista.appendChild(item);
    });
  } catch (err) {
    console.error("Erro ao carregar conversas:", err);
  }
}

// ==============================
// 2️⃣ Abrir conversa
// ==============================
async function abrirConversa(id_conversa) {
  conversaAtiva = id_conversa;

  document.getElementById("messages-container").innerHTML = "<p>Carregando...</p>";

  try {
    const res = await fetch(`/listar-mensagens/${id_conversa}`);
    const msgs = await res.json();

    renderMensagens(msgs);
  } catch (err) {
    console.error("Erro ao carregar mensagens:", err);
  }
}

// ==============================
// 3️⃣ Enviar mensagem
// ==============================
async function enviarMensagem() {
  const input = document.getElementById("message-text");
  const conteudo = input.value.trim();
  if (!conteudo || !conversaAtiva) return;

  const payload = {
    id_conversa: conversaAtiva,
    remetente_id: usuarioId,
    tipo_remetente: usuarioTipo,
    conteudo
  };

  try {
    const res = await fetch("/enviar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const msg = await res.json();

    input.value = "";
    adicionarMensagemNaTela(msg);
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
  }
}

// ==============================
// 4️⃣ Renderizar mensagens
// ==============================
function renderMensagens(msgs) {
  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  msgs.forEach(m => adicionarMensagemNaTela(m));
  container.scrollTop = container.scrollHeight;
}

// ==============================
// 5️⃣ Adicionar mensagem à tela
// ==============================
function adicionarMensagemNaTela(msg) {
  const container = document.getElementById("messages-container");
  const div = document.createElement("div");
  div.classList.add("mensagem");
  div.classList.add(msg.remetente_id === usuarioId ? "enviada" : "recebida");

  div.innerHTML = `
    <div class="msg-conteudo">${msg.conteudo}</div>
    <div class="msg-hora">${formatarData(msg.enviado_em)}</div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// ==============================
// 6️⃣ Formatar data/hora
// ==============================
function formatarData(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// ==============================
// 7️⃣ Real-time (Socket.io)
// ==============================
if (socket) {
  socket.on("novaMensagem", msg => {
    if (msg.id_conversa === conversaAtiva) {
      adicionarMensagemNaTela(msg);
    } else {
      carregarConversas(); // atualiza prévia da lista
    }
  });
}

// ==============================
// 8️⃣ Eventos do front
// ==============================
document.getElementById("send-message").addEventListener("click", enviarMensagem);
document.getElementById("message-text").addEventListener("keypress", e => {
  if (e.key === "Enter") enviarMensagem();
});

// ==============================
// 9️⃣ Inicialização
// ==============================
carregarConversas();
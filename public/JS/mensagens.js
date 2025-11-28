let usuarioId = null;
let usuarioTipo = null;
let conversaAtiva = null;

// Carregar conversas
async function carregarConversas() {
  try {
    const res = await fetch(`/listar-conversas/${usuarioId}`);
    const conversas = await res.json();

    const lista = document.getElementById("conversations-list");
    lista.innerHTML = "";

    if (Array.isArray(conversas)) {
      conversas.forEach(c => {
        const item = document.createElement("div");
        item.classList.add("conversation");
        item.dataset.id = c.id_conversa;
        
        const nomeContato = c.nome_contato || "Contato";
        
        item.innerHTML = `
          <div class="conversation-avatar">
            <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(nomeContato)}&background=38528D&color=fff" alt="${nomeContato}">
          </div>
          <div class="conversation-info">
            <div class="conversation-name">${nomeContato}</div>
            <div class="conversation-preview">${c.ultima_msg || "Sem mensagens"}</div>
          </div>
          <div class="conversation-meta">
            <div class="conversation-time">Agora</div>
            ${c.nao_lidas > 0 ? `<div class="conversation-badge">${c.nao_lidas}</div>` : ''}
          </div>
        `;
        
        item.onclick = () => abrirConversa(c.id_conversa, nomeContato);
        lista.appendChild(item);
      });
    }
  } catch (err) {
    console.error("Erro ao carregar conversas:", err);
  }
}

// Abrir conversa
async function abrirConversa(id_conversa, nomeContato) {
  conversaAtiva = id_conversa;

  document.querySelector('.contact-name').textContent = nomeContato;
  document.querySelector('.contact-status').textContent = 'Online';
  document.getElementById('conversation-actions').style.display = 'flex';
  document.getElementById('message-input-container').style.display = 'flex';
  document.getElementById('empty-conversation').style.display = 'none';

  document.querySelectorAll('.conversation').forEach(c => c.classList.remove('active'));
  const conversaElement = document.querySelector(`[data-id="${id_conversa}"]`);
  if (conversaElement) conversaElement.classList.add('active');

  try {
    const res = await fetch(`/listar-mensagens/${id_conversa}`);
    const msgs = await res.json();
    renderMensagens(msgs);
  } catch (err) {
    console.error("Erro ao carregar mensagens:", err);
  }
}

// Enviar mensagem
async function enviarMensagem() {
  const input = document.getElementById("message-text");
  const conteudo = input.value.trim();
  if (!conteudo || !conversaAtiva) return;

  const payload = {
    id_conversa: conversaAtiva,
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

// Renderizar mensagens
function renderMensagens(msgs) {
  const container = document.getElementById("messages-container");
  container.innerHTML = "";

  if (Array.isArray(msgs)) {
    msgs.forEach(m => adicionarMensagemNaTela(m));
  }
  container.scrollTop = container.scrollHeight;
}

// Adicionar mensagem à tela
function adicionarMensagemNaTela(msg) {
  const container = document.getElementById("messages-container");
  const div = document.createElement("div");
  div.classList.add("message");
  div.classList.add(msg.remetente_id === usuarioId ? "sent" : "received");

  div.innerHTML = `
    <div class="message-avatar">
      <img src="https://ui-avatars.com/api/?name=User&background=38528D&color=fff&size=36" alt="User">
    </div>
    <div class="message-content">
      <div class="message-text">${msg.conteudo}</div>
      <div class="message-time">${formatarData(msg.enviado_em)}</div>
    </div>
  `;

  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

// Formatar data
function formatarData(dt) {
  if (!dt) return "";
  const d = new Date(dt);
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

// Carregar dados do usuário
async function carregarDadosUsuario() {
  try {
    const res = await fetch('/api/usuario-atual');
    const usuario = await res.json();
    
    if (usuario) {
      usuarioId = usuario.id_fornecedor || usuario.id_empresa;
      usuarioTipo = usuario.id_fornecedor ? 'fornecedor' : 'empresa';
    }
  } catch (err) {
    console.error('Erro ao carregar dados do usuário:', err);
  }
}

// Carregar contatos
async function carregarContatos() {
  try {
    const res = await fetch('/api/contatos');
    const contatos = await res.json();
    
    const lista = document.getElementById('contacts-list');
    lista.innerHTML = '';
    
    if (Array.isArray(contatos)) {
      contatos.forEach(contato => {
        const item = document.createElement('div');
        item.classList.add('contact-item');
        item.style.cssText = 'padding: 10px; border: 1px solid #ddd; margin: 5px 0; cursor: pointer; border-radius: 5px;';
        
        item.innerHTML = `
          <div style="font-weight: bold;">${contato.nome_fantasia}</div>
          <div style="font-size: 12px; color: #666;">${contato.tipo === 'fornecedor' ? 'Fornecedor' : 'Empresa'}</div>
          <div style="font-size: 12px; color: #666;">${contato.email}</div>
        `;
        
        item.onclick = () => iniciarConversa(contato);
        lista.appendChild(item);
      });
    }
  } catch (err) {
    console.error('Erro ao carregar contatos:', err);
  }
}

// Iniciar nova conversa
async function iniciarConversa(contato) {
  try {
    const usuario2 = contato.id_fornecedor || contato.id_empresa;
    const tipo2 = contato.tipo;
    
    const res = await fetch('/criar-conversa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario2, tipo2 })
    });
    
    const conversa = await res.json();
    document.getElementById('new-conversation-modal').style.display = 'none';
    
    await carregarConversas();
    abrirConversa(conversa.id_conversa, contato.nome_fantasia);
  } catch (err) {
    console.error('Erro ao criar conversa:', err);
  }
}

// Inicializar modais
function inicializarModais() {
  const btnNovaConversa = document.getElementById('new-conversation');
  const modal = document.getElementById('new-conversation-modal');
  
  if (btnNovaConversa && modal) {
    btnNovaConversa.addEventListener('click', (e) => {
      e.preventDefault();
      modal.style.display = 'block';
      carregarContatos();
    });
  }

  document.querySelectorAll('.close, .close-modal').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
      });
    });
  });

  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
    }
  });
}

// Eventos
document.addEventListener('DOMContentLoaded', async () => {
  await carregarDadosUsuario();
  if (usuarioId) {
    await carregarConversas();
  }
  inicializarModais();
  
  // Event listeners
  const sendBtn = document.getElementById("send-message");
  const messageInput = document.getElementById("message-text");
  
  if (sendBtn) sendBtn.addEventListener("click", enviarMensagem);
  if (messageInput) {
    messageInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
      }
    });
  }
});
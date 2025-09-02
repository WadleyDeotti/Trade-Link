// mensagens.js - Sistema de chat para TradeLink (Versão Melhorada)
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const conversationsList = document.getElementById('conversations-list');
    const messagesContainer = document.getElementById('messages-container');
    const messageInput = document.getElementById('message-text');
    const sendButton = document.getElementById('send-message');
    const newConversationBtn = document.getElementById('new-conversation');
    const newConversationModal = document.getElementById('new-conversation-modal');
    const closeModalButtons = document.querySelectorAll('.close, .close-modal');
    const toggleContactInfoBtn = document.getElementById('toggle-contact-info');
    const contactInfoPanel = document.getElementById('contact-info-panel');
    const closeContactInfoBtn = document.getElementById('close-contact-info');
    const editConversationBtn = document.getElementById('edit-conversation');
    const editContactProfileBtn = document.getElementById('edit-contact-profile');
    const emptyConversation = document.getElementById('empty-conversation');
    const messageInputContainer = document.getElementById('message-input-container');
    const conversationActions = document.getElementById('conversation-actions');
    const contactAvatarClickable = document.getElementById('contact-avatar-clickable');
    
    // Modais
    const editConversationModal = document.getElementById('edit-conversation-modal');
    const editContactModal = document.getElementById('edit-contact-modal');
    
    // Dados da aplicação
    let conversations = [];
    let contacts = [];
    let currentConversationId = null;
    let currentContactId = null;
    
    // Inicialização
    init();
    
    function init() {
        loadData();
        setupEventListeners();
        renderConversations();
        
        // Mostra o estado inicial (nenhuma conversa selecionada)
        showEmptyConversation();
    }
    
    function loadData() {
        // Carrega dados do localStorage ou usa dados padrão
        const savedConversations = localStorage.getItem('tradeLinkConversations');
        const savedContacts = localStorage.getItem('tradeLinkContacts');
        
        if (savedConversations) {
            conversations = JSON.parse(savedConversations);
        } else {
            // Dados de exemplo para conversas
            conversations = [
                {
                    id: 'fornecedor-abc',
                    name: 'Fornecedor ABC',
                    avatar: 'https://ui-avatars.com/api/?name=Fornecedor+ABC&background=38528D&color=fff',
                    lastMessage: 'Ótimo, enviaremos amanhã!',
                    lastMessageTime: '10:45',
                    unreadCount: 3,
                    messages: [
                        { type: 'received', text: 'Olá, gostaria de confirmar o pedido #TL-1045', time: '09:30' },
                        { type: 'sent', text: 'Sim, o pedido está confirmado. Quando será enviado?', time: '09:32' },
                        { type: 'received', text: 'Podemos enviar amanhã pela manhã', time: '09:35' },
                        { type: 'sent', text: 'Perfeito! E o código de rastreamento?', time: '09:36' },
                        { type: 'received', text: 'Enviaremos por email assim que disponível', time: '09:40' },
                        { type: 'sent', text: 'Ótimo, obrigado!', time: '09:41' },
                        { type: 'received', text: 'Por nada! Estamos à disposição da TradeLink', time: '09:45' }
                    ],
                    muted: false,
                    notifications: 'all'
                },
                {
                    id: 'cliente-xyz',
                    name: 'Cliente XYZ',
                    avatar: 'https://ui-avatars.com/api/?name=Cliente+XYZ&background=3498db&color=fff',
                    lastMessage: 'Preciso de um orçamento urgente',
                    lastMessageTime: 'Ontem',
                    unreadCount: 0,
                    messages: [
                        { type: 'received', text: 'Bom dia, preciso de um orçamento urgente para material de construção', time: '14:20' },
                        { type: 'sent', text: 'Bom dia! Claro, me passe os detalhes por favor.', time: '14:22' },
                        { type: 'received', text: 'Preciso de 100 sacos de cimento e 500 tijolos', time: '14:25' },
                        { type: 'sent', text: 'Certo, vou calcular e retorno em alguns minutos.', time: '14:26' }
                    ],
                    muted: false,
                    notifications: 'all'
                }
            ];
        }
        
        if (savedContacts) {
            contacts = JSON.parse(savedContacts);
        } else {
            // Dados de exemplo para contatos
            contacts = [
                {
                    id: 'fornecedor-abc',
                    name: 'Fornecedor ABC',
                    avatar: 'https://ui-avatars.com/api/?name=Fornecedor+ABC&background=38528D&color=fff',
                    company: 'Fornecedor oficial TradeLink',
                    email: 'contato@fornecedorabc.com',
                    phone: '(11) 3456-7890',
                    address: 'São Paulo, SP',
                    companyName: 'Fornecedor ABC Ltda',
                    cnpj: '12.345.678/0001-90'
                },
                {
                    id: 'cliente-xyz',
                    name: 'Cliente XYZ',
                    avatar: 'https://ui-avatars.com/api/?name=Cliente+XYZ&background=3498db&color=fff',
                    company: 'Construtora',
                    email: 'contato@clientexyz.com',
                    phone: '(11) 9876-5432',
                    address: 'Rio de Janeiro, RJ',
                    companyName: 'Cliente XYZ Construções',
                    cnpj: '98.765.432/0001-10'
                },
                {
                    id: 'logistica-123',
                    name: 'Logística 123',
                    avatar: 'https://ui-avatars.com/api/?name=Logistica+123&background=2ecc71&color=fff',
                    company: 'Transportadora',
                    email: 'contato@logistica123.com',
                    phone: '(11) 2345-6789',
                    address: 'Minas Gerais, MG',
                    companyName: 'Logística 123 Ltda',
                    cnpj: '23.456.789/0001-11'
                },
                {
                    id: 'financeiro-tl',
                    name: 'Financeiro TradeLink',
                    avatar: 'https://ui-avatars.com/api/?name=Financeiro+TL&background=f39c12&color=fff',
                    company: 'Departamento Financeiro',
                    email: 'financeiro@tradelink.com',
                    phone: '(11) 3456-7890',
                    address: 'São Paulo, SP',
                    companyName: 'TradeLink Ltda',
                    cnpj: '12.345.678/0001-90'
                }
            ];
        }
        
        saveData();
    }
    
    function saveData() {
        localStorage.setItem('tradeLinkConversations', JSON.stringify(conversations));
        localStorage.setItem('tradeLinkContacts', JSON.stringify(contacts));
    }
    
    function setupEventListeners() {
        // Nova conversa
        newConversationBtn.addEventListener('click', () => {
            renderContactsList();
            newConversationModal.style.display = 'flex';
        });
        
        // Fechar modais
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Fecha o modal ao clicar fora do conteúdo
        window.addEventListener('click', function(event) {
            if (event.target === newConversationModal) {
                newConversationModal.style.display = 'none';
            }
            if (event.target === editConversationModal) {
                editConversationModal.style.display = 'none';
            }
            if (event.target === editContactModal) {
                editContactModal.style.display = 'none';
            }
        });
        
        // Enviar mensagem
        sendButton.addEventListener('click', sendMessage);
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
        
        // Ajustar altura do textarea automaticamente
        messageInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });
        
        // Toggle informações do contato
        toggleContactInfoBtn.addEventListener('click', toggleContactInfo);
        closeContactInfoBtn.addEventListener('click', closeContactInfo);
        contactAvatarClickable.addEventListener('click', toggleContactInfo);
        
        // Editar conversa
        editConversationBtn.addEventListener('click', openEditConversationModal);
        
        // Editar perfil do contato
        editContactProfileBtn.addEventListener('click', openEditContactModal);
        
        // Buscar conversas
        const searchInput = document.getElementById('search-conversations');
        searchInput.addEventListener('input', debounce(filterConversations, 300));
        
        // Buscar contatos (nova conversa)
        const contactSearch = document.getElementById('conversation-search');
        contactSearch.addEventListener('input', debounce(filterContacts, 300));
        
        // Formulário de nova conversa
        const newConversationForm = document.getElementById('new-conversation-form');
        newConversationForm.addEventListener('submit', handleNewConversation);
        
        // Formulário de edição de conversa
        const editConversationForm = document.getElementById('edit-conversation-form');
        editConversationForm.addEventListener('submit', handleEditConversation);
        
        // Excluir conversa
        const deleteConversationBtn = document.getElementById('delete-conversation');
        deleteConversationBtn.addEventListener('click', deleteCurrentConversation);
        
        // Formulário de edição de contato
        const editContactForm = document.getElementById('edit-contact-form');
        editContactForm.addEventListener('submit', handleEditContact);
        
        // Botões de edição de informações
        const editInfoButtons = document.querySelectorAll('.edit-info');
        editInfoButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const field = this.dataset.field;
                editContactInfoField(field);
            });
        });
    }
    
    function renderConversations() {
        conversationsList.innerHTML = '';
        
        if (conversations.length === 0) {
            conversationsList.innerHTML = `
                <div class="empty-contacts">
                    <i class="fas fa-comments"></i>
                    <p>Nenhuma conversa encontrada</p>
                </div>
            `;
            return;
        }
        
        conversations.forEach(conversation => {
            const conversationElement = document.createElement('div');
            conversationElement.className = 'conversation';
            conversationElement.dataset.id = conversation.id;
            
            if (conversation.id === currentConversationId) {
                conversationElement.classList.add('active');
            }
            
            conversationElement.innerHTML = `
                <div class="conversation-avatar">
                    <img src="${conversation.avatar}" alt="${conversation.name}">
                </div>
                <div class="conversation-info">
                    <div class="conversation-name">${conversation.name}</div>
                    <div class="conversation-preview">${conversation.lastMessage}</div>
                </div>
                <div class="conversation-meta">
                    <div class="conversation-time">${conversation.lastMessageTime}</div>
                    ${conversation.unreadCount > 0 ? `<div class="conversation-badge">${conversation.unreadCount}</div>` : ''}
                </div>
            `;
            
            conversationElement.addEventListener('click', () => {
                selectConversation(conversation.id);
            });
            
            conversationsList.appendChild(conversationElement);
        });
    }
    
    function renderContactsList() {
        const contactsList = document.getElementById('contacts-list');
        contactsList.innerHTML = '';
        
        // Filtra contatos que já não têm conversa
        const availableContacts = contacts.filter(contact => 
            !conversations.some(conv => conv.id === contact.id)
        );
        
        if (availableContacts.length === 0) {
            contactsList.innerHTML = `
                <div class="empty-contacts">
                    <i class="fas fa-users"></i>
                    <p>Todos os contatos já possuem conversas</p>
                </div>
            `;
            return;
        }
        
        availableContacts.forEach(contact => {
            const contactElement = document.createElement('div');
            contactElement.className = 'contact-item';
            
            contactElement.innerHTML = `
                <div class="contact-avatar">
                    <img src="${contact.avatar}" alt="${contact.name}">
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-detail">${contact.company}</div>
                </div>
                <button type="button" class="btn btn-primary btn-sm select-contact" data-id="${contact.id}">Selecionar</button>
            `;
            
            contactsList.appendChild(contactElement);
        });
        
        // Adiciona event listeners aos botões de seleção
        document.querySelectorAll('.select-contact').forEach(btn => {
            btn.addEventListener('click', function() {
                const contactId = this.dataset.id;
                document.getElementById('conversation-search').value = '';
                filterContacts(); // Limpa a busca
                
                // Preenche automaticamente o formulário
                const contact = contacts.find(c => c.id === contactId);
                if (contact) {
                    startNewConversation(contactId);
                }
            });
        });
    }
    
    function selectConversation(conversationId) {
        currentConversationId = conversationId;
        const conversation = conversations.find(c => c.id === conversationId);
        
        if (!conversation) return;
        
        // Atualiza a UI
        document.querySelectorAll('.conversation').forEach(c => c.classList.remove('active'));
        document.querySelector(`.conversation[data-id="${conversationId}"]`).classList.add('active');
        
        // Mostra a área de conversa
        hideEmptyConversation();
        
        // Atualiza o cabeçalho da conversa
        const currentContact = document.getElementById('current-contact');
        currentContact.innerHTML = `
            <div class="contact-avatar" id="contact-avatar-clickable">
                <img src="${conversation.avatar}" alt="${conversation.name}">
            </div>
            <div class="contact-info">
                <div class="contact-name">${conversation.name}</div>
                <div class="contact-status">Online</div>
            </div>
        `;
        
        // Adiciona novamente o event listener ao avatar
        document.getElementById('contact-avatar-clickable').addEventListener('click', toggleContactInfo);
        
        // Mostra os botões de ação
        conversationActions.style.display = 'flex';
        
        // Carrega as mensagens
        loadMessages(conversationId);
        
        // Reseta a contagem de mensagens não lidas
        resetUnreadCount(conversationId);
        
        // Carrega as informações do contato
        currentContactId = conversationId;
        loadContactInfo(conversationId);
    }
    
    function loadMessages(conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (!conversation) return;
        
        messagesContainer.innerHTML = '';
        
        // Adiciona o divisor do dia
        const dayDivider = document.createElement('div');
        dayDivider.className = 'message-day-divider';
        dayDivider.innerHTML = '<span>Hoje</span>';
        messagesContainer.appendChild(dayDivider);
        
        // Adiciona as mensagens
        conversation.messages.forEach(message => {
            addMessageToChat(message.type, message.text, message.time, false);
        });
        
        // Rola para a última mensagem
        scrollToBottom();
    }
    
    function addMessageToChat(type, text, time, saveToConversation = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        if (type === 'received') {
            const conversation = conversations.find(c => c.id === currentConversationId);
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <img src="${conversation.avatar}" alt="Remetente">
                </div>
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <div class="message-text">${text}</div>
                    <div class="message-time">${time}</div>
                </div>
            `;
        }
        
        messagesContainer.appendChild(messageDiv);
        
        // Salva a mensagem na conversa se necessário
        if (saveToConversation && currentConversationId) {
            const conversation = conversations.find(c => c.id === currentConversationId);
            if (conversation) {
                conversation.messages.push({ type, text, time });
                conversation.lastMessage = text;
                conversation.lastMessageTime = time;
                saveData();
            }
        }
    }
    
    function sendMessage() {
        const message = messageInput.value.trim();
        
        if (message && currentConversationId) {
            // Adiciona a mensagem ao chat
            const now = new Date();
            const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            addMessageToChat('sent', message, time);
            
            // Simula uma resposta após um curto período
            setTimeout(() => {
                const responses = [
                    "Entendido!",
                    "Vou verificar isso para você.",
                    "Ótimo, obrigado pela informação!",
                    "Perfeito, vamos processar sua solicitação.",
                    "Certo, anotado!"
                ];
                
                const randomResponse = responses[Math.floor(Math.random() * responses.length)];
                addMessageToChat('received', randomResponse, new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                
                // Rola para a última mensagem
                scrollToBottom();
            }, 1000 + Math.random() * 2000);
            
            // Limpa o campo de entrada
            messageInput.value = '';
            messageInput.style.height = 'auto';
            
            // Rola para a última mensagem
            scrollToBottom();
            
            // Atualiza a lista de conversas
            renderConversations();
        }
    }
    
    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    function showEmptyConversation() {
        emptyConversation.style.display = 'block';
        messageInputContainer.style.display = 'none';
        conversationActions.style.display = 'none';
        
        // Reseta o cabeçalho
        const currentContact = document.getElementById('current-contact');
        currentContact.innerHTML = `
            <div class="contact-avatar" id="contact-avatar-clickable">
                <img src="https://ui-avatars.com/api/?name=TradeLink&background=38528D&color=fff" alt="TradeLink">
            </div>
            <div class="contact-info">
                <div class="contact-name">Selecione uma conversa</div>
                <div class="contact-status">Clique em uma conversa para começar</div>
            </div>
        `;
        
        // Adiciona novamente o event listener ao avatar
        document.getElementById('contact-avatar-clickable').addEventListener('click', () => {
            showNotification('Selecione uma conversa primeiro');
        });
    }
    
    function hideEmptyConversation() {
        emptyConversation.style.display = 'none';
        messageInputContainer.style.display = 'flex';
    }
    
    function toggleContactInfo() {
        if (!currentContactId) {
            showNotification('Selecione uma conversa primeiro');
            return;
        }
        
        contactInfoPanel.classList.toggle('open');
    }
    
    function closeContactInfo() {
        contactInfoPanel.classList.remove('open');
    }
    
    function loadContactInfo(contactId) {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        document.getElementById('contact-avatar-large').src = contact.avatar;
        document.getElementById('contact-name-large').textContent = contact.name;
        document.getElementById('contact-company').textContent = contact.company;
        document.getElementById('contact-email').textContent = contact.email;
        document.getElementById('contact-phone').textContent = contact.phone;
        document.getElementById('contact-address').textContent = contact.address;
        document.getElementById('contact-company-name').textContent = contact.companyName;
        document.getElementById('contact-cnpj').textContent = `CNPJ: ${contact.cnpj}`;
    }
    
    function openEditConversationModal() {
        if (!currentConversationId) return;
        
        const conversation = conversations.find(c => c.id === currentConversationId);
        if (!conversation) return;
        
        document.getElementById('edit-conversation-id').value = conversation.id;
        document.getElementById('edit-conversation-name').value = conversation.name;
        document.getElementById('edit-conversation-notifications').value = conversation.notifications;
        document.getElementById('edit-conversation-muted').checked = conversation.muted;
        
        editConversationModal.style.display = 'flex';
    }
    
    function handleEditConversation(e) {
        e.preventDefault();
        
        const conversationId = document.getElementById('edit-conversation-id').value;
        const name = document.getElementById('edit-conversation-name').value;
        const notifications = document.getElementById('edit-conversation-notifications').value;
        const muted = document.getElementById('edit-conversation-muted').checked;
        
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.name = name;
            conversation.notifications = notifications;
            conversation.muted = muted;
            
            saveData();
            renderConversations();
            
            showNotification('Conversa atualizada com sucesso!');
            editConversationModal.style.display = 'none';
        }
    }
    
    function deleteCurrentConversation() {
        if (!currentConversationId) return;
        
        if (confirm('Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.')) {
            conversations = conversations.filter(c => c.id !== currentConversationId);
            saveData();
            renderConversations();
            
            // Volta para o estado inicial
            currentConversationId = null;
            showEmptyConversation();
            closeContactInfo();
            
            showNotification('Conversa excluída com sucesso!');
            editConversationModal.style.display = 'none';
        }
    }
    
    function openEditContactModal() {
        if (!currentContactId) return;
        
        const contact = contacts.find(c => c.id === currentContactId);
        if (!contact) return;
        
        document.getElementById('edit-contact-id').value = contact.id;
        document.getElementById('edit-contact-avatar').value = contact.avatar;
        document.getElementById('edit-contact-name').value = contact.name;
        document.getElementById('edit-contact-company').value = contact.company;
        document.getElementById('edit-contact-email').value = contact.email;
        document.getElementById('edit-contact-phone').value = contact.phone;
        document.getElementById('edit-contact-address').value = contact.address;
        document.getElementById('edit-contact-cnpj').value = contact.cnpj;
        
        editContactModal.style.display = 'flex';
    }
    
    function handleEditContact(e) {
        e.preventDefault();
        
        const contactId = document.getElementById('edit-contact-id').value;
        const avatar = document.getElementById('edit-contact-avatar').value;
        const name = document.getElementById('edit-contact-name').value;
        const company = document.getElementById('edit-contact-company').value;
        const email = document.getElementById('edit-contact-email').value;
        const phone = document.getElementById('edit-contact-phone').value;
        const address = document.getElementById('edit-contact-address').value;
        const cnpj = document.getElementById('edit-contact-cnpj').value;
        
        const contact = contacts.find(c => c.id === contactId);
        if (contact) {
            contact.avatar = avatar;
            contact.name = name;
            contact.company = company;
            contact.email = email;
            contact.phone = phone;
            contact.address = address;
            contact.cnpj = cnpj;
            
            // Atualiza também a conversa correspondente
            const conversation = conversations.find(c => c.id === contactId);
            if (conversation) {
                conversation.name = name;
                conversation.avatar = avatar;
            }
            
            saveData();
            renderConversations();
            loadContactInfo(contactId);
            
            showNotification('Perfil atualizado com sucesso!');
            editContactModal.style.display = 'none';
        }
    }
    
    function editContactInfoField(field) {
        const currentValue = document.getElementById(`contact-${field}`).textContent;
        const newValue = prompt(`Editar ${field}:`, currentValue);
        
        if (newValue !== null && newValue !== currentValue) {
            const contact = contacts.find(c => c.id === currentContactId);
            if (contact) {
                contact[field] = newValue;
                document.getElementById(`contact-${field}`).textContent = newValue;
                saveData();
                showNotification('Informação atualizada com sucesso!');
            }
        }
    }
    
    function startNewConversation(contactId) {
        const contact = contacts.find(c => c.id === contactId);
        if (!contact) return;
        
        // Verifica se já existe uma conversa com este contato
        const existingConversation = conversations.find(c => c.id === contactId);
        if (existingConversation) {
            selectConversation(contactId);
            newConversationModal.style.display = 'none';
            return;
        }
        
        // Cria uma nova conversa
        const newConversation = {
            id: contactId,
            name: contact.name,
            avatar: contact.avatar,
            lastMessage: 'Conversa iniciada',
            lastMessageTime: 'Agora',
            unreadCount: 0,
            messages: [
                { type: 'received', text: 'Olá! Como posso ajudar?', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
            ],
            muted: false,
            notifications: 'all'
        };
        
        conversations.push(newConversation);
        saveData();
        renderConversations();
        
        // Seleciona a nova conversa
        selectConversation(contactId);
        
        showNotification('Nova conversa iniciada!');
        newConversationModal.style.display = 'none';
    }
    
    function handleNewConversation(e) {
        e.preventDefault();
        
        // Esta função agora é tratada pelos botões "Selecionar" individuais
        // Mantida para não quebrar o formulário
        showNotification('Selecione um contato da lista');
    }
    
    function resetUnreadCount(conversationId) {
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            conversation.unreadCount = 0;
            saveData();
            renderConversations();
        }
    }
    
    function filterConversations() {
        const searchTerm = document.getElementById('search-conversations').value.toLowerCase();
        
        document.querySelectorAll('.conversation').forEach(conversation => {
            const conversationName = conversation.querySelector('.conversation-name').textContent.toLowerCase();
            const conversationPreview = conversation.querySelector('.conversation-preview').textContent.toLowerCase();
            
            if (conversationName.includes(searchTerm) || conversationPreview.includes(searchTerm)) {
                conversation.style.display = 'flex';
            } else {
                conversation.style.display = 'none';
            }
        });
    }
    
    function filterContacts() {
        const searchTerm = document.getElementById('conversation-search').value.toLowerCase();
        const contactItems = document.querySelectorAll('.contact-item');
        
        contactItems.forEach(item => {
            const contactName = item.querySelector('.contact-name').textContent.toLowerCase();
            const contactDetail = item.querySelector('.contact-detail').textContent.toLowerCase();
            
            if (contactName.includes(searchTerm) || contactDetail.includes(searchTerm)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    function closeAllModals() {
        newConversationModal.style.display = 'none';
        editConversationModal.style.display = 'none';
        editContactModal.style.display = 'none';
    }
    
    function showNotification(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        // Alterar ícone e cor baseado no tipo
        if (type === 'error') {
            toast.className = 'toast error';
            toastIcon.className = 'fas fa-exclamation-circle';
        } else if (type === 'warning') {
            toast.className = 'toast warning';
            toastIcon.className = 'fas fa-exclamation-triangle';
        } else if (type === 'info') {
            toast.className = 'toast info';
            toastIcon.className = 'fas fa-info-circle';
        } else {
            toast.className = 'toast';
            toastIcon.className = 'fas fa-check-circle';
        }
        
        toast.classList.add('show');
        
        // Esconder após 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Utilitário para debounce (evitar múltiplas execuções rápidas)
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});
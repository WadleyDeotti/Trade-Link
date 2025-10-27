// status.js - Sistema de Status em Tempo Real
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const refreshBtn = document.getElementById('refresh-status');
    const testNotificationsBtn = document.getElementById('test-notifications');
    const markAllReadBtn = document.getElementById('mark-all-read');
    const clearNotificationsBtn = document.getElementById('clear-notifications');
    const exportActivityBtn = document.getElementById('export-activity');
    const exportOrdersBtn = document.getElementById('export-orders');
    
    // Filtros
    const periodFilter = document.getElementById('status-period');
    const typeFilter = document.getElementById('status-type');
    const roleFilter = document.getElementById('user-role');
    
    // Elementos de dados
    const ordersCount = document.getElementById('orders-count');
    const pendingOrders = document.getElementById('pending-orders');
    const processingOrders = document.getElementById('processing-orders');
    const completedOrders = document.getElementById('completed-orders');
    const ordersTrend = document.getElementById('orders-trend');
    
    const contractsCount = document.getElementById('contracts-count');
    const draftContracts = document.getElementById('draft-contracts');
    const pendingSignature = document.getElementById('pending-signature');
    const signedContracts = document.getElementById('signed-contracts');
    const contractsTrend = document.getElementById('contracts-trend');
    
    const messagesCount = document.getElementById('messages-count');
    const unreadMessages = document.getElementById('unread-messages');
    const sentMessages = document.getElementById('sent-messages');
    const receivedMessages = document.getElementById('received-messages');
    const messagesTrend = document.getElementById('messages-trend');
    
    const usersCount = document.getElementById('users-count');
    const activeUsers = document.getElementById('active-users');
    const suppliersCount = document.getElementById('suppliers-count');
    const buyersCount = document.getElementById('buyers-count');
    const usersTrend = document.getElementById('users-trend');
    
    // Containers
    const activityTimeline = document.getElementById('activity-timeline');
    const ordersDistribution = document.getElementById('orders-distribution');
    const notificationsList = document.getElementById('notifications-list');
    const connectionStatus = document.getElementById('connection-status');
    
    // Modais
    const detailsModal = document.getElementById('details-modal');
    const toast = document.getElementById('toast');
    
    // Estado do sistema
    let statusData = {
        orders: {
            total: 0,
            pending: 0,
            processing: 0,
            completed: 0,
            trend: 0
        },
        contracts: {
            total: 0,
            draft: 0,
            pendingSignature: 0,
            signed: 0,
            trend: 0
        },
        messages: {
            total: 0,
            unread: 0,
            sent: 0,
            received: 0,
            trend: 0
        },
        users: {
            total: 0,
            active: 0,
            suppliers: 0,
            buyers: 0,
            trend: 0
        },
        activities: [],
        notifications: [],
        lastUpdate: null
    };

    // Conexão WebSocket (simulada)
    let wsConnection = null;
    let isConnected = false;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    // Inicialização
    initStatusSystem();

    function initStatusSystem() {
        setupEventListeners();
        loadInitialData();
        connectWebSocket();
        startAutoRefresh();
    }

    function setupEventListeners() {
        // Botões de ação
        refreshBtn.addEventListener('click', refreshAllData);
        testNotificationsBtn.addEventListener('click', testNotifications);
        markAllReadBtn.addEventListener('click', markAllAsRead);
        clearNotificationsBtn.addEventListener('click', clearNotifications);
        exportActivityBtn.addEventListener('click', exportActivityData);
        exportOrdersBtn.addEventListener('click', exportOrdersData);

        // Filtros
        periodFilter.addEventListener('change', applyFilters);
        typeFilter.addEventListener('change', applyFilters);
        roleFilter.addEventListener('change', applyFilters);

        // Modal
        document.querySelector('#details-modal .close').addEventListener('click', closeModal);
        document.getElementById('close-modal').addEventListener('click', closeModal);

        // Fechar modal ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === detailsModal) {
                closeModal();
            }
        });

        // Prevenir quebra de conexão por inatividade
        document.addEventListener('mousemove', resetInactivityTimer);
        document.addEventListener('keypress', resetInactivityTimer);
    }

    // ======================
    // INTEGRAÇÃO BACK-END
    // ======================

    function loadInitialData() {
        // TODO: Substituir por chamadas API reais
        // fetch('/api/status/dashboard')
        //   .then(response => response.json())
        //   .then(data => updateStatusData(data));

        // Dados mock para demonstração
        const mockData = {
            orders: {
                total: 147,
                pending: 23,
                processing: 45,
                completed: 79,
                trend: 12.5
            },
            contracts: {
                total: 89,
                draft: 15,
                pendingSignature: 8,
                signed: 66,
                trend: 8.3
            },
            messages: {
                total: 234,
                unread: 12,
                sent: 145,
                received: 89,
                trend: -2.1
            },
            users: {
                total: 156,
                active: 142,
                suppliers: 89,
                buyers: 67,
                trend: 15.8
            },
            activities: [
                {
                    id: 1,
                    type: 'order',
                    title: 'Novo Pedido Recebido',
                    description: 'Pedido #ORD-00123 da Construtora ABC',
                    time: new Date(Date.now() - 5 * 60000),
                    icon: 'shopping-cart',
                    color: 'success'
                },
                {
                    id: 2,
                    type: 'contract',
                    title: 'Contrato Assinado',
                    description: 'Contrato #CT-0456 foi assinado por ambas as partes',
                    time: new Date(Date.now() - 12 * 60000),
                    icon: 'file-signature',
                    color: 'info'
                },
                {
                    id: 3,
                    type: 'message',
                    title: 'Nova Mensagem',
                    description: 'Mensagem de João Silva sobre pedido #ORD-00120',
                    time: new Date(Date.now() - 25 * 60000),
                    icon: 'envelope',
                    color: 'warning'
                }
            ],
            notifications: [
                {
                    id: 1,
                    type: 'warning',
                    title: 'Pedido Atrasado',
                    message: 'O pedido #ORD-00118 está atrasado na entrega',
                    time: new Date(Date.now() - 2 * 60000),
                    read: false,
                    icon: 'exclamation-triangle'
                },
                {
                    id: 2,
                    type: 'info',
                    title: 'Novo Contrato',
                    message: 'Um novo contrato está aguardando sua revisão',
                    time: new Date(Date.now() - 15 * 60000),
                    read: false,
                    icon: 'file-contract'
                },
                {
                    id: 3,
                    type: 'success',
                    title: 'Pagamento Confirmado',
                    message: 'Pagamento do pedido #ORD-00115 foi confirmado',
                    time: new Date(Date.now() - 45 * 60000),
                    read: true,
                    icon: 'check-circle'
                }
            ]
        };

        updateStatusData(mockData);
        showToast('Sistema de status carregado com sucesso!');
    }

    function refreshAllData() {
        refreshBtn.disabled = true;
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Atualizando...';

        // TODO: Substituir por chamada API real
        // fetch('/api/status/refresh')
        //   .then(response => response.json())
        //   .then(data => {
        //       updateStatusData(data);
        //       refreshBtn.disabled = false;
        //       refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
        //       showToast('Dados atualizados com sucesso!');
        //   });

        // Simulação de atualização
        setTimeout(() => {
            // Atualizar alguns dados para simular mudanças
            statusData.orders.pending = Math.max(0, statusData.orders.pending + Math.floor(Math.random() * 3) - 1);
            statusData.orders.processing = Math.max(0, statusData.orders.processing + Math.floor(Math.random() * 5) - 2);
            statusData.messages.unread = Math.max(0, statusData.messages.unread + Math.floor(Math.random() * 2));
            
            updateUI();
            refreshBtn.disabled = false;
            refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Atualizar';
            showToast('Dados atualizados com sucesso!');
        }, 1000);
    }

    function connectWebSocket() {
        // TODO: Substituir por WebSocket real
        // wsConnection = new WebSocket('ws://localhost:3001/api/status/ws');
        
        updateConnectionStatus('connecting');
        
        // Simulação de conexão WebSocket
        setTimeout(() => {
            isConnected = true;
            reconnectAttempts = 0;
            updateConnectionStatus('connected');
            
            // Simular recebimento de atualizações em tempo real
            setInterval(() => {
                if (isConnected && Math.random() > 0.7) { // 30% de chance de nova atividade
                    receiveRealTimeUpdate();
                }
            }, 10000);
            
        }, 2000);

        // Simular handlers de WebSocket
        wsConnection = {
            onmessage: function(event) {
                const data = JSON.parse(event.data);
                handleRealTimeData(data);
            },
            onclose: function() {
                handleConnectionClose();
            },
            onerror: function() {
                handleConnectionError();
            }
        };
    }

    function handleRealTimeData(data) {
        switch(data.type) {
            case 'NEW_ORDER':
                addActivity({
                    type: 'order',
                    title: 'Novo Pedido',
                    description: `Pedido ${data.orderId} recebido`,
                    time: new Date(),
                    icon: 'shopping-cart',
                    color: 'success'
                });
                statusData.orders.total++;
                statusData.orders.pending++;
                break;
                
            case 'ORDER_UPDATED':
                addActivity({
                    type: 'order',
                    title: 'Pedido Atualizado',
                    description: `Status do pedido ${data.orderId} alterado`,
                    time: new Date(),
                    icon: 'sync-alt',
                    color: 'info'
                });
                break;
                
            case 'NEW_MESSAGE':
                addNotification({
                    type: 'info',
                    title: 'Nova Mensagem',
                    message: data.message,
                    time: new Date(),
                    read: false,
                    icon: 'envelope'
                });
                statusData.messages.unread++;
                break;
                
            case 'CONTRACT_SIGNED':
                addActivity({
                    type: 'contract',
                    title: 'Contrato Assinado',
                    description: `Contrato ${data.contractId} foi assinado`,
                    time: new Date(),
                    icon: 'file-signature',
                    color: 'success'
                });
                statusData.contracts.pendingSignature--;
                statusData.contracts.signed++;
                break;
        }
        
        updateUI();
    }

    function receiveRealTimeUpdate() {
        const updateTypes = ['NEW_ORDER', 'ORDER_UPDATED', 'NEW_MESSAGE', 'CONTRACT_SIGNED'];
        const randomType = updateTypes[Math.floor(Math.random() * updateTypes.length)];
        
        const mockUpdate = {
            type: randomType,
            orderId: `ORD-00${Math.floor(100 + Math.random() * 900)}`,
            contractId: `CT-00${Math.floor(100 + Math.random() * 900)}`,
            message: 'Nova mensagem importante recebida'
        };
        
        handleRealTimeData(mockUpdate);
        showToast('Nova atualização em tempo real!', 'info');
    }

    function handleConnectionClose() {
        isConnected = false;
        updateConnectionStatus('disconnected');
        
        if (reconnectAttempts < maxReconnectAttempts) {
            reconnectAttempts++;
            setTimeout(connectWebSocket, 3000 * reconnectAttempts);
        }
    }

    function handleConnectionError() {
        console.error('Erro na conexão WebSocket');
        updateConnectionStatus('disconnected');
    }

    function updateConnectionStatus(status) {
        const icon = connectionStatus.querySelector('i');
        const text = connectionStatus.querySelector('span');
        
        connectionStatus.className = `connection-status ${status}`;
        
        switch(status) {
            case 'connected':
                icon.className = 'fas fa-wifi';
                text.textContent = 'Conectado ao sistema em tempo real';
                break;
            case 'disconnected':
                icon.className = 'fas fa-wifi-slash';
                text.textContent = 'Conexão perdida - Tentando reconectar...';
                break;
            case 'connecting':
                icon.className = 'fas fa-sync-alt fa-spin';
                text.textContent = 'Conectando ao sistema...';
                break;
        }
    }

    // ======================
    // ATUALIZAÇÃO DA UI
    // ======================

    function updateStatusData(data) {
        statusData = { ...statusData, ...data };
        statusData.lastUpdate = new Date();
        updateUI();
    }

    function updateUI() {
        updateOrdersCard();
        updateContractsCard();
        updateMessagesCard();
        updateUsersCard();
        updateActivityTimeline();
        updateOrdersDistribution();
        updateNotificationsList();
    }

    function updateOrdersCard() {
        ordersCount.textContent = statusData.orders.total;
        pendingOrders.textContent = statusData.orders.pending;
        processingOrders.textContent = statusData.orders.processing;
        completedOrders.textContent = statusData.orders.completed;
        
        updateTrendElement(ordersTrend, statusData.orders.trend);
    }

    function updateContractsCard() {
        contractsCount.textContent = statusData.contracts.total;
        draftContracts.textContent = statusData.contracts.draft;
        pendingSignature.textContent = statusData.contracts.pendingSignature;
        signedContracts.textContent = statusData.contracts.signed;
        
        updateTrendElement(contractsTrend, statusData.contracts.trend);
    }

    function updateMessagesCard() {
        messagesCount.textContent = statusData.messages.total;
        unreadMessages.textContent = statusData.messages.unread;
        sentMessages.textContent = statusData.messages.sent;
        receivedMessages.textContent = statusData.messages.received;
        
        updateTrendElement(messagesTrend, statusData.messages.trend);
    }

    function updateUsersCard() {
        usersCount.textContent = statusData.users.total;
        activeUsers.textContent = statusData.users.active;
        suppliersCount.textContent = statusData.users.suppliers;
        buyersCount.textContent = statusData.users.buyers;
        
        updateTrendElement(usersTrend, statusData.users.trend);
    }

    function updateTrendElement(element, value) {
        const trendValue = element.querySelector('span');
        const trendIcon = element.querySelector('i');
        
        trendValue.textContent = `${Math.abs(value)}%`;
        
        if (value > 0) {
            element.className = 'trend positive';
            trendIcon.className = 'fas fa-arrow-up';
        } else if (value < 0) {
            element.className = 'trend negative';
            trendIcon.className = 'fas fa-arrow-down';
        } else {
            element.className = 'trend neutral';
            trendIcon.className = 'fas fa-minus';
        }
    }

    function updateActivityTimeline() {
        if (statusData.activities.length === 0) {
            activityTimeline.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-chart-line"></i>
                    <h3>Nenhuma atividade recente</h3>
                    <p>As atividades aparecerão aqui em tempo real</p>
                </div>
            `;
            return;
        }

        activityTimeline.innerHTML = statusData.activities.map(activity => `
            <div class="activity-item" data-activity-id="${activity.id}">
                <div class="activity-icon" style="background-color: ${getColorValue(activity.color)}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-description">${activity.description}</div>
                    <div class="activity-time">${formatTimeAgo(activity.time)}</div>
                </div>
            </div>
        `).join('');
    }

    function updateOrdersDistribution() {
        const distributionData = [
            { label: 'Pendentes', value: statusData.orders.pending, status: 'pending' },
            { label: 'Processando', value: statusData.orders.processing, status: 'processing' },
            { label: 'Concluídos', value: statusData.orders.completed, status: 'completed' },
            { label: 'Cancelados', value: Math.max(0, statusData.orders.total - statusData.orders.pending - statusData.orders.processing - statusData.orders.completed), status: 'cancelled' }
        ];

        ordersDistribution.innerHTML = distributionData.map(item => `
            <div class="distribution-item ${item.status}">
                <span class="distribution-label">${item.label}</span>
                <span class="distribution-value">${item.value}</span>
            </div>
        `).join('');
    }

    function updateNotificationsList() {
        if (statusData.notifications.length === 0) {
            notificationsList.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-bell-slash"></i>
                    <h3>Nenhuma notificação</h3>
                    <p>As notificações aparecerão aqui automaticamente</p>
                </div>
            `;
            return;
        }

        notificationsList.innerHTML = statusData.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" data-notification-id="${notification.id}">
                <div class="notification-icon" style="background-color: ${getColorValue(notification.type)}">
                    <i class="fas fa-${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notification.title}</div>
                    <div class="notification-message">${notification.message}</div>
                    <div class="notification-time">${formatTimeAgo(notification.time)}</div>
                </div>
                <div class="notification-actions">
                    ${!notification.read ? `
                        <button class="btn-icon mark-read" title="Marcar como lida">
                            <i class="fas fa-check"></i>
                        </button>
                    ` : ''}
                    <button class="btn-icon delete-notification" title="Excluir">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners
        notificationsList.querySelectorAll('.mark-read').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationId = this.closest('.notification-item').getAttribute('data-notification-id');
                markAsRead(notificationId);
            });
        });

        notificationsList.querySelectorAll('.delete-notification').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const notificationId = this.closest('.notification-item').getAttribute('data-notification-id');
                deleteNotification(notificationId);
            });
        });

        notificationsList.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', function() {
                const notificationId = this.getAttribute('data-notification-id');
                showNotificationDetails(notificationId);
            });
        });
    }

    // ======================
    // FUNÇÕES AUXILIARES
    // ======================

    function addActivity(activity) {
        activity.id = Date.now();
        activity.time = new Date();
        statusData.activities.unshift(activity);
        
        // Manter apenas as 10 atividades mais recentes
        if (statusData.activities.length > 10) {
            statusData.activities = statusData.activities.slice(0, 10);
        }
        
        updateActivityTimeline();
    }

    function addNotification(notification) {
        notification.id = Date.now();
        notification.time = new Date();
        statusData.notifications.unshift(notification);
        updateNotificationsList();
        
        // Mostrar toast para novas notificações não lidas
        if (!notification.read) {
            showToast(`Nova notificação: ${notification.title}`, 'info');
        }
    }

    function markAsRead(notificationId) {
        const notification = statusData.notifications.find(n => n.id == notificationId);
        if (notification) {
            notification.read = true;
            statusData.messages.unread = Math.max(0, statusData.messages.unread - 1);
            updateNotificationsList();
            updateMessagesCard();
            showToast('Notificação marcada como lida');
        }
    }

    function markAllAsRead() {
        statusData.notifications.forEach(notification => {
            notification.read = true;
        });
        statusData.messages.unread = 0;
        updateNotificationsList();
        updateMessagesCard();
        showToast('Todas as notificações marcadas como lidas');
    }

    function deleteNotification(notificationId) {
        statusData.notifications = statusData.notifications.filter(n => n.id != notificationId);
        updateNotificationsList();
        showToast('Notificação excluída');
    }

    function clearNotifications() {
        if (statusData.notifications.length === 0) {
            showToast('Não há notificações para limpar', 'warning');
            return;
        }

        if (confirm('Tem certeza que deseja limpar todas as notificações?')) {
            statusData.notifications = [];
            updateNotificationsList();
            showToast('Todas as notificações foram limpas');
        }
    }

    function testNotifications() {
        const testNotification = {
            type: 'info',
            title: 'Teste de Notificação',
            message: 'Esta é uma notificação de teste do sistema',
            time: new Date(),
            read: false,
            icon: 'bell'
        };
        
        addNotification(testNotification);
        showToast('Notificação de teste enviada!');
    }

    function showNotificationDetails(notificationId) {
        const notification = statusData.notifications.find(n => n.id == notificationId);
        if (!notification) return;

        document.getElementById('modal-title').textContent = notification.title;
        document.getElementById('modal-content').innerHTML = `
            <div class="notification-details">
                <p><strong>Mensagem:</strong> ${notification.message}</p>
                <p><strong>Data:</strong> ${formatDateTime(notification.time)}</p>
                <p><strong>Tipo:</strong> <span class="notification-type ${notification.type}">${getNotificationTypeText(notification.type)}</span></p>
                <p><strong>Status:</strong> ${notification.read ? 'Lida' : 'Não lida'}</p>
            </div>
        `;

        detailsModal.style.display = 'flex';
        
        // Marcar como lida ao abrir os detalhes
        if (!notification.read) {
            markAsRead(notificationId);
        }
    }

    function applyFilters() {
        const period = periodFilter.value;
        const type = typeFilter.value;
        const role = roleFilter.value;
        
        // TODO: Aplicar filtros na busca de dados
        console.log('Aplicando filtros:', { period, type, role });
        
        showToast('Filtros aplicados com sucesso!');
        
        // Em uma implementação real, isso recarregaria os dados com os filtros
        // refreshAllData();
    }

    function exportActivityData() {
        // TODO: Implementar exportação real
        const data = {
            activities: statusData.activities,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `atividades-${formatDateForExport()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Dados de atividade exportados com sucesso!');
    }

    function exportOrdersData() {
        // TODO: Implementar exportação real
        const data = {
            orders: statusData.orders,
            distribution: [
                { status: 'Pendentes', count: statusData.orders.pending },
                { status: 'Processando', count: statusData.orders.processing },
                { status: 'Concluídos', count: statusData.orders.completed }
            ],
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pedidos-${formatDateForExport()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showToast('Dados de pedidos exportados com sucesso!');
    }

    function startAutoRefresh() {
        // Atualizar a cada 2 minutos
        setInterval(() => {
            if (isConnected && document.visibilityState === 'visible') {
                refreshAllData();
            }
        }, 120000);
    }

    function resetInactivityTimer() {
        // Reset do timer de inatividade
        // Em uma implementação real, isso manteria a conexão ativa
    }

    function closeModal() {
        detailsModal.style.display = 'none';
    }

    // ======================
    // UTILITÁRIOS
    // ======================

    function getColorValue(type) {
        const colors = {
            success: '#2ecc71',
            warning: '#f39c12',
            danger: '#e74c3c',
            info: '#3498db',
            primary: '#172B4B'
        };
        return colors[type] || colors.primary;
    }

    function getNotificationTypeText(type) {
        const types = {
            success: 'Sucesso',
            warning: 'Aviso',
            danger: 'Erro',
            info: 'Informação'
        };
        return types[type] || 'Informação';
    }

    function formatTimeAgo(date) {
        const now = new Date();
        const diffMs = now - new Date(date);
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours} h atrás`;
        if (diffDays === 1) return 'Ontem';
        return `${diffDays} dias atrás`;
    }

    function formatDateTime(date) {
        return new Date(date).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatDateForExport() {
        return new Date().toISOString().slice(0, 10).replace(/-/g, '');
    }

    function showToast(message, type = 'success') {
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
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
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
// pedidos.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const ordersBody = document.getElementById('orders-body');
    const addTestOrderBtn = document.getElementById('add-test-order');
    const testOrderModal = document.getElementById('test-order-modal');
    const orderDetailModal = document.getElementById('order-detail-modal');
    const closeModalButtons = document.querySelectorAll('.close, .close-modal');
    const testOrderForm = document.getElementById('test-order-form');
    
    // Dados temporários (serão substituídos por chamadas ao backend)
    let orders = [];
    
    // Carrega pedidos do localStorage ou inicializa dados de exemplo
    function loadOrders() {
        const savedOrders = localStorage.getItem('tradeLinkOrders');
        if (savedOrders) {
            orders = JSON.parse(savedOrders);
        } else {
            // Dados de exemplo
            orders = [
                {
                    id: 'TL-1001',
                    date: '2023-06-15',
                    partner: 'Fornecedor ABC',
                    value: 1250.50,
                    status: 'processing',
                    type: 'purchase',
                    details: 'Materiais de construção para obra X'
                },
                {
                    id: 'TL-1002',
                    date: '2023-06-10',
                    partner: 'Empresa Y',
                    value: 890.75,
                    status: 'delivered',
                    type: 'sale',
                    details: 'Peças automotivas modelo Z'
                },
                {
                    id: 'TL-1003',
                    date: '2023-06-05',
                    partner: 'Fornecedor XYZ',
                    value: 3420.00,
                    status: 'shipped',
                    type: 'purchase',
                    details: 'Equipamentos eletrônicos'
                }
            ];
            saveOrders();
        }
        
        renderOrders();
    }
    
    // Salva pedidos no localStorage
    function saveOrders() {
        localStorage.setItem('tradeLinkOrders', JSON.stringify(orders));
    }
    
    // Renderiza a lista de pedidos
    function renderOrders(filteredOrders = null) {
        const ordersToRender = filteredOrders || orders;
        ordersBody.innerHTML = '';
        
        if (ordersToRender.length === 0) {
            ordersBody.innerHTML = '<tr><td colspan="6" class="no-orders">Nenhum pedido encontrado</td></tr>';
            return;
        }
        
        ordersToRender.forEach(order => {
            const row = document.createElement('tr');
            row.dataset.id = order.id;
            
            // Formata a data
            const dateObj = new Date(order.date);
            const formattedDate = dateObj.toLocaleDateString('pt-BR');
            
            // Determina o texto do status
            const statusText = {
                'pending': 'Pendente',
                'processing': 'Em processamento',
                'shipped': 'Enviado',
                'delivered': 'Entregue',
                'cancelled': 'Cancelado'
            }[order.status];
            
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${formattedDate}</td>
                <td>${order.partner}</td>
                <td>R$ ${order.value.toFixed(2).replace('.', ',')}</td>
                <td><span class="status-badge status-${order.status}">${statusText}</span></td>
                <td>
                    <button class="btn-view" data-id="${order.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            
            ordersBody.appendChild(row);
        });
        
        // Adiciona eventos aos botões de visualização
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.dataset.id;
                showOrderDetails(orderId);
            });
        });
    }
    
    // Mostra os detalhes de um pedido
    function showOrderDetails(orderId) {
        const order = orders.find(o => o.id === orderId);
        if (!order) return;
        
        // Formata a data
        const dateObj = new Date(order.date);
        const formattedDate = dateObj.toLocaleDateString('pt-BR');
        
        // Determina o texto do status
        const statusText = {
            'pending': 'Pendente',
            'processing': 'Em processamento',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        }[order.status];
        
        // Preenche os detalhes no modal
        document.getElementById('order-id').textContent = order.id;
        document.getElementById('order-date').textContent = formattedDate;
        document.getElementById('order-partner').textContent = order.partner;
        document.getElementById('order-status').textContent = statusText;
        document.getElementById('order-value').textContent = 
            `R$ ${order.value.toFixed(2).replace('.', ',')}`;
        
        // Preenche os itens do pedido (simplificado para o exemplo)
        const productsBody = document.getElementById('order-products-body');
        productsBody.innerHTML = `
            <tr>
                <td>${order.details}</td>
                <td>1</td>
                <td>R$ ${order.value.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${order.value.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
        
        // Mostra o modal
        orderDetailModal.style.display = 'flex';
    }
    
    // Filtra os pedidos
    function filterOrders() {
        const statusFilter = document.getElementById('status-filter').value;
        const dateFilter = document.getElementById('date-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        
        let filtered = orders;
        
        // Filtro por status
        if (statusFilter !== 'all') {
            filtered = filtered.filter(order => order.status === statusFilter);
        }
        
        // Filtro por data (simplificado)
        if (dateFilter !== 'all') {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            filtered = filtered.filter(order => {
                const orderDate = new Date(order.date);
                
                if (dateFilter === 'today') {
                    return orderDate.toDateString() === today.toDateString();
                } else if (dateFilter === 'week') {
                    const weekAgo = new Date(today);
                    weekAgo.setDate(weekAgo.getDate() - 7);
                    return orderDate >= weekAgo;
                } else if (dateFilter === 'month') {
                    const monthAgo = new Date(today);
                    monthAgo.setMonth(monthAgo.getMonth() - 1);
                    return orderDate >= monthAgo;
                }
                return true;
            });
        }
        
        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(order => 
                order.id.toLowerCase().includes(searchTerm) || 
                order.partner.toLowerCase().includes(searchTerm) ||
                order.details.toLowerCase().includes(searchTerm)
            );
        }
        
        renderOrders(filtered);
    }
    
    // Event Listeners
    addTestOrderBtn.addEventListener('click', function() {
        testOrderModal.style.display = 'flex';
    });
    
    closeModalButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            testOrderModal.style.display = 'none';
            orderDetailModal.style.display = 'none';
        });
    });
    
    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener('click', function(event) {
        if (event.target === testOrderModal) {
            testOrderModal.style.display = 'none';
        }
        if (event.target === orderDetailModal) {
            orderDetailModal.style.display = 'none';
        }
    });
    
    // Adiciona um novo pedido de teste
    testOrderForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const type = document.getElementById('test-order-type').value;
        const partner = document.getElementById('test-order-partner').value;
        const value = parseFloat(document.getElementById('test-order-value').value);
        const status = document.getElementById('test-order-status').value;
        const details = document.getElementById('test-order-details').value || 'Sem detalhes adicionais';
        
        // Gera um ID fictício
        const newId = 'TL-' + (1000 + orders.length + 1);
        
        // Data atual
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0];
        
        // Cria o novo pedido
        const newOrder = {
            id: newId,
            date: formattedDate,
            partner: partner,
            value: value,
            status: status,
            type: type,
            details: details
        };
        
        // Adiciona ao array e salva
        orders.unshift(newOrder);
        saveOrders();
        
        // Fecha o modal e atualiza a lista
        testOrderModal.style.display = 'none';
        renderOrders();
        testOrderForm.reset();
    });
    
    // Filtros
    document.getElementById('status-filter').addEventListener('change', filterOrders);
    document.getElementById('date-filter').addEventListener('change', filterOrders);
    document.getElementById('search-input').addEventListener('input', filterOrders);
    
    // Botões de ação no modal de detalhes
    document.getElementById('print-order').addEventListener('click', function() {
        alert('Funcionalidade de impressão será implementada aqui');
    });
    
    document.getElementById('change-status').addEventListener('click', function() {
        alert('Funcionalidade de alterar status será implementada aqui');
    });
    
    document.getElementById('cancel-order').addEventListener('click', function() {
        const orderId = document.getElementById('order-id').textContent;
        if (confirm(`Tem certeza que deseja cancelar o pedido ${orderId}?`)) {
            const orderIndex = orders.findIndex(o => o.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'cancelled';
                saveOrders();
                renderOrders();
                orderDetailModal.style.display = 'none';
                alert('Pedido cancelado com sucesso');
            }
        }
    });
    
    // Inicialização
    loadOrders();
});
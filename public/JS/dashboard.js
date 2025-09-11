// dashboard.js - Dashboard para TradeLink (Versão Melhorada)
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const periodFilter = document.getElementById('dashboard-period');
    const customDateContainer = document.getElementById('dashboard-custom-date');
    const refreshButton = document.getElementById('refresh-data');
    const toggleTestButton = document.getElementById('toggle-test-data');
    const testDataForm = document.getElementById('test-data-form');
    const closeTestForm = document.getElementById('close-test-form');
    const testDataConfig = document.getElementById('test-data-config');
    const resetTestData = document.getElementById('reset-test-data');
    const viewAllOrdersBtn = document.getElementById('view-all-orders');
    const ordersModal = document.getElementById('orders-modal');
    const exportButtons = document.querySelectorAll('.export-btn');
    const recentOrdersCount = document.getElementById('recent-orders-count');
    
    // Elementos de dados
    const totalRevenue = document.getElementById('total-revenue');
    const totalOrders = document.getElementById('total-orders');
    const pendingOrders = document.getElementById('pending-orders');
    const newCustomers = document.getElementById('new-customers');
    const revenueTrend = document.getElementById('revenue-trend');
    const ordersTrend = document.getElementById('orders-trend');
    const pendingTrend = document.getElementById('pending-trend');
    const customersTrend = document.getElementById('customers-trend');
    
    // Elementos do modal
    const modalStatusFilter = document.getElementById('modal-status-filter');
    const modalTypeFilter = document.getElementById('modal-type-filter');
    const modalSearchOrders = document.getElementById('modal-search-orders');
    const modalOrdersBody = document.getElementById('modal-orders-body');
    const modalPrevPage = document.getElementById('modal-prev-page');
    const modalNextPage = document.getElementById('modal-next-page');
    const modalPageInfo = document.getElementById('modal-page-info');
    const modalPageSize = document.getElementById('modal-page-size');
    
    // Dados iniciais
    let dashboardData = {
        revenue: 48560,
        orders: 124,
        pending: 18,
        customers: 24,
        revenueTrend: 12.5,
        ordersTrend: 8.3,
        pendingTrend: -5.2,
        customersTrend: 15.8
    };
    
    // Dados de exemplo para pedidos
    let ordersData = [
        { id: 'ORD-001', customer: 'Construtora ABC Ltda', date: '15/03/2023', value: 2450.00, status: 'pending', type: 'sale' },
        { id: 'ORD-002', customer: 'Materiais de Construção São José', date: '14/03/2023', value: 1875.50, status: 'processing', type: 'purchase' },
        { id: 'ORD-003', customer: 'João Silva - ME', date: '14/03/2023', value: 3200.00, status: 'shipped', type: 'sale' },
        { id: 'ORD-004', customer: 'Cimento Nacional S.A.', date: '13/03/2023', value: 5420.75, status: 'delivered', type: 'purchase' },
        { id: 'ORD-005', customer: 'Pedreiro & Cia Ltda', date: '12/03/2023', value: 1250.00, status: 'delivered', type: 'sale' },
        { id: 'ORD-006', customer: 'Distribuidora de Materiais Rápidos', date: '11/03/2023', value: 3650.25, status: 'processing', type: 'purchase' },
        { id: 'ORD-007', customer: 'ConstrutoPlus Empreendimentos', date: '10/03/2023', value: 8900.00, status: 'pending', type: 'sale' },
        { id: 'ORD-008', customer: 'Tijolos Fortes Indústria', date: '09/03/2023', value: 2100.50, status: 'shipped', type: 'purchase' },
        { id: 'ORD-009', customer: 'Mario Construtor', date: '08/03/2023', value: 1550.00, status: 'delivered', type: 'sale' },
        { id: 'ORD-010', customer: 'Cimento Premium Ltda', date: '07/03/2023', value: 4750.00, status: 'processing', type: 'purchase' },
        { id: 'ORD-011', customer: 'ConstruMais Empreiteira', date: '06/03/2023', value: 6800.00, status: 'shipped', type: 'sale' },
        { id: 'ORD-012', customer: 'Ferro e Aço Nacional', date: '05/03/2023', value: 3250.75, status: 'delivered', type: 'purchase' },
        { id: 'ORD-013', customer: 'Pedreira Santo Antônio', date: '04/03/2023', value: 2100.00, status: 'pending', type: 'sale' },
        { id: 'ORD-014', customer: 'Tubos e Conexões Plásticas', date: '03/03/2023', value: 1850.50, status: 'processing', type: 'purchase' },
        { id: 'ORD-015', customer: 'Construtora Modelo', date: '02/03/2023', value: 9450.00, status: 'shipped', type: 'sale' }
    ];
    
    // Configuração de paginação para o modal
    let modalPagination = {
        currentPage: 1,
        pageSize: 10,
        totalPages: Math.ceil(ordersData.length / 10),
        filteredOrders: [...ordersData]
    };
    
    // Inicialização
    initDashboard();
    
    // Função de inicialização
    function initDashboard() {
        // Inicializar gráficos
        initCharts();
        
        // Carregar dados iniciais
        updateDashboardData();
        
        // Carregar pedidos recentes na tabela principal
        loadRecentOrders();
        
        // Configurar event listeners
        setupEventListeners();
    }
    
    // Configurar event listeners
    function setupEventListeners() {
        // Filtro de período
        periodFilter.addEventListener('change', function() {
            if (this.value === 'custom') {
                customDateContainer.style.display = 'grid';
                customDateContainer.classList.add('visible');
            } else {
                customDateContainer.style.display = 'none';
                customDateContainer.classList.remove('visible');
                updateDashboardData();
            }
        });
        
        // Botão de atualizar dados
        refreshButton.addEventListener('click', function() {
            updateDashboardData();
            showToast('Dados atualizados com sucesso!');
        });
        
        // Botão para mostrar/ocultar formulário de dados de teste
        toggleTestButton.addEventListener('click', function() {
            if (testDataForm.style.display === 'none') {
                testDataForm.style.display = 'block';
                this.innerHTML = '<i class="fas fa-eye-slash"></i> Ocultar Dados de Teste';
            } else {
                testDataForm.style.display = 'none';
                this.innerHTML = '<i class="fas fa-sliders-h"></i> Dados de Teste';
            }
        });
        
        // Fechar formulário de dados de teste
        closeTestForm.addEventListener('click', function() {
            testDataForm.style.display = 'none';
            toggleTestButton.innerHTML = '<i class="fas fa-sliders-h"></i> Dados de Teste';
        });
        
        // Enviar formulário de dados de teste
        testDataConfig.addEventListener('submit', function(e) {
            e.preventDefault();
            updateTestData();
            testDataForm.style.display = 'none';
            toggleTestButton.innerHTML = '<i class="fas fa-sliders-h"></i> Dados de Teste';
            showToast('Dados de teste aplicados com sucesso!');
        });
        
        // Redefinir dados de teste
        resetTestData.addEventListener('click', function() {
            resetTestDataForm();
            updateTestData();
            showToast('Dados de teste redefinidos com sucesso!');
        });
        
        // Botão para ver todos os pedidos (abrir modal)
        viewAllOrdersBtn.addEventListener('click', function() {
            openOrdersModal();
        });
        
        // Fechar modal
        document.querySelector('.close').addEventListener('click', function() {
            closeOrdersModal();
        });
        
        // Fechar modal clicando fora dele
        window.addEventListener('click', function(e) {
            if (e.target === ordersModal) {
                closeOrdersModal();
            }
        });
        
        // Filtros do modal
        modalStatusFilter.addEventListener('change', filterModalOrders);
        modalTypeFilter.addEventListener('change', filterModalOrders);
        modalSearchOrders.addEventListener('input', filterModalOrders);
        
        // Paginação do modal
        modalPrevPage.addEventListener('click', function() {
            if (modalPagination.currentPage > 1) {
                modalPagination.currentPage--;
                renderModalOrders();
            }
        });
        
        modalNextPage.addEventListener('click', function() {
            if (modalPagination.currentPage < modalPagination.totalPages) {
                modalPagination.currentPage++;
                renderModalOrders();
            }
        });
        
        modalPageSize.addEventListener('change', function() {
            modalPagination.pageSize = parseInt(this.value);
            modalPagination.currentPage = 1;
            modalPagination.totalPages = Math.ceil(modalPagination.filteredOrders.length / modalPagination.pageSize);
            renderModalOrders();
        });
        
        // Botões de exportação
        exportButtons.forEach(btn => {
            btn.addEventListener('click', function() {
                const chartType = this.getAttribute('data-chart');
                exportChartData(chartType);
            });
        });
        
        // Filtro de quantidade de pedidos recentes
        recentOrdersCount.addEventListener('change', loadRecentOrders);
    }
    
    // Atualizar dados do dashboard
    function updateDashboardData() {
        totalRevenue.textContent = formatCurrency(dashboardData.revenue);
        totalOrders.textContent = dashboardData.orders;
        pendingOrders.textContent = dashboardData.pending;
        newCustomers.textContent = dashboardData.customers;
        
        revenueTrend.textContent = `${dashboardData.revenueTrend > 0 ? '+' : ''}${dashboardData.revenueTrend}%`;
        ordersTrend.textContent = `${dashboardData.ordersTrend > 0 ? '+' : ''}${dashboardData.ordersTrend}%`;
        pendingTrend.textContent = `${dashboardData.pendingTrend > 0 ? '+' : ''}${dashboardData.pendingTrend}%`;
        customersTrend.textContent = `${dashboardData.customersTrend > 0 ? '+' : ''}${dashboardData.customersTrend}%`;
        
        // Atualizar classes de tendência
        updateTrendClass(revenueTrend, dashboardData.revenueTrend);
        updateTrendClass(ordersTrend, dashboardData.ordersTrend);
        updateTrendClass(pendingTrend, dashboardData.pendingTrend);
        updateTrendClass(customersTrend, dashboardData.customersTrend);
    }
    
    // Atualizar classe de tendência (positiva/negativa)
    function updateTrendClass(element, value) {
        if (value > 0) {
            element.parentElement.className = 'summary-trend positive';
        } else if (value < 0) {
            element.parentElement.className = 'summary-trend negative';
        } else {
            element.parentElement.className = 'summary-trend';
        }
    }
    
    // Carregar pedidos recentes na tabela principal
    function loadRecentOrders() {
        const count = recentOrdersCount.value === 'all' ? ordersData.length : parseInt(recentOrdersCount.value);
        const recentOrders = ordersData.slice(0, count);
        
        const ordersBody = document.getElementById('recent-orders-body');
        ordersBody.innerHTML = '';
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatCurrency(order.value)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>
                    <button class="btn-view" data-id="${order.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            ordersBody.appendChild(row);
        });
        
        // Adicionar event listeners aos botões de visualização
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrderDetails(orderId);
            });
        });
    }
    
    // Abrir modal de pedidos
    function openOrdersModal() {
        // Resetar filtros e paginação
        modalStatusFilter.value = 'all';
        modalTypeFilter.value = 'all';
        modalSearchOrders.value = '';
        modalPagination.currentPage = 1;
        modalPagination.filteredOrders = [...ordersData];
        modalPagination.totalPages = Math.ceil(ordersData.length / modalPagination.pageSize);
        
        // Renderizar pedidos no modal
        renderModalOrders();
        
        // Exibir modal
        ordersModal.style.display = 'flex';
    }
    
    // Fechar modal de pedidos
    function closeOrdersModal() {
        ordersModal.style.display = 'none';
    }
    
    // Filtrar pedidos no modal
    function filterModalOrders() {
        const statusFilter = modalStatusFilter.value;
        const typeFilter = modalTypeFilter.value;
        const searchTerm = modalSearchOrders.value.toLowerCase();
        
        modalPagination.filteredOrders = ordersData.filter(order => {
            // Filtrar por status
            if (statusFilter !== 'all' && order.status !== statusFilter) {
                return false;
            }
            
            // Filtrar por tipo
            if (typeFilter !== 'all' && order.type !== typeFilter) {
                return false;
            }
            
            // Filtrar por termo de busca
            if (searchTerm && !(
                order.id.toLowerCase().includes(searchTerm) ||
                order.customer.toLowerCase().includes(searchTerm) ||
                order.date.includes(searchTerm) ||
                order.value.toString().includes(searchTerm)
            )) {
                return false;
            }
            
            return true;
        });
        
        // Atualizar paginação
        modalPagination.currentPage = 1;
        modalPagination.totalPages = Math.ceil(modalPagination.filteredOrders.length / modalPagination.pageSize);
        
        // Renderizar pedidos
        renderModalOrders();
    }
    
    // Renderizar pedidos no modal
    function renderModalOrders() {
        const startIndex = (modalPagination.currentPage - 1) * modalPagination.pageSize;
        const endIndex = startIndex + modalPagination.pageSize;
        const currentOrders = modalPagination.filteredOrders.slice(startIndex, endIndex);
        
        // Limpar tabela
        modalOrdersBody.innerHTML = '';
        
        // Adicionar pedidos
        currentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatCurrency(order.value)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td>
                    <button class="btn-view" data-id="${order.id}">
                        <i class="fas fa-eye"></i> Ver
                    </button>
                </td>
            `;
            modalOrdersBody.appendChild(row);
        });
        
        // Atualizar controles de paginação
        updatePaginationControls();
        
        // Adicionar event listeners aos botões de visualização
        document.querySelectorAll('#modal-orders-body .btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                viewOrderDetails(orderId);
                closeOrdersModal();
            });
        });
    }
    
    // Atualizar controles de paginação
    function updatePaginationControls() {
        // Atualizar informações da página
        modalPageInfo.textContent = `Página ${modalPagination.currentPage} de ${modalPagination.totalPages || 1}`;
        
        // Habilitar/desabilitar botões de navegação
        modalPrevPage.disabled = modalPagination.currentPage === 1;
        modalNextPage.disabled = modalPagination.currentPage === modalPagination.totalPages || modalPagination.totalPages === 0;
    }
    
    // Visualizar detalhes do pedido
    function viewOrderDetails(orderId) {
        // Em uma implementação real, isso redirecionaria para a página de detalhes do pedido
        showToast(`Visualizando detalhes do pedido: ${orderId}`);
        console.log(`Visualizando pedido: ${orderId}`);
    }
    
    // Atualizar dados de teste
    function updateTestData() {
        dashboardData.revenue = parseFloat(document.getElementById('test-revenue').value);
        dashboardData.orders = parseInt(document.getElementById('test-orders').value);
        dashboardData.pending = parseInt(document.getElementById('test-pending').value);
        dashboardData.customers = parseInt(document.getElementById('test-customers').value);
        dashboardData.revenueTrend = parseFloat(document.getElementById('test-revenue-trend').value);
        dashboardData.ordersTrend = parseFloat(document.getElementById('test-orders-trend').value);
        dashboardData.pendingTrend = parseFloat(document.getElementById('test-pending-trend').value);
        dashboardData.customersTrend = parseFloat(document.getElementById('test-customers-trend').value);
        
        updateDashboardData();
    }
    
    // Redefinir formulário de dados de teste
    function resetTestDataForm() {
        document.getElementById('test-revenue').value = 48560;
        document.getElementById('test-orders').value = 124;
        document.getElementById('test-pending').value = 18;
        document.getElementById('test-customers').value = 24;
        document.getElementById('test-revenue-trend').value = 12.5;
        document.getElementById('test-orders-trend').value = 8.3;
        document.getElementById('test-pending-trend').value = -5.2;
        document.getElementById('test-customers-trend').value = 15.8;
    }
    
    // Exportar dados do gráfico
    function exportChartData(chartType) {
        // Em uma implementação real, isso geraria um arquivo para download
        showToast(`Exportando dados de ${chartType === 'revenue' ? 'faturamento' : chartType === 'orders' ? 'pedidos' : 'produtos'}`);
        console.log(`Exportando dados do gráfico: ${chartType}`);
    }
    
    // Mostrar notificação toast
    function showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toast-message');
        
        toastMessage.textContent = message;
        toast.className = 'toast ' + type;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    // Inicializar gráficos
    function initCharts() {
        // Gráfico de faturamento mensal
        const revenueCtx = document.getElementById('revenue-chart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 40000, 38000, 42000, 48560],
                    borderColor: '#38528D',
                    backgroundColor: 'rgba(56, 82, 141, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
        
        // Gráfico de distribuição de pedidos
        const ordersCtx = document.getElementById('orders-chart').getContext('2d');
        new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels: ['Pendentes', 'Processando', 'Enviados', 'Entregues'],
                datasets: [{
                    data: [18, 42, 24, 40],
                    backgroundColor: [
                        '#fff3cd',
                        '#cce5ff',
                        '#d4edda',
                        '#d1ecf1'
                    ],
                    borderColor: [
                        '#856404',
                        '#004085',
                        '#155724',
                        '#0c5460'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
    
    // Funções utilitárias
    function formatCurrency(value) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    }
    
    function getStatusText(status) {
        const statusMap = {
            'pending': 'Pendente',
            'processing': 'Processando',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        };
        
        return statusMap[status] || status;
    }
});
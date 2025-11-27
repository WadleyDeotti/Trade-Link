// dashboard.js - TradeLink Dashboard Refatorado
document.addEventListener('DOMContentLoaded', function () {

async function fetchDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Erro ao buscar dashboard');

        const data = await response.json();

        // Atualiza os valores no objeto existente
        dashboardData = {
            revenue: data.totalFaturamento,
            orders: data.totalPedidos,
            pending: data.totalPendentes,
            customers: data.totalClientes,
            revenueTrend: data.trendFaturamento || 0,
            ordersTrend: data.trendPedidos || 0,
            pendingTrend: data.trendPendentes || 0,
            customersTrend: data.trendClientes || 0
        };

        ordersData = data.pedidosRecentes;

        updateDashboardData();
        loadRecentOrders();
        console.log("Dashboard atualizado com dados reais.");
    } catch (err) {
        console.error("Erro no dashboard:", err);
        showToast("Erro ao carregar dados do dashboard", "error");
    }
}


    // -----------------------------
    // Elementos do DOM
    // -----------------------------
    const getEl = id => document.getElementById(id);

    const periodFilter = getEl('dashboard-period');
    const customDateContainer = getEl('dashboard-custom-date');
    const refreshButton = getEl('refresh-data');
    const toggleTestButton = getEl('toggle-test-data');
    const testDataForm = getEl('test-data-form');
    const closeTestForm = getEl('close-test-form');
    const testDataConfig = getEl('test-data-config');
    const resetTestDataBtn = getEl('reset-test-data');
    const viewAllOrdersBtn = getEl('view-all-orders');
    const ordersModal = getEl('orders-modal');
    const exportButtons = document.querySelectorAll('.export-btn');
    const recentOrdersCount = getEl('recent-orders-count');

    const totalRevenue = getEl('total-revenue');
    const totalOrders = getEl('total-orders');
    const pendingOrders = getEl('pending-orders');
    const newCustomers = getEl('new-customers');
    const revenueTrend = getEl('revenue-trend');
    const ordersTrend = getEl('orders-trend');
    const pendingTrend = getEl('pending-trend');
    const customersTrend = getEl('customers-trend');

    const modalStatusFilter = getEl('modal-status-filter');
    const modalTypeFilter = getEl('modal-type-filter');
    const modalSearchOrders = getEl('modal-search-orders');
    const modalOrdersBody = getEl('modal-orders-body');
    const modalPrevPage = getEl('modal-prev-page');
    const modalNextPage = getEl('modal-next-page');
    const modalPageInfo = getEl('modal-page-info');
    const modalPageSize = getEl('modal-page-size');

    // -----------------------------
    // Dados iniciais
    // -----------------------------
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

    let ordersData = [
        { id: 'ORD-001', customer: 'Construtora ABC Ltda', date: '15/03/2023', value: 2450, status: 'pending', type: 'sale' },
        { id: 'ORD-002', customer: 'Materiais de Construção São José', date: '14/03/2023', value: 1875.5, status: 'processing', type: 'purchase' },
        { id: 'ORD-003', customer: 'João Silva - ME', date: '14/03/2023', value: 3200, status: 'shipped', type: 'sale' },
        // ... restante dos pedidos
    ];

    let modalPagination = {
        currentPage: 1,
        pageSize: 10,
        totalPages: Math.ceil(ordersData.length / 10),
        filteredOrders: [...ordersData]
    };

    // -----------------------------
    // Inicialização
    // -----------------------------
    initDashboard();
    fetchDashboardData(); 

    function initDashboard() {
        initCharts();
        updateDashboardData();
        loadRecentOrders();
        setupEventListeners();
    }

    // -----------------------------
    // Event Listeners
    // -----------------------------
    function setupEventListeners() {
        periodFilter?.addEventListener('change', function () {
            if (this.value === 'custom') {
                customDateContainer.style.display = 'grid';
            } else {
                customDateContainer.style.display = 'none';
                updateDashboardData();
            }
        });

        refreshButton?.addEventListener('click', () => {
            updateDashboardData();
            showToast('Dados atualizados com sucesso!');
        });

        toggleTestButton?.addEventListener('click', () => {
            const visible = testDataForm.style.display === 'block';
            testDataForm.style.display = visible ? 'none' : 'block';
            toggleTestButton.innerHTML = visible ? '<i class="fas fa-sliders-h"></i> Dados de Teste' : '<i class="fas fa-eye-slash"></i> Ocultar Dados de Teste';
        });

        closeTestForm?.addEventListener('click', () => {
            testDataForm.style.display = 'none';
            toggleTestButton.innerHTML = '<i class="fas fa-sliders-h"></i> Dados de Teste';
        });

        testDataConfig?.addEventListener('submit', (e) => {
            e.preventDefault();
            updateTestData();
            testDataForm.style.display = 'none';
            toggleTestButton.innerHTML = '<i class="fas fa-sliders-h"></i> Dados de Teste';
            showToast('Dados de teste aplicados!');
        });

        resetTestDataBtn?.addEventListener('click', () => {
            resetTestDataForm();
            updateTestData();
            showToast('Dados de teste redefinidos!');
        });

        viewAllOrdersBtn?.addEventListener('click', openOrdersModal);

        document.querySelector('.close')?.addEventListener('click', closeOrdersModal);
        window.addEventListener('click', e => { if (e.target === ordersModal) closeOrdersModal(); });

        modalStatusFilter?.addEventListener('change', filterModalOrders);
        modalTypeFilter?.addEventListener('change', filterModalOrders);
        modalSearchOrders?.addEventListener('input', filterModalOrders);

        modalPrevPage?.addEventListener('click', () => { if (modalPagination.currentPage > 1) { modalPagination.currentPage--; renderModalOrders(); } });
        modalNextPage?.addEventListener('click', () => { if (modalPagination.currentPage < modalPagination.totalPages) { modalPagination.currentPage++; renderModalOrders(); } });

        modalPageSize?.addEventListener('change', function () {
            modalPagination.pageSize = parseInt(this.value);
            modalPagination.currentPage = 1;
            modalPagination.totalPages = Math.ceil(modalPagination.filteredOrders.length / modalPagination.pageSize);
            renderModalOrders();
        });

        exportButtons.forEach(btn => btn.addEventListener('click', () => exportChartData(btn.dataset.chart)));
        recentOrdersCount?.addEventListener('change', loadRecentOrders);
    }

    // -----------------------------
    // Dashboard Functions
    // -----------------------------
    function updateDashboardData() {
        totalRevenue.textContent = formatCurrency(dashboardData.revenue);
        totalOrders.textContent = dashboardData.orders;
        pendingOrders.textContent = dashboardData.pending;
        newCustomers.textContent = dashboardData.customers;

        revenueTrend.textContent = `${dashboardData.revenueTrend > 0 ? '+' : ''}${dashboardData.revenueTrend}%`;
        ordersTrend.textContent = `${dashboardData.ordersTrend > 0 ? '+' : ''}${dashboardData.ordersTrend}%`;
        pendingTrend.textContent = `${dashboardData.pendingTrend > 0 ? '+' : ''}${dashboardData.pendingTrend}%`;
        customersTrend.textContent = `${dashboardData.customersTrend > 0 ? '+' : ''}${dashboardData.customersTrend}%`;

        [revenueTrend, ordersTrend, pendingTrend, customersTrend].forEach((el, i) => {
            const value = [dashboardData.revenueTrend, dashboardData.ordersTrend, dashboardData.pendingTrend, dashboardData.customersTrend][i];
            updateTrendClass(el, value);
        });
    }

    function updateTrendClass(element, value) {
        element.parentElement.className = value > 0 ? 'summary-trend positive' : value < 0 ? 'summary-trend negative' : 'summary-trend';
    }

    function loadRecentOrders() {
        const count = recentOrdersCount.value === 'all' ? ordersData.length : parseInt(recentOrdersCount.value);
        const recentOrders = ordersData.slice(0, count);

        const ordersBody = getEl('recent-orders-body');
        ordersBody.innerHTML = '';

        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatCurrency(order.value)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td><button class="btn-view" data-id="${order.id}"><i class="fas fa-eye"></i> Ver</button></td>
            `;
            ordersBody.appendChild(row);
        });

        document.querySelectorAll('.btn-view').forEach(btn => btn.addEventListener('click', e => viewOrderDetails(btn.dataset.id)));
    }

    // -----------------------------
    // Modal Functions
    // -----------------------------
    function openOrdersModal() {
        modalStatusFilter.value = 'all';
        modalTypeFilter.value = 'all';
        modalSearchOrders.value = '';
        modalPagination.currentPage = 1;
        modalPagination.filteredOrders = [...ordersData];
        modalPagination.totalPages = Math.ceil(ordersData.length / modalPagination.pageSize);
        renderModalOrders();
        ordersModal.style.display = 'flex';
    }

    function closeOrdersModal() { ordersModal.style.display = 'none'; }

    function filterModalOrders() {
        const statusFilter = modalStatusFilter.value;
        const typeFilter = modalTypeFilter.value;
        const searchTerm = modalSearchOrders.value.toLowerCase();

        modalPagination.filteredOrders = ordersData.filter(order => {
            if (statusFilter !== 'all' && order.status !== statusFilter) return false;
            if (typeFilter !== 'all' && order.type !== typeFilter) return false;
            if (searchTerm && ![order.id, order.customer, order.date].some(f => f.toLowerCase().includes(searchTerm))) return false;
            return true;
        });

        modalPagination.currentPage = 1;
        modalPagination.totalPages = Math.ceil(modalPagination.filteredOrders.length / modalPagination.pageSize);
        renderModalOrders();
    }

    function renderModalOrders() {
        const start = (modalPagination.currentPage - 1) * modalPagination.pageSize;
        const end = start + modalPagination.pageSize;
        const currentOrders = modalPagination.filteredOrders.slice(start, end);

        modalOrdersBody.innerHTML = '';
        currentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.customer}</td>
                <td>${order.date}</td>
                <td>${formatCurrency(order.value)}</td>
                <td><span class="status-badge status-${order.status}">${getStatusText(order.status)}</span></td>
                <td><button class="btn-view" data-id="${order.id}"><i class="fas fa-eye"></i> Ver</button></td>
            `;
            modalOrdersBody.appendChild(row);
        });

        updatePaginationControls();
        document.querySelectorAll('#modal-orders-body .btn-view').forEach(btn => {
            btn.addEventListener('click', () => { viewOrderDetails(btn.dataset.id); closeOrdersModal(); });
        });
    }

    function updatePaginationControls() {
        modalPageInfo.textContent = `Página ${modalPagination.currentPage} de ${modalPagination.totalPages || 1}`;
        modalPrevPage.disabled = modalPagination.currentPage === 1;
        modalNextPage.disabled = modalPagination.currentPage === modalPagination.totalPages || modalPagination.totalPages === 0;
    }

    // -----------------------------
    // Test Data
    // -----------------------------
    function updateTestData() {
        ['revenue','orders','pending','customers','revenueTrend','ordersTrend','pendingTrend','customersTrend'].forEach(key => {
            const el = getEl(`test-${key}`);
            if (el) dashboardData[key] = el.type === 'number' || el.type === 'text' ? parseFloat(el.value) : el.value;
        });
        updateDashboardData();
    }

    function resetTestDataForm() {
        ['revenue','orders','pending','customers','revenueTrend','ordersTrend','pendingTrend','customersTrend'].forEach((key, i) => {
            const el = getEl(`test-${key}`);
            const defaultValues = [48560,124,18,24,12.5,8.3,-5.2,15.8];
            if (el) el.value = defaultValues[i];
        });
    }

    // -----------------------------
    // Charts
    // -----------------------------
    function initCharts() {
        const revenueCtx = getEl('revenue-chart').getContext('2d');
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'],
                datasets: [{
                    label: 'Faturamento (R$)',
                    data: [12000,19000,15000,25000,22000,30000,28000,35000,40000,38000,42000,dashboardData.revenue],
                    borderColor: '#38528D',
                    backgroundColor: 'rgba(56,82,141,0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive:true, maintainAspectRatio:false }
        });

        const ordersCtx = getEl('orders-chart').getContext('2d');
        new Chart(ordersCtx, {
            type: 'doughnut',
            data: {
                labels:['Pendentes','Processando','Enviados','Entregues'],
                datasets:[{
                    data:[dashboardData.pending,42,24,40],
                    backgroundColor:['#fff3cd','#cce5ff','#d4edda','#d1ecf1'],
                    borderColor:['#856404','#004085','#155724','#0c5460'],
                    borderWidth:1
                }]
            },
            options:{ responsive:true, maintainAspectRatio:false }
        });
    }

    // -----------------------------
    // Utils
    // -----------------------------
    function formatCurrency(value) { return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(value); }

    function getStatusText(status) {
        return {'pending':'Pendente','processing':'Processando','shipped':'Enviado','delivered':'Entregue','cancelled':'Cancelado'}[status] || status;
    }

    function viewOrderDetails(orderId) {
        showToast(`Visualizando detalhes do pedido: ${orderId}`);
        console.log(`Visualizando pedido: ${orderId}`);
    }

    function exportChartData(chartType) {
        showToast(`Exportando dados de ${chartType}`);
        console.log(`Exportando dados do gráfico: ${chartType}`);
    }

    function showToast(message, type='success') {
        const toast = getEl('toast');
        const toastMessage = getEl('toast-message');
        if (!toast || !toastMessage) return;

        toastMessage.textContent = message;
        toast.className = 'toast ' + type;
        toast.classList.add('show');

        setTimeout(()=>{ toast.classList.remove('show'); },3000);
    }
});

// historico.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const historyBody = document.getElementById('history-body');
    const totalPurchasesEl = document.getElementById('total-purchases');
    const totalSalesEl = document.getElementById('total-sales');
    const balanceEl = document.getElementById('balance');
    const exportModal = document.getElementById('export-modal');
    const exportForm = document.getElementById('export-form');
    
    // Dados temporários (serão substituídos por chamadas ao backend)
    let history = [];
    
    // Carrega histórico do localStorage ou inicializa dados de exemplo
    function loadHistory() {
        const savedHistory = localStorage.getItem('tradeLinkHistory');
        if (savedHistory) {
            history = JSON.parse(savedHistory);
        } else {
            // Dados de exemplo
            history = [
                {
                    id: 'TL-1001',
                    date: '2023-06-15',
                    partner: 'Fornecedor ABC',
                    value: 1250.50,
                    status: 'delivered',
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
                    date: '2023-05-28',
                    partner: 'Fornecedor XYZ',
                    value: 3420.00,
                    status: 'delivered',
                    type: 'purchase',
                    details: 'Equipamentos eletrônicos'
                },
                {
                    id: 'TL-1004',
                    date: '2023-05-20',
                    partner: 'Empresa W',
                    value: 1560.30,
                    status: 'delivered',
                    type: 'sale',
                    details: 'Serviços de consultoria'
                },
                {
                    id: 'TL-1005',
                    date: '2023-04-15',
                    partner: 'Fornecedor QRS',
                    value: 780.90,
                    status: 'delivered',
                    type: 'purchase',
                    details: 'Materiais de escritório'
                }
            ];
            saveHistory();
        }
        
        renderHistory();
        updateFinancialSummary();
    }
    
    // Salva histórico no localStorage
    function saveHistory() {
        localStorage.setItem('tradeLinkHistory', JSON.stringify(history));
    }
    
    // Renderiza a lista de histórico
    function renderHistory(filteredHistory = null) {
        const historyToRender = filteredHistory || history;
        historyBody.innerHTML = '';
        
        if (historyToRender.length === 0) {
            historyBody.innerHTML = '<tr><td colspan="6" class="no-history">Nenhum registro encontrado</td></tr>';
            return;
        }
        
        historyToRender.forEach(item => {
            const row = document.createElement('tr');
            
            // Formata a data
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString('pt-BR');
            
            // Determina o tipo (compra/venda)
            const typeText = item.type === 'purchase' ? 'Compra' : 'Venda';
            const typeClass = item.type === 'purchase' ? 'type-purchase' : 'type-sale';
            
            // Determina o texto do status
            const statusText = {
                'pending': 'Pendente',
                'processing': 'Em processamento',
                'shipped': 'Enviado',
                'delivered': 'Entregue',
                'cancelled': 'Cancelado'
            }[item.status];
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td><span class="type-badge ${typeClass}">${typeText}</span></td>
                <td>${item.partner}</td>
                <td>R$ ${item.value.toFixed(2).replace('.', ',')}</td>
                <td><span class="status-badge status-${item.status}">${statusText}</span></td>
                <td>
                    <button class="btn-view" data-id="${item.id}">
                        <i class="fas fa-eye"></i> Detalhes
                    </button>
                </td>
            `;
            
            historyBody.appendChild(row);
        });
        
        // Adiciona eventos aos botões de visualização
        document.querySelectorAll('.btn-view').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.dataset.id;
                showHistoryDetails(itemId);
            });
        });
    }
    
    // Atualiza o resumo financeiro
    function updateFinancialSummary() {
        const purchases = history.filter(item => item.type === 'purchase')
                               .reduce((sum, item) => sum + item.value, 0);
        
        const sales = history.filter(item => item.type === 'sale')
                             .reduce((sum, item) => sum + item.value, 0);
        
        const balance = sales - purchases;
        
        totalPurchasesEl.textContent = `R$ ${purchases.toFixed(2).replace('.', ',')}`;
        totalSalesEl.textContent = `R$ ${sales.toFixed(2).replace('.', ',')}`;
        balanceEl.textContent = `R$ ${balance.toFixed(2).replace('.', ',')}`;
        
        // Atualiza o gráfico (simplificado)
        updateChart(purchases, sales);
    }
    
    // Atualiza o gráfico (simplificado com Chart.js)
    function updateChart(purchases, sales) {
        const ctx = document.getElementById('history-chart').getContext('2d');
        
        // Destrói o gráfico anterior se existir
        if (window.historyChart) {
            window.historyChart.destroy();
        }
        
        window.historyChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Compras', 'Vendas', 'Saldo'],
                datasets: [{
                    label: 'Valor (R$)',
                    data: [purchases, sales, (sales - purchases)],
                    backgroundColor: [
                        'rgba(231, 76, 60, 0.7)',
                        'rgba(46, 204, 113, 0.7)',
                        'rgba(52, 152, 219, 0.7)'
                    ],
                    borderColor: [
                        'rgba(231, 76, 60, 1)',
                        'rgba(46, 204, 113, 1)',
                        'rgba(52, 152, 219, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
    
    // Mostra os detalhes de um item do histórico
    function showHistoryDetails(itemId) {
        const item = history.find(i => i.id === itemId);
        if (!item) return;
        
        // Reutiliza o modal de detalhes de pedido
        const orderDetailModal = document.getElementById('order-detail-modal');
        
        // Formata a data
        const dateObj = new Date(item.date);
        const formattedDate = dateObj.toLocaleDateString('pt-BR');
        
        // Determina o texto do status
        const statusText = {
            'pending': 'Pendente',
            'processing': 'Em processamento',
            'shipped': 'Enviado',
            'delivered': 'Entregue',
            'cancelled': 'Cancelado'
        }[item.status];
        
        // Preenche os detalhes no modal
        document.getElementById('order-id').textContent = item.id;
        document.getElementById('order-date').textContent = formattedDate;
        document.getElementById('order-partner').textContent = item.partner;
        document.getElementById('order-status').textContent = statusText;
        document.getElementById('order-value').textContent = 
            `R$ ${item.value.toFixed(2).replace('.', ',')}`;
        
        // Preenche os itens (simplificado para o exemplo)
        const productsBody = document.getElementById('order-products-body');
        productsBody.innerHTML = `
            <tr>
                <td>${item.details}</td>
                <td>1</td>
                <td>R$ ${item.value.toFixed(2).replace('.', ',')}</td>
                <td>R$ ${item.value.toFixed(2).replace('.', ',')}</td>
            </tr>
        `;
        
        // Ajusta os botões de ação
        const cancelBtn = document.getElementById('cancel-order');
        if (item.status === 'delivered' || item.status === 'cancelled') {
            cancelBtn.style.display = 'none';
        } else {
            cancelBtn.style.display = 'inline-block';
        }
        
        // Mostra o modal
        orderDetailModal.style.display = 'flex';
    }
    
    // Filtra o histórico
    function filterHistory() {
        const yearFilter = document.getElementById('year-filter').value;
        const typeFilter = document.getElementById('type-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();
        
        let filtered = history;
        
        // Filtro por ano
        if (yearFilter !== 'all') {
            filtered = filtered.filter(item => item.date.startsWith(yearFilter));
        }
        
        // Filtro por tipo
        if (typeFilter !== 'all') {
            filtered = filtered.filter(item => item.type === typeFilter);
        }
        
        // Filtro por busca
        if (searchTerm) {
            filtered = filtered.filter(item => 
                item.id.toLowerCase().includes(searchTerm) || 
                item.partner.toLowerCase().includes(searchTerm) ||
                item.details.toLowerCase().includes(searchTerm)
            );
        }
        
        renderHistory(filtered);
    }
    
    // Exporta o histórico (simulado)
    function exportHistory(format, period) {
        let dataToExport = history;
        
        // Filtra por período se necessário
        if (period === 'current') {
            // Implementar lógica para exportar apenas a página atual
        } else if (period === 'custom') {
            const startDate = document.getElementById('export-start').value;
            const endDate = document.getElementById('export-end').value;
            
            if (startDate && endDate) {
                dataToExport = history.filter(item => {
                    return item.date >= startDate && item.date <= endDate;
                });
            }
        }
        
        // Simula a exportação
        alert(`Exportando ${dataToExport.length} itens no formato ${format}`);
        exportModal.style.display = 'none';
    }
    
    // Event Listeners
    document.getElementById('year-filter').addEventListener('change', filterHistory);
    document.getElementById('type-filter').addEventListener('change', filterHistory);
    document.getElementById('search-input').addEventListener('input', filterHistory);
    
    document.getElementById('export-period').addEventListener('change', function() {
        const customDateRange = document.getElementById('custom-date-range');
        customDateRange.style.display = this.value === 'custom' ? 'block' : 'none';
    });
    
    exportForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const format = document.getElementById('export-format').value;
        const period = document.getElementById('export-period').value;
        
        exportHistory(format, period);
    });
    
    // Fecha o modal ao clicar fora do conteúdo
    window.addEventListener('click', function(event) {
        if (event.target === exportModal) {
            exportModal.style.display = 'none';
        }
    });
    
    // Inicialização
    loadHistory();
});
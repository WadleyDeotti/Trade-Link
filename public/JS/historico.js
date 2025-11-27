// historico.js (versão final corrigida)
document.addEventListener("DOMContentLoaded", () => {
    const historyBody = document.getElementById("history-body");
    const totalPurchases = document.getElementById("total-purchases");
    const totalSales = document.getElementById("total-sales");
    const balance = document.getElementById("balance");
    const ctx = document.getElementById("history-chart").getContext("2d");

    const yearFilter = document.getElementById("year-filter");
    const typeFilter = document.getElementById("type-filter");
    const searchInput = document.getElementById("search-input");

    let chart; // gráfico global

    // Carregar histórico
    async function carregarHistorico(state) {
        const year = yearFilter.value;
        const type = typeFilter.value;
        const search = searchInput.value;

        try {
            const response = await fetch(`/api/historico?year=${year}&type=${type}&search=${search}`);
            const data = await response.json();

            historyBody.innerHTML = "";

            if (data.length === 0) {
                historyBody.innerHTML = `<tr><td colspan="6" class="no-history">Nenhum registro encontrado</td></tr>`;
                return;
            }

            data.forEach(item => {
                const row = document.createElement("tr");
                const tipo = item.tipo === "compra" ? "Compra" : "Venda";
                const parceiro = item.nome_fornecedor || item.nome_empresa || "-";
                const valor = parseFloat(item.valor).toFixed(2).replace(".", ",");

                row.innerHTML = `
                    <td>${new Date(item.data).toLocaleDateString("pt-BR")}</td>
                    <td>${tipo}</td>
                    <td>${parceiro}</td>
                    <td>R$ ${valor}</td>
                    <td>${item.status}</td>
                    <td><button class="details-btn">Ver</button></td>
                `;
                historyBody.appendChild(row);
            });
        } catch (err) {
            console.error("Erro ao carregar histórico:", err);
        }
    }

    // Carregar resumo financeiro
async function carregarResumo(state) {
    try {
        const response = await fetch("/api/historico/resumo");
        const data = await response.json();

        // USAR total_purchases, total_sales, balance (que são os IDs do seu HTML)
        totalPurchases.textContent = `R$ ${parseFloat(data.total_purchases || 0).toFixed(2).replace(".", ",")}`;
        totalSales.textContent = `R$ ${parseFloat(data.total_sales || 0).toFixed(2).replace(".", ",")}`;
        balance.textContent = `R$ ${parseFloat(data.balance || 0).toFixed(2).replace(".", ",")}`;
    } catch (err) {
        console.error("Erro ao carregar resumo financeiro:", err);
    }
}

    // Carregar gráfico
    async function carregarGrafico(state) {
        try {
            const response = await fetch("/api/historico/grafico");
            const data = await response.json();

            const labels = data.map(d => `${d.mes}/${new Date().getFullYear()}`);
            const compras = data.map(d => d.compras);
            const vendas = data.map(d => d.vendas);

            if (chart) chart.destroy(); // destruir gráfico anterior

            chart = new Chart(ctx, {
                type: "bar",
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Compras",
                            data: compras,
                            backgroundColor: "rgba(255, 99, 132, 0.6)",
                        },
                        {
                            label: "Vendas",
                            data: vendas,
                            backgroundColor: "rgba(54, 162, 235, 0.6)",
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true } }
                }
            });
        } catch (err) {
            console.error("Erro ao carregar gráfico:", err);
        }
    }

    // Eventos de filtro
    yearFilter.addEventListener("change", () => {
        carregarHistorico();
        carregarGrafico();
    });
    typeFilter.addEventListener("change", carregarHistorico);
    searchInput.addEventListener("input", carregarHistorico);

    // Inicialização
    carregarHistorico();
    carregarResumo();
    carregarGrafico();
});




// 1. O Objeto Global que Gerencia o Estado e Notifica os Observadores
const appState = {
    // Estado inicial que será modificado pelos filtros
    state: {
        year: document.getElementById('year-filter').value, // Pega o valor inicial
        type: document.getElementById('type-filter').value,
        search: document.getElementById('search-input').value
    },
    observers: [],

    // Adiciona uma função (ex: carregarHistorico) à lista
    subscribe: function(observerFn) {
        this.observers.push(observerFn);
    },

    // Notifica todas as funções quando o estado muda
    notify: function() {
        this.observers.forEach(observerFn => observerFn(this.state));
    },

    // Atualiza o estado e notifica todos
    updateState: function(newState) {
        // Usa Object.assign para mesclar o novo estado
        this.state = Object.assign({}, this.state, newState);
        console.log("Estado atualizado e notificado:", this.state);
        this.notify();
    }
};

// --- Conexão dos Observadores e Filtros ---

document.addEventListener("DOMContentLoaded", () => {
    // 1. Adicionar as funções como Observadoras
    appState.subscribe(carregarHistorico);
    appState.subscribe(carregarResumo);
    appState.subscribe(carregarGrafico); // se existir

    // 2. Conectar os filtros à função updateState
    const yearFilter = document.getElementById('year-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button'); // Botão de busca

    // Listener para Ano e Tipo
    yearFilter.addEventListener('change', (e) => {
        appState.updateState({ year: e.target.value });
    });

    typeFilter.addEventListener('change', (e) => {
        appState.updateState({ type: e.target.value });
    });

    // Listener para a Busca (pode ser no botão ou no input)
    searchButton.addEventListener('click', () => {
        appState.updateState({ search: searchInput.value });
    });
    
    // 3. Primeira Carga (Dispara a primeira notificação com o estado inicial)
    appState.notify();
});
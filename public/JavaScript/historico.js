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
    async function carregarHistorico() {
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
async function carregarResumo() {
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
    async function carregarGrafico() {
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

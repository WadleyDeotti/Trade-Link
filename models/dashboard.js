

class DashboardModel {
  // Formata os dados do dashboard para a resposta da API
  static formatDashboardData({
    faturamentoPeriodo,
    faturamentoMensal,
    metricas,
    tendencia
  }) {
    return {
      totalRevenue: Number(faturamentoPeriodo.toFixed(2)),
      totalOrders: metricas.total_pedidos ?? 0,
      pendingOrders: metricas.pedidos_pendentes ?? 0,
      newCustomers: metricas.novos_clientes ?? 0,
      revenueTrend: Number(tendencia.toFixed(1)),
      monthlyRevenue: faturamentoMensal // já vem como array de { mes: '2025-01', valor: 12500.00 }
    };
  }
}

export default DashboardModel;
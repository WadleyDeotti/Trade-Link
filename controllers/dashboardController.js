// src/controllers/dashboardController.js

import {
  getFaturamentoPeriodoFornecedor,
  getFaturamentoMensalFornecedor,
  getMetricasFornecedor,
  getTendenciaFornecedor
} from '../Repository.js'; 

// ===============================================
// Função auxiliar para calcular o período (fica aqui mesmo)
// ===============================================
const calcularPeriodo = (periodo, start = null, end = null) => {
  const dataFim = new Date();
  dataFim.setHours(23, 59, 59, 999);

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  let dataInicio = new Date(hoje);

  switch (periodo) {
    case 'today':
      dataInicio = new Date(hoje);
      break;

    case 'week': // Semana atual começando na segunda-feira
      dataInicio = new Date(hoje);
      const diaDaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda...
      const diff = diaDaSemana === 0 ? -6 : 1 - diaDaSemana; // Ajusta para segunda
      dataInicio.setDate(hoje.getDate() + diff);
      break;

    case 'month': // Mês atual
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
      break;

    case 'quarter': // Trimestre atual
      const trimestre = Math.floor(hoje.getMonth() / 3) * 3;
      dataInicio = new Date(hoje.getFullYear(), trimestre, 1);
      break;

    case 'year': // Ano atual
      dataInicio = new Date(hoje.getFullYear(), 0, 1);
      break;

    case 'custom':
      if (start) dataInicio = new Date(start);
      if (end) {
        const customEnd = new Date(end);
        customEnd.setHours(23, 59, 59, 999);
        Object.assign(dataFim, customEnd);
      }
      break;

    default:
      // Padrão = mês atual
      dataInicio = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }

  // Formato MySQL: YYYY-MM-DD HH:mm:ss
  const formatar = (date) => date.toISOString().slice(0, 19).replace('T', ' ');

  return {
    dataInicio: formatar(dataInicio),
    dataFim: formatar(dataFim)
  };
};

// ===============================================
// Controller principal do Dashboard do Fornecedor
// ===============================================
export const getDashboard = async (req, res) => {
  try {
    // Fornecedor logado (vem do seu middleware de autenticação)
    const id_fornecedor = req.user?.id_fornecedor;

    if (!id_fornecedor) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não autenticado ou não é fornecedor'
      });
    }

    // Parâmetros da query (?period=month&start=2025-01-01&end=2025-01-31)
    const { period = 'week', start, end } = req.query;

    // Calcula as datas de início e fim no formato MySQL
    const { dataInicio, dataFim } = calcularPeriodo(period, start, end);

    // Executa todas as consultas em paralelo (muito mais rápido)
    const [
      faturamentoPeriodo,
      faturamentoMensal,
      metricas,
      tendencia
    ] = await Promise.all([
      getFaturamentoPeriodoFornecedor(id_fornecedor, dataInicio, dataFim),
      getFaturamentoMensalFornecedor(id_fornecedor),
      getMetricasFornecedor(id_fornecedor),
      getTendenciaFornecedor(id_fornecedor, dataInicio, dataFim)
    ]);

    // Resposta final padronizada
    res.json({
      success: true,
      data: {
        totalRevenue: Number(faturamentoPeriodo.toFixed(2)),
        totalOrders: metricas.total_pedidos ?? 0,
        pendingOrders: metricas.pedidos_pendentes ?? 0,
        newCustomers: metricas.novos_clientes ?? 0,
        revenueTrend: Number(tendencia.toFixed(1)),
        monthlyRevenue: faturamentoMensal // já vem no formato [{ mes: '2025-11', valor: 12345.67 }, ...]
      },
      period: { // útil para o front-end saber qual período está vendo
        type: period,
        start: dataInicio,
        end: dataFim
      }
    });

  } catch (error) {
    console.error('Erro no dashboard do fornecedor:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};
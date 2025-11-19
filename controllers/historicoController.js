const usuarioRepository = require('../repository/usuarioRepository');

// Buscar histórico
exports.getHistorico = async (req, res) => {
  try {
    const { year, type, search } = req.query;
    const historico = await usuarioRepository.buscarHistorico({ year, type, search });
    res.json(historico);
  } catch (err) {
    console.error('Erro ao buscar histórico:', err);
    res.status(500).json({ error: "Erro ao buscar histórico" });
  }
};

// Resumo financeiro
exports.getResumo = async (req, res) => {
  try {
    const resumo = await usuarioRepository.resumoFinanceiro();
    res.json(resumo);
  } catch (err) {
    console.error('Erro ao calcular resumo:', err);
    res.status(500).json({ error: "Erro ao calcular resumo" });
  }
};

// Dados para gráfico mensal
exports.getGrafico = async (req, res) => {
  try {
    const grafico = await usuarioRepository.dadosGrafico();
    res.json(grafico);
  } catch (err) {
    console.error('Erro ao gerar gráfico:', err);
    res.status(500).json({ error: "Erro ao gerar gráfico" });
  }
};

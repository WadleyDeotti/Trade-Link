export const getDashboard = async (req, res) => {
    try {
        if (!req.session.usuario) {
            return res.status(401).json({ success: false, message: "Usuário não logado" });
        }

        const id_fornecedor = req.session.usuario.id_fornecedor;

        if (!id_fornecedor) {
            console.log("Fornecedor não encontrado na sessão:", req.session.usuario);
            return res.status(400).json({ success: false, message: "ID do fornecedor ausente" });
        }

        const [
            totalFaturamento,
            totalPedidos,
            totalPendentes,
            totalClientes,
            pedidosRecentes
        ] = await Promise.all([
            dashboardRepository.totalFaturamento(id_fornecedor),
            dashboardRepository.totalPedidos(id_fornecedor),
            dashboardRepository.totalPendentes(id_fornecedor),
            dashboardRepository.totalClientes(id_fornecedor),
            dashboardRepository.pedidosRecentes(id_fornecedor),
        ]);

        res.json({
            success: true,
            totalFaturamento: totalFaturamento.total || 0,
            totalPedidos: totalPedidos.total || 0,
            totalPendentes: totalPendentes.total || 0,
            totalClientes: totalClientes.total || 0,
            pedidosRecentes
        });

    } catch (error) {
        console.error("Erro no dashboard:", error);
        res.status(500).json({ success: false, message: "Erro no dashboard" });
    }
};

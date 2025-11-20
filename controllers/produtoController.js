import usuarioRepository from '../repository/usuarioRepository.js';

// Rota para exibir a página de detalhes do produto
export const getProdutoPage = async (req, res) => {
    const id_produto = req.params.id;

    if (!id_produto) {
        return res.status(400).send("ID do produto é obrigatório.");
    }

    try {
        const produto = await usuarioRepository.buscarProdutoPorId(id_produto);
        
        if (!produto) {
            return res.status(404).send("Produto não encontrado.");
        }

        const caracteristicas = await usuarioRepository.buscarCaracteristicas(id_produto);

        res.render('produto', { 
            produto: produto,
            avaliacoes: await usuarioRepository.buscarAvaliacoes(id_produto),
            caracteristicas: caracteristicas
        });

    } catch (err) {
        console.error('Erro ao carregar a página do produto:', err);
        res.status(500).send("Erro interno ao carregar detalhes do produto.");
    }
};


// Página principal da lista de produtos
export const getListaProdutos = async (req, res) => {
    try {
        res.render('produto', {
            produto: null,
            avaliacoes: [],
            caracteristicas: []
        });

    } catch (err) {
        console.error('Erro ao carregar a lista de produtos:', err);
        res.status(500).send("Erro interno ao carregar a lista de produtos.");
    }
};

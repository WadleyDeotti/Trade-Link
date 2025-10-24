const usuarioRepository = require('../repository/usuarioRepository');

// Rota para exibir a página de detalhes do produto
exports.getProdutoPage = async (req, res) => {
    // 1. Pega o ID do produto da URL (ex: /produto/15 -> id é 15)
    const id_produto = req.params.id; 

    if (!id_produto) {
        return res.status(400).send("ID do produto é obrigatório.");
    }

    try {
        // 2. Busca os dados no Banco de Dados
        const produto = await usuarioRepository.buscarProdutoPorId(id_produto);
        
        if (!produto) {
            // Produto não encontrado (retorna 404)
            return res.status(404).send("Produto não encontrado."); 
        }

        // 3. Renderiza a View (EJS) e passa os dados
        // Assumindo que sua view se chama 'produto.ejs'
        res.render('produto', { 
            produto: produto,
            // Você pode adicionar outros dados aqui, como avaliacoes, relacionados, etc.
            avaliacoes: await usuarioRepository.buscarAvaliacoes(id_produto) 
        });

    } catch (err) {
        console.error('Erro ao carregar a página do produto:', err);
        // Retorna um status 500 (Erro Interno do Servidor)
        res.status(500).send("Erro interno ao carregar detalhes do produto.");
    }
};


// Função para exibir a página principal de produtos (Lista)
exports.getListaProdutos = async (req, res) => {
    try {
        res.render('produto', {
            // Passe dados vazios ou uma flag para o EJS saber que é a lista/página inicial
            produto: null, 
            avaliacoes: [] 
        });

    } catch (err) {
        console.error('Erro ao carregar a lista de produtos:', err);
        res.status(500).send("Erro interno ao carregar a lista de produtos.");
    }
};
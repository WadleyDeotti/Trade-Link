import usuarioRepository from '../repository/usuarioRepository.js';

// Rota para exibir a página de detalhes do produto
export const getProdutoPage = async (req, res) => {
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

        // 3. Busca as características (CORRIGIDO: O await está DENTRO da função async)
        const caracteristicas = await usuarioRepository.buscarCaracteristicas(id_produto); 
        
        // 4. Renderiza a View (EJS) e passa os dados
        res.render('produto', { 
            produto: produto,
            avaliacoes: await usuarioRepository.buscarAvaliacoes(id_produto),
            caracteristicas: caracteristicas // Passando a lista de características
        });

    } catch (err) {
        console.error('Erro ao carregar a página do produto:', err);
        // Retorna um status 500 (Erro Interno do Servidor)
        res.status(500).send("Erro interno ao carregar detalhes do produto.");
    }
};


// Função para exibir a página principal de produtos (Lista)
export const getListaProdutos = async (req, res) => {
    try {
        // Renderiza a view de produto, mas com dados vazios para evitar quebra no EJS
        res.render('produto', {
            produto: null, 
            avaliacoes: [],
            caracteristicas: [] // Garante que a lista não quebre se for nula
        });

    } catch (err) {
        console.error('Erro ao carregar a lista de produtos:', err);
        res.status(500).send("Erro interno ao carregar a lista de produtos.");
    }
};
document.addEventListener('DOMContentLoaded', function() {
    const categoriaSelect = document.getElementById('categoria-select');
    const catName = document.getElementById('cat_name');
    const catIcon = document.getElementById('cat_icon');
    const produtosContainer = document.getElementById('produtos-container');
    const aplicarPrecoBtn = document.getElementById('aplicar-preco');
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const searchInput = document.querySelector('.search');

    const categorias = {
        'eletronicos': { nome: 'Eletrônicos', icon: 'fas fa-laptop' },
        'roupas': { nome: 'Roupas', icon: 'fas fa-tshirt' },
        'casa': { nome: 'Casa e Jardim', icon: 'fas fa-home' },
        'esportes': { nome: 'Esportes', icon: 'fas fa-dumbbell' },
        'livros': { nome: 'Livros', icon: 'fas fa-book' }
    };

    // Mudança de categoria
    categoriaSelect.addEventListener('change', function() {
        const categoria = this.value;
        window.location.href = `/categoria?categoria=${categoria}`;
    });

    // Filtro de preço
    aplicarPrecoBtn.addEventListener('click', function() {
        buscarProdutos();
    });

    // Busca em tempo real
    let timeoutId;
    searchInput.addEventListener('input', function() {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            buscarProdutos();
        }, 500);
    });

    // Função para buscar produtos via API
    async function buscarProdutos() {
        const params = new URLSearchParams();
        
        const termo = searchInput.value.trim();
        const categoria = categoriaSelect.value;
        const minPreco = precoMin.value;
        const maxPreco = precoMax.value;
        
        if (termo) params.append('termo', termo);
        if (categoria) params.append('categoria', categoria);
        if (minPreco) params.append('precoMin', minPreco);
        if (maxPreco) params.append('precoMax', maxPreco);
        
        try {
            const response = await fetch(`/api/produtos/buscar?${params}`);
            const data = await response.json();
            
            renderizarProdutos(data.produtos);
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    }

    // Função para renderizar produtos
    function renderizarProdutos(produtos) {
        if (!produtos || produtos.length === 0) {
            produtosContainer.innerHTML = '<div class="no-products"><p>Nenhum produto encontrado.</p></div>';
            return;
        }
        
        produtosContainer.innerHTML = produtos.map(prod => `
            <div class="produto" data-preco="${prod.preco}" data-categoria="${prod.categoria}"
                 style="cursor: pointer;" onclick="window.location.href='/produto/${prod.id_produto}'">
                <div class="imagem"></div>
                <div class="info">
                    <p class="nome">${prod.nome_produto}</p>
                    <p class="preco">R$ ${parseFloat(prod.preco).toFixed(2)}</p>
                    ${prod.descricao ? `<p class="descricao">${prod.descricao.substring(0, 60)}...</p>` : ''}
                    <p class="disponibilidade" style="color: ${prod.disponivel ? 'green' : 'red'};">
                        ${prod.disponivel ? 'Disponível' : 'Indisponível'}
                    </p>
                </div>
            </div>
        `).join('');
    }

    // Atualizar ícone da categoria
    function atualizarIconeCategoria() {
        const categoria = categoriaSelect.value;
        const catInfo = categorias[categoria];
        if (catInfo) {
            catIcon.className = catInfo.icon;
        }
    }

    // Inicializar
    atualizarIconeCategoria();
});
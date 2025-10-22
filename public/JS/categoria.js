document.addEventListener('DOMContentLoaded', function() {
    const categoriaSelect = document.getElementById('categoria-select');
    const catTitle = document.getElementById('cat_title');
    const catName = document.getElementById('cat_name');
    const catIcon = document.getElementById('cat_icon');
    const produtosContainer = document.getElementById('produtos-container');
    const aplicarPrecoBtn = document.getElementById('aplicar-preco');
    const aplicarQtdBtn = document.getElementById('aplicar-qtd');
    const precoMin = document.getElementById('preco-min');
    const precoMax = document.getElementById('preco-max');
    const qtdMin = document.getElementById('qtd-min');
    const qtdMax = document.getElementById('qtd-max');

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
        const catInfo = categorias[categoria];
        
        catName.textContent = catInfo.nome;
        catIcon.className = catInfo.icon;
        
        filtrarProdutos();
    });

    // Filtro de preço
    aplicarPrecoBtn.addEventListener('click', function() {
        filtrarProdutos();
    });

    // Filtro de quantidade
    aplicarQtdBtn.addEventListener('click', function() {
        filtrarProdutos();
    });

    // Função principal de filtro
    function filtrarProdutos() {
        const categoriaSelecionada = categoriaSelect.value;
        const minPreco = parseFloat(precoMin.value) || 0;
        const maxPreco = parseFloat(precoMax.value) || Infinity;
        const minQtd = parseInt(qtdMin.value) || 0;
        const maxQtd = parseInt(qtdMax.value) || Infinity;

        const produtos = produtosContainer.querySelectorAll('.produto');
        
        produtos.forEach(produto => {
            const categoria = produto.dataset.categoria;
            const preco = parseFloat(produto.dataset.preco);
            const qtd = parseInt(produto.dataset.qtd);
            
            const categoriaMatch = categoria === categoriaSelecionada;
            const precoMatch = preco >= minPreco && preco <= maxPreco;
            const qtdMatch = qtd >= minQtd && qtd <= maxQtd;
            
            if (categoriaMatch && precoMatch && qtdMatch) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        });
    }

    // Filtros de checkbox
    const checkboxes = document.querySelectorAll('.filter-group input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Implementar lógica adicional para filtros de checkbox se necessário
            console.log(`Filtro ${this.id}: ${this.checked}`);
        });
    });

    // Busca
    const searchInput = document.querySelector('.search');
    searchInput.addEventListener('input', function() {
        const termo = this.value.toLowerCase();
        const produtos = produtosContainer.querySelectorAll('.produto');
        
        produtos.forEach(produto => {
            const nome = produto.querySelector('.nome').textContent.toLowerCase();
            if (nome.includes(termo)) {
                produto.style.display = 'block';
            } else {
                produto.style.display = 'none';
            }
        });
    });

    // Inicializar com categoria padrão
    filtrarProdutos();
});
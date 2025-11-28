document.addEventListener('DOMContentLoaded', function() {
    // Variável global para produto atual
    window.produtoAtualId = null;

    // ========== MODAIS ==========
    
    // Abrir modal de adicionar produto
    const addProductBtn = document.getElementById('add-product-btn');
    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => {
            document.getElementById('product-modal').style.display = 'block';
        });
    }

    // Fechar modais
    document.querySelectorAll('.close').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Fechar modal clicando fora
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });

    // Botões de cancelar
    document.getElementById('cancel-product-btn')?.addEventListener('click', () => {
        document.getElementById('product-modal').style.display = 'none';
    });

    document.getElementById('cancel-delete-btn')?.addEventListener('click', () => {
        document.getElementById('delete-confirm-modal').style.display = 'none';
    });

    // ========== CARROSSEL ==========
    
    const carouselPrev = document.querySelector('.carousel-button-prev');
    const carouselNext = document.querySelector('.carousel-button-next');
    const carouselTrack = document.querySelector('.carousel-track');
    
    if (carouselPrev && carouselNext && carouselTrack) {
        let currentIndex = 0;
        const itemsPerView = 3;
        
        carouselNext.addEventListener('click', () => {
            const items = carouselTrack.children.length;
            if (currentIndex < items - itemsPerView) {
                currentIndex++;
                updateCarousel();
            }
        });
        
        carouselPrev.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });
        
        function updateCarousel() {
            const translateX = currentIndex * (100 / itemsPerView);
            carouselTrack.style.transform = `translateX(-${translateX}%)`;
        }
    }

    // ========== FORMULÁRIO DE PERFIL ==========
    
    const cancelBtn = document.getElementById('cancel-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            location.reload();
        });
    }
});

// ========== FUNÇÕES GLOBAIS DOS BOTÕES ==========

function abrirModalVisualizacao(id) {
    window.produtoAtualId = id;
    
    fetch(`/api/produto/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(produto => {
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            const viewContent = document.getElementById('product-view-content');
            viewContent.innerHTML = `
                <div class="product-details">
                    <h3>${produto.nome_produto}</h3>
                    <p><strong>Descrição:</strong> ${produto.descricao || 'Sem descrição'}</p>
                    <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                    <p><strong>Categoria:</strong> ${produto.categoria || 'Sem categoria'}</p>
                    <p><strong>Disponível:</strong> ${produto.disponivel ? 'Sim' : 'Não'}</p>
                </div>
            `;
            document.getElementById('product-view-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar produto:', error);
            showToast(`Erro ao carregar produto: ${error.message}`, 'error');
        });
}

function abrirModalEdicao(id) {
    window.produtoAtualId = id;
    
    fetch(`/api/produto/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        })
        .then(produto => {
            if (!produto) {
                throw new Error('Produto não encontrado');
            }
            // Preencher campos do modal de edição
            document.getElementById('edit-product-id').value = produto.id_produto;
            document.getElementById('edit-product-name').value = produto.nome_produto;
            document.getElementById('edit-product-description').value = produto.descricao || '';
            document.getElementById('edit-product-price').value = produto.preco;
            document.getElementById('edit-categoria').value = produto.categoria || '';
            
            // Atualizar action do form
            document.getElementById('formEditProduct').action = `/editarProduto/${produto.id_produto}`;
            
            // Abrir modal
            document.getElementById('edit-product-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar produto:', error);
            showToast(`Erro ao carregar produto: ${error.message}`, 'error');
        });
}

function editarProduto() {
    if (window.produtoAtualId) {
        abrirModalEdicao(window.produtoAtualId);
        document.getElementById('product-view-modal').style.display = 'none';
    }
}

function excluirProduto() {
    if (window.produtoAtualId) {
        document.getElementById('product-view-modal').style.display = 'none';
        document.getElementById('delete-confirm-modal').style.display = 'block';
        
        // Configurar botão de confirmação
        const confirmBtn = document.getElementById('confirm-delete-btn');
        confirmBtn.onclick = function() {
            const form = document.createElement('form');
            form.method = 'POST';
            form.action = `/excluirProduto/${window.produtoAtualId}`;
            document.body.appendChild(form);
            form.submit();
        };
    }
}

function fecharModal() {
    document.getElementById('product-view-modal').style.display = 'none';
}

function fecharModalEdicao() {
    document.getElementById('edit-product-modal').style.display = 'none';
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.className = `toast ${type} show`;
        toast.style.display = 'block';
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        }, 3000);
    }
}
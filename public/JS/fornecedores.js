// ==========================
// PERFIL.JS — versão visual
// ==========================

// Pegar elementos
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeModalBtns = productModal.querySelectorAll('.close'); // todos os 'x' do modal
const cancelProductBtn = document.getElementById('cancel-product-btn');
const openProductBtns = document.querySelectorAll(".open-product-modal");
const closeProductModal = document.getElementById("close-product-modal");


// ------- Toast de mensagens visuais -------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ------- Modal de Produto -------


if (openProductBtns && productModal) {
  openProductBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      productModal.classList.add("visible");
    });
  });
}

if (closeProductModal) {
  closeProductModal.addEventListener("click", () => {
    productModal.classList.remove("visible");
  });
}

// ------- Modal de Edição de Perfil -------
const editProfileModal = document.getElementById("edit-profile-modal");
const openEditProfileBtn = document.getElementById("open-edit-profile");
const closeEditProfileBtn = document.getElementById("close-edit-profile");

if (openEditProfileBtn && editProfileModal) {
  openEditProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.add("visible");
  });
}

if (closeEditProfileBtn) {
  closeEditProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.remove("visible");
  });
}

// ------- Carrossel -------
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".track");
  const next = carousel.parentElement.querySelector(".next");
  const prev = carousel.parentElement.querySelector(".prev");

  let index = 0;
  const items = track?.children.length || 0;

  if (next && prev && items > 0) {
    next.addEventListener("click", () => {
      index = (index + 1) % items;
      track.style.transform = `translateX(-${index * 100}%)`;
    });

    prev.addEventListener("click", () => {
      index = (index - 1 + items) % items;
      track.style.transform = `translateX(-${index * 100}%)`;
    });
  }
});

// ------- Exemplo de feedback visual -------
document.querySelectorAll(".fake-action").forEach(btn => {
  btn.addEventListener("click", () => {
    showToast("Ação de exemplo — sem dados reais!", "info");
  });
});

console.log("JS visual carregado com sucesso 🎨");

// Abrir modal ao clicar no botão "Adicionar Produto"
addProductBtn.addEventListener('click', () => {
    productModal.style.display = 'block';
});

// Fechar modal ao clicar no "x"
closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        productModal.style.display = 'none';
    });
});

// Fechar modal ao clicar no botão cancelar
cancelProductBtn.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Fechar modal clicando fora da modal-content
window.addEventListener('click', (event) => {
    if(event.target === productModal){
        productModal.style.display = 'none';
    }
});

// Variável global para armazenar o ID do produto sendo editado
let produtoAtualId = null;

// Função para abrir modal de edição
function editarProduto() {
    const editModal = document.getElementById('edit-product-modal');
    const viewModal = document.getElementById('product-view-modal');
    
    if (produtoAtualId) {
        // Buscar dados do produto
        fetch(`/produto/${produtoAtualId}`)
            .then(response => response.json())
            .then(produto => {
                // Preencher campos do modal de edição
                document.getElementById('edit-product-id').value = produto.id_produto;
                document.getElementById('edit-product-name').value = produto.nome_produto;
                document.getElementById('edit-product-description').value = produto.descricao;
                document.getElementById('edit-product-price').value = produto.preco;
                document.getElementById('edit-categoria').value = produto.categoria;
                
                // Atualizar action do form
                document.getElementById('formEditProduct').action = `/editarProduto/${produto.id_produto}`;
                
                // Fechar modal de visualização e abrir modal de edição
                viewModal.style.display = 'none';
                editModal.style.display = 'block';
            })
            .catch(error => {
                console.error('Erro ao buscar produto:', error);
                showToast('Erro ao carregar dados do produto', 'error');
            });
    }
}

// Função para fechar modal de edição
function fecharModalEdicao() {
    document.getElementById('edit-product-modal').style.display = 'none';
}

// Fechar modal de edição ao clicar no X
document.addEventListener('DOMContentLoaded', function() {
    const editModal = document.getElementById('edit-product-modal');
    const closeEditBtns = editModal.querySelectorAll('.close');
    
    closeEditBtns.forEach(btn => {
        btn.addEventListener('click', fecharModalEdicao);
    });
    
    // Fechar modal clicando fora
    window.addEventListener('click', (event) => {
        if(event.target === editModal){
            fecharModalEdicao();
        }
    });
});

// Função para definir o produto atual (deve ser chamada quando um produto é selecionado)
function setProdutoAtual(id) {
    produtoAtualId = id;
}

// Função para fechar modal de visualização
function fecharModal() {
    document.getElementById('product-view-modal').style.display = 'none';
}

// Função para excluir produto
function excluirProduto() {
    if (produtoAtualId && confirm('Tem certeza que deseja excluir este produto?')) {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = `/excluirProduto/${produtoAtualId}`;
        document.body.appendChild(form);
        form.submit();
    }
}

// Carregar produtos do fornecedor
function carregarProdutos() {
    const usuario = window.usuario || {};
    if (usuario.id_fornecedor) {
        fetch(`/produtos/fornecedor/${usuario.id_fornecedor}`)
            .then(response => response.json())
            .then(produtos => {
                const carouselTrack = document.querySelector('.carousel-track');
                const productsCount = document.getElementById('products-count');
                
                if (carouselTrack) {
                    carouselTrack.innerHTML = '';
                    
                    produtos.forEach(produto => {
                        const produtoCard = document.createElement('div');
                        produtoCard.className = 'product-card';
                        produtoCard.innerHTML = `
                            <div class="product-image">
                                <img src="/imagens/produto-default.jpg" alt="${produto.nome_produto}">
                            </div>
                            <div class="product-info">
                                <h3>${produto.nome_produto}</h3>
                                <p class="product-description">${produto.descricao}</p>
                                <p class="product-price">R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                                <p class="product-category">${produto.categoria}</p>
                                <div class="product-actions">
                                    <button class="btn btn-sm btn-primary" onclick="abrirModalVisualizacao(${produto.id_produto})">
                                        <i class="fas fa-eye"></i> Ver
                                    </button>
                                    <button class="btn btn-sm btn-secondary" onclick="abrirModalEdicao(${produto.id_produto})">
                                        <i class="fas fa-edit"></i> Editar
                                    </button>
                                </div>
                            </div>
                        `;
                        carouselTrack.appendChild(produtoCard);
                    });
                    
                    if (productsCount) {
                        productsCount.textContent = produtos.length;
                    }
                }
            })
            .catch(error => {
                console.error('Erro ao carregar produtos:', error);
            });
    }
}

// Função para abrir modal de visualização
function abrirModalVisualizacao(id) {
    setProdutoAtual(id);
    fetch(`/produto/${id}`)
        .then(response => response.json())
        .then(produto => {
            const viewContent = document.getElementById('product-view-content');
            viewContent.innerHTML = `
                <div class="product-details">
                    <h3>${produto.nome_produto}</h3>
                    <p><strong>Descrição:</strong> ${produto.descricao}</p>
                    <p><strong>Preço:</strong> R$ ${parseFloat(produto.preco).toFixed(2)}</p>
                    <p><strong>Categoria:</strong> ${produto.categoria}</p>
                </div>
            `;
            document.getElementById('product-view-modal').style.display = 'block';
        })
        .catch(error => {
            console.error('Erro ao buscar produto:', error);
        });
}

// Função para abrir modal de edição diretamente
function abrirModalEdicao(id) {
    setProdutoAtual(id);
    editarProduto();
}

// Carregar produtos quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    carregarProdutos();
});
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
    // Resetar o modal para modo de adição
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('categoria').value = '';
    document.getElementById('product-modal-title').textContent = 'Adicionar Produto';
    
    // Restaurar action do form para adição
    const form = document.querySelector('#product-modal form');
    form.action = '/cadastrarProduto';
    
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

// Função para visualizar produto
function viewProduct(productId) {
    // Buscar dados do produto e mostrar no modal de visualização
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        const name = productCard.querySelector('.product-name').textContent;
        const price = productCard.querySelector('.product-price').textContent;
        const category = productCard.querySelector('.product-category').textContent;
        
        showToast(`Visualizando: ${name}`, 'info');
    }
}

// Função para editar produto
function editProduct(productId) {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`);
    if (productCard) {
        const name = productCard.querySelector('.product-name').textContent;
        const price = productCard.querySelector('.product-price').textContent.replace('R$ ', '');
        const category = productCard.querySelector('.product-category').textContent;
        
        // Preencher o modal com dados do produto
        document.getElementById('product-name').value = name;
        document.getElementById('product-price').value = price;
        document.getElementById('categoria').value = category;
        document.getElementById('product-modal-title').textContent = 'Editar Produto';
        
        // Alterar action do form para edição
        const form = document.querySelector('#product-modal form');
        form.action = `/editarProduto/${productId}`;
        
        productModal.style.display = 'block';
    }
}

// Carrossel de produtos
const carouselTrack = document.getElementById('products-track');
const prevBtn = document.querySelector('.carousel-button-prev');
const nextBtn = document.querySelector('.carousel-button-next');

if (prevBtn && nextBtn && carouselTrack) {
    let currentIndex = 0;
    const productCards = carouselTrack.querySelectorAll('.product-card');
    const cardsPerView = 3;
    const maxIndex = Math.max(0, productCards.length - cardsPerView);

    nextBtn.addEventListener('click', () => {
        if (currentIndex < maxIndex) {
            currentIndex++;
            updateCarousel();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    });

    function updateCarousel() {
        const translateX = currentIndex * (100 / cardsPerView);
        carouselTrack.style.transform = `translateX(-${translateX}%)`;
    }
}
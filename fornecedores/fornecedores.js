document.addEventListener('DOMContentLoaded', function() {
    // Elementos da barra lateral
    const sidebar = document.getElementById('sidebar');
    const btnConfig = document.getElementById('btnConfig');
    
    // Elementos do header
    const profileBtn = document.getElementById('profile-btn');
    const dropdownMenu = document.getElementById('dropdown-menu');
    
    // Elementos dos modais
    const imageModal = document.getElementById('image-modal');
    const productModal = document.getElementById('product-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Elementos para upload de imagem
    const foto = document.getElementById('foto');
    const bannerfoto = document.getElementById('bannerfoto');
    const imageUpload = document.getElementById('image-upload');
    const confirmImage = document.getElementById('confirm-image');
    
    // Elementos para produtos
    const addProdutoBtn = document.getElementById('adicionarproduto');
    const produtosContainer = document.getElementById('produtos');
    const productNameInput = document.getElementById('product-name');
    const productImageUpload = document.getElementById('product-image-upload');
    const confirmProduct = document.getElementById('confirm-product');
    
    // Variáveis globais
    let currentImageType = ''; // 'profile' ou 'banner'
    let currentProductId = null;
    let productImageFile = null;
    let editImageFile = null;

    // Barra lateral - alternar expansão
    btnConfig.addEventListener('click', function() {
        sidebar.classList.toggle('expanded');
    });

    // Header dropdown - mostrar/esconder menu
    profileBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    });

    // Fechar dropdown quando clicar fora
    document.addEventListener('click', function() {
        dropdownMenu.style.display = 'none';
    });

    // Impedir que o clique no dropdown feche o menu
    dropdownMenu.addEventListener('click', function(e) {
        e.stopPropagation();
    });

    // Modais de imagem (perfil/banner)
    foto.addEventListener('click', function() {
        currentImageType = 'profile';
        imageModal.style.display = 'block';
    });

    bannerfoto.addEventListener('click', function() {
        currentImageType = 'banner';
        imageModal.style.display = 'block';
    });

    // Modal de adicionar produto
    addProdutoBtn.addEventListener('click', function() {
        productModal.style.display = 'block';
    });

    // Fechar modais
    closeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            imageModal.style.display = 'none';
            productModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Fechar modais quando clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) imageModal.style.display = 'none';
        if (e.target === productModal) productModal.style.display = 'none';
        if (e.target === editModal) editModal.style.display = 'none';
    });

    // Upload de imagem do perfil/banner
    imageUpload.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                if (currentImageType === 'profile') {
                    foto.src = event.target.result;
                    // Atualiza também a foto do header
                    document.getElementById('profile-pic').src = event.target.result;
                } else {
                    bannerfoto.src = event.target.result;
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    confirmImage.addEventListener('click', function() {
        // Aqui você pode adicionar lógica para salvar no servidor
        imageModal.style.display = 'none';
        alert('Imagem atualizada com sucesso!');
    });

    // Upload de imagem do produto
    productImageUpload.addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            if (e.target.files.length > 0) {
                productImageFile = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = event => {
                    productImageUpload.innerHTML = `<img src="${event.target.result}" alt="Pré-visualização do produto">`;
                    validateProductForm();
                };
                
                reader.readAsDataURL(productImageFile);
            }
        };
        
        input.click();
    });

    // Validação do formulário de produto
    productNameInput.addEventListener('input', validateProductForm);

    function validateProductForm() {
        confirmProduct.disabled = !(productNameInput.value.trim() && productImageFile);
    }

    // Adicionar novo produto
    confirmProduct.addEventListener('click', function() {
        const productId = Date.now().toString();
        const productName = productNameInput.value.trim();
        
        const reader = new FileReader();
        reader.onload = function(event) {
            const productHTML = `
                <div class="teste1" data-id="${productId}">
                    <div class="prod1"><img src="${event.target.result}" alt="${productName}" class="imgProd1"></div>
                    <p class="labelProd">${productName}</p>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
            
            // Resetar o formulário
            productNameInput.value = '';
            productImageUpload.innerHTML = '<p>Clique para adicionar imagem</p>';
            productImageFile = null;
            confirmProduct.disabled = true;
            productModal.style.display = 'none';
            
            // Adicionar evento de clique para edição
            const newProduct = produtosContainer.lastElementChild;
            newProduct.addEventListener('click', function() {
                const imgSrc = this.querySelector('.imgProd1').src;
                const name = this.querySelector('.labelProd').textContent;
                openEditModal(productId, name, imgSrc);
            });
        };
        
        reader.readAsDataURL(productImageFile);
    });

    // Abrir modal de edição
    function openEditModal(id, name, imageSrc) {
        currentProductId = id;
        document.getElementById('edit-product-name').value = name;
        document.getElementById('current-product-image').src = imageSrc;
        editImageFile = null; // Resetar a imagem de edição
        editModal.style.display = 'block';
    }

    // Editar imagem do produto
    document.getElementById('edit-image-upload').addEventListener('click', function() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = e => {
            if (e.target.files.length > 0) {
                editImageFile = e.target.files[0];
                const reader = new FileReader();
                
                reader.onload = event => {
                    document.getElementById('current-product-image').src = event.target.result;
                };
                
                reader.readAsDataURL(editImageFile);
            }
        };
        
        input.click();
    });

    // Salvar alterações do produto
    document.getElementById('save-changes').addEventListener('click', function() {
        const newName = document.getElementById('edit-product-name').value.trim();
        const productElement = document.querySelector(`.teste1[data-id="${currentProductId}"]`);
        
        if (productElement) {
            // Atualizar nome
            productElement.querySelector('.labelProd').textContent = newName;
            
            // Atualizar imagem se foi alterada
            if (editImageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    productElement.querySelector('.imgProd1').src = event.target.result;
                    productElement.querySelector('.imgProd1').alt = newName;
                };
                reader.readAsDataURL(editImageFile);
            }
            
            editModal.style.display = 'none';
            alert('Produto atualizado com sucesso!');
        }
    });

    // Deletar produto
    document.getElementById('delete-product').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            const productElement = document.querySelector(`.teste1[data-id="${currentProductId}"]`);
            if (productElement) {
                productElement.remove();
                editModal.style.display = 'none';
                alert('Produto deletado com sucesso!');
            }
        }
    });

    // Adicionar eventos de clique para os produtos existentes (se houver)
    document.querySelectorAll('.teste1').forEach(product => {
        if (!product.dataset.id) {
            // Adiciona ID para produtos existentes que não têm
            product.dataset.id = Date.now().toString();
        }
        
        product.addEventListener('click', function(e) {
            // Verifica se o clique foi na imagem ou no nome
            if (e.target.closest('.prod1') || e.target.classList.contains('labelProd')) {
                const id = product.dataset.id;
                const name = product.querySelector('.labelProd').textContent;
                const imgSrc = product.querySelector('.imgProd1').src;
                
                openEditModal(id, name, imgSrc);
            }
        });
    });

    // Carregar produtos existentes (simulação)
    function loadSampleProducts() {
        const sampleProducts = [
            { name: 'Labubu', image: 'images/labubu.webp' },
            { name: 'Kit 120 Caneta', image: 'images/kit120canetinha.webp' },
            { name: 'Bobbie Goods', image: 'images/bobbiegoods.jpeg' }
        ];
        
        sampleProducts.forEach(product => {
            const productId = Date.now().toString();
            const productHTML = `
                <div class="teste1" data-id="${productId}">
                    <div class="prod1"><img src="${product.image}" alt="${product.name}" class="imgProd1"></div>
                    <p class="labelProd">${product.name}</p>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
        });
    }
    
    // Chamar a função para carregar produtos de exemplo
    loadSampleProducts();
});
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
    const viewModal = document.getElementById('view-modal');
    const editModal = document.getElementById('edit-modal');
    const closeButtons = document.querySelectorAll('.close');
    
    // Elementos do formulário principal
    const formPrincipal = document.getElementById('principal');
    const profileImageInput = document.getElementById('profile-image-input');
    const bannerImageInput = document.getElementById('banner-image-input');
    const fornecedorNomeInput = document.getElementById('fornecedor-nome');
    
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
            viewModal.style.display = 'none';
            editModal.style.display = 'none';
        });
    });

    // Fechar modais quando clicar fora
    window.addEventListener('click', function(e) {
        if (e.target === imageModal) imageModal.style.display = 'none';
        if (e.target === productModal) productModal.style.display = 'none';
        if (e.target === viewModal) viewModal.style.display = 'none';
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
                    document.getElementById('profile-pic').src = event.target.result;
                    profileImageInput.value = event.target.result;
                } else {
                    bannerfoto.src = event.target.result;
                    bannerImageInput.value = event.target.result;
                }
            };
            
            reader.readAsDataURL(file);
        }
    });

    confirmImage.addEventListener('click', function() {
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
    function validateProductForm() {
        const nameValid = productNameInput.value.trim();
        const brandValid = document.getElementById('product-brand').value.trim();
        const categoryValid = document.getElementById('product-category').value;
        const formatValid = document.getElementById('product-format').value.trim();
        const weightValid = document.getElementById('product-weight').value;
        const priceValid = document.getElementById('product-price').value;
        const heightValid = document.getElementById('product-height').value;
        const widthValid = document.getElementById('product-width').value;
        const lengthValid = document.getElementById('product-length').value;
        
        confirmProduct.disabled = !(nameValid && brandValid && categoryValid && formatValid && 
                                  weightValid && priceValid && heightValid && 
                                  widthValid && lengthValid && productImageFile);
    }

    // Adicionar listeners para validação
    productNameInput.addEventListener('input', validateProductForm);
    document.getElementById('product-brand').addEventListener('input', validateProductForm);
    document.getElementById('product-category').addEventListener('change', validateProductForm);
    document.getElementById('product-format').addEventListener('input', validateProductForm);
    document.getElementById('product-weight').addEventListener('input', validateProductForm);
    document.getElementById('product-price').addEventListener('input', validateProductForm);
    document.getElementById('product-height').addEventListener('input', validateProductForm);
    document.getElementById('product-width').addEventListener('input', validateProductForm);
    document.getElementById('product-length').addEventListener('input', validateProductForm);

    // Adicionar novo produto
    confirmProduct.addEventListener('click', function() {
        const productId = Date.now().toString();
        const productData = {
            id: productId,
            nome: productNameInput.value.trim(),
            marca: document.getElementById('product-brand').value.trim(),
            categoria: document.getElementById('product-category').value,
            formato: document.getElementById('product-format').value.trim(),
            peso: parseFloat(document.getElementById('product-weight').value),
            preco: parseFloat(document.getElementById('product-price').value),
            altura: parseInt(document.getElementById('product-height').value),
            largura: parseInt(document.getElementById('product-width').value),
            comprimento: parseInt(document.getElementById('product-length').value),
            imagem: ''
        };
        
        const reader = new FileReader();
        reader.onload = function(event) {
            productData.imagem = event.target.result;
            
            // Criar elemento visual do produto
            const productHTML = `
                <div class="produto-card" data-id="${productId}">
                    <img src="${productData.imagem}" alt="${productData.nome}" class="produto-imagem">
                    <div class="produto-info">
                        <div class="produto-nome">${productData.nome}</div>
                        <div class="produto-marca">${productData.marca}</div>
                        <div class="produto-preco">R$ ${productData.preco.toFixed(2)}</div>
                    </div>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
            
            // Criar campo hidden
            const productInput = document.createElement('input');
            productInput.type = 'hidden';
            productInput.name = 'produtos[]';
            productInput.value = JSON.stringify(productData);
            productInput.dataset.productId = productId;
            produtosContainer.appendChild(productInput);
            
            // Resetar o formulário
            productModal.querySelectorAll('input:not([type=file]), select').forEach(el => el.value = '');
            productImageUpload.innerHTML = '<p>Clique para adicionar imagem</p>';
            productImageFile = null;
            confirmProduct.disabled = true;
            productModal.style.display = 'none';
            
            // Adicionar evento de clique para visualização
            const newProduct = produtosContainer.querySelector(`.produto-card[data-id="${productId}"]`);
            newProduct.addEventListener('click', function() {
                openViewModal(productId);
            });
        };
        
        reader.readAsDataURL(productImageFile);
    });

    // Abrir modal de visualização
    function openViewModal(productId) {
        const productInput = document.querySelector(`input[data-product-id="${productId}"]`);
        if (productInput) {
            const productData = JSON.parse(productInput.value);
            
            // Preencher a modal de visualização
            document.getElementById('view-product-name').textContent = productData.nome;
            document.getElementById('view-product-brand').textContent = productData.marca;
            document.getElementById('view-product-category').textContent = productData.categoria;
            document.getElementById('view-product-format').textContent = productData.formato;
            document.getElementById('view-product-weight').textContent = productData.peso;
            document.getElementById('view-product-price').textContent = productData.preco.toFixed(2);
            document.getElementById('view-product-dimensions').textContent = 
                `${productData.altura}cm (A) × ${productData.largura}cm (L) × ${productData.comprimento}cm (C)`;
            document.getElementById('view-product-image').src = productData.imagem;
            
            // Configurar botões
            document.getElementById('edit-product').onclick = function() {
                viewModal.style.display = 'none';
                openEditModal(productId);
            };
            
            document.getElementById('delete-product').onclick = function() {
                if (confirm('Tem certeza que deseja deletar este produto?')) {
                    const productElement = document.querySelector(`.produto-card[data-id="${productId}"]`);
                    if (productElement) {
                        productElement.remove();
                        productInput.remove();
                        viewModal.style.display = 'none';
                        alert('Produto deletado com sucesso!');
                    }
                }
            };
            
            viewModal.style.display = 'block';
        }
    }

    // Abrir modal de edição
    function openEditModal(productId) {
        const productInput = document.querySelector(`input[data-product-id="${productId}"]`);
        if (productInput) {
            const productData = JSON.parse(productInput.value);
            
            currentProductId = productId;
            document.getElementById('edit-product-name').value = productData.nome;
            document.getElementById('edit-product-brand').value = productData.marca;
            document.getElementById('edit-product-category').value = productData.categoria;
            document.getElementById('edit-product-format').value = productData.formato;
            document.getElementById('edit-product-weight').value = productData.peso;
            document.getElementById('edit-product-price').value = productData.preco;
            document.getElementById('edit-product-height').value = productData.altura;
            document.getElementById('edit-product-width').value = productData.largura;
            document.getElementById('edit-product-length').value = productData.comprimento;
            document.getElementById('current-product-image').src = productData.imagem;
            
            editModal.style.display = 'block';
        }
    }

    // Upload de imagem na edição
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
        const newBrand = document.getElementById('edit-product-brand').value.trim();
        const newCategory = document.getElementById('edit-product-category').value;
        const newFormat = document.getElementById('edit-product-format').value.trim();
        const newWeight = parseFloat(document.getElementById('edit-product-weight').value);
        const newPrice = parseFloat(document.getElementById('edit-product-price').value);
        const newHeight = parseInt(document.getElementById('edit-product-height').value);
        const newWidth = parseInt(document.getElementById('edit-product-width').value);
        const newLength = parseInt(document.getElementById('edit-product-length').value);
        
        const productElement = document.querySelector(`.produto-card[data-id="${currentProductId}"]`);
        const productInput = document.querySelector(`input[data-product-id="${currentProductId}"]`);
        
        if (productElement && productInput) {
            // Atualizar dados no campo hidden
            const productData = JSON.parse(productInput.value);
            productData.nome = newName;
            productData.marca = newBrand;
            productData.categoria = newCategory;
            productData.formato = newFormat;
            productData.peso = newWeight;
            productData.preco = newPrice;
            productData.altura = newHeight;
            productData.largura = newWidth;
            productData.comprimento = newLength;
            
            // Atualizar imagem se foi alterada
            if (editImageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    productData.imagem = event.target.result;
                    productElement.querySelector('.produto-imagem').src = event.target.result;
                    productInput.value = JSON.stringify(productData);
                    
                    // Atualizar visualização do produto
                    productElement.querySelector('.produto-nome').textContent = newName;
                    productElement.querySelector('.produto-marca').textContent = newBrand;
                    productElement.querySelector('.produto-preco').textContent = `R$ ${newPrice.toFixed(2)}`;
                    
                    editModal.style.display = 'none';
                    alert('Produto atualizado com sucesso!');
                };
                reader.readAsDataURL(editImageFile);
            } else {
                productInput.value = JSON.stringify(productData);
                
                // Atualizar visualização do produto
                productElement.querySelector('.produto-nome').textContent = newName;
                productElement.querySelector('.produto-marca').textContent = newBrand;
                productElement.querySelector('.produto-preco').textContent = `R$ ${newPrice.toFixed(2)}`;
                
                editModal.style.display = 'none';
                alert('Produto atualizado com sucesso!');
            }
        }
    });

    // Cancelar edição
    document.getElementById('cancel-edit').addEventListener('click', function() {
        editModal.style.display = 'none';
    });

    // Event listener para o envio do formulário
    formPrincipal.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Atualizar nome no dropdown
        const fornecedorNome = fornecedorNomeInput.value.trim();
        if (fornecedorNome) {
            document.querySelector('.dropdown-item:first-child').textContent = fornecedorNome;
        }
        
        console.log('Formulário pronto para ser enviado:', new FormData(formPrincipal));
        // formPrincipal.submit(); // Descomente esta linha quando o backend estiver pronto
    });

    // Carregar produtos existentes (simulação)
    function loadSampleProducts() {
        const sampleProducts = [
            { 
                nome: 'Labubu', 
                marca: 'Pop Mart', 
                categoria: 'Brinquedos', 
                formato: 'Action Figure', 
                peso: 0.3, 
                preco: 89.90, 
                altura: 15, 
                largura: 8, 
                comprimento: 6, 
                imagem: 'images/labubu.webp' 
            },
            { 
                nome: 'Kit 120 Caneta', 
                marca: 'Faber-Castell', 
                categoria: 'Material Escolar', 
                formato: 'Caixa', 
                peso: 1.2, 
                preco: 129.90, 
                altura: 25, 
                largura: 18, 
                comprimento: 5, 
                imagem: 'images/kit120canetinha.webp' 
            },
            { 
                nome: 'Bobbie Goods', 
                marca: 'Bobbie', 
                categoria: 'Alimentos', 
                formato: 'Pacote', 
                peso: 0.5, 
                preco: 12.50, 
                altura: 20, 
                largura: 15, 
                comprimento: 8, 
                imagem: 'images/bobbiegoods.jpeg' 
            }
        ];
        
        sampleProducts.forEach(product => {
            const productId = Date.now().toString();
            product.id = productId;
            
            // Criar elemento visual do produto
            const productHTML = `
                <div class="produto-card" data-id="${productId}">
                    <img src="${product.imagem}" alt="${product.nome}" class="produto-imagem">
                    <div class="produto-info">
                        <div class="produto-nome">${product.nome}</div>
                        <div class="produto-marca">${product.marca}</div>
                        <div class="produto-preco">R$ ${product.preco.toFixed(2)}</div>
                    </div>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
            
            // Criar campo hidden
            const productInput = document.createElement('input');
            productInput.type = 'hidden';
            productInput.name = 'produtos[]';
            productInput.value = JSON.stringify(product);
            productInput.dataset.productId = productId;
            produtosContainer.appendChild(productInput);
            
            // Adicionar evento de clique
            const newProduct = produtosContainer.querySelector(`.produto-card[data-id="${productId}"]`);
            newProduct.addEventListener('click', function() {
                openViewModal(productId);
            });
        });
    }
    
    // Chamar a função para carregar produtos de exemplo
    loadSampleProducts();
});
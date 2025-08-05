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
    
    // Elementos do formulário principal
    const formPrincipal = document.getElementById('principal');
    const profileImageInput = document.getElementById('profile-image-input');
    const bannerImageInput = document.getElementById('banner-image-input');
    
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
            // Criar elemento visual
            const productHTML = `
                <div class="teste1" data-id="${productId}">
                    <div class="prod1"><img src="${event.target.result}" alt="${productName}" class="imgProd1"></div>
                    <p class="labelProd">${productName}</p>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
            
            // Criar campo hidden com os dados do produto
            const productData = {
                id: productId,
                nome: productName,
                imagem: event.target.result
            };
            
            const productInput = document.createElement('input');
            productInput.type = 'hidden';
            productInput.name = 'produtos[]';
            productInput.value = JSON.stringify(productData);
            productInput.dataset.productId = productId;
            produtosContainer.appendChild(productInput);
            
            // Resetar o formulário
            productNameInput.value = '';
            productImageUpload.innerHTML = '<p>Clique para adicionar imagem</p>';
            productImageFile = null;
            confirmProduct.disabled = true;
            productModal.style.display = 'none';
            
            // Adicionar evento de clique para edição
            const newProduct = produtosContainer.querySelector(`.teste1[data-id="${productId}"]`);
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
        editImageFile = null;
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
        const productInput = document.querySelector(`input[data-product-id="${currentProductId}"]`);
        
        if (productElement && productInput) {
            // Atualizar nome visual
            productElement.querySelector('.labelProd').textContent = newName;
            
            // Atualizar dados no campo hidden
            const productData = JSON.parse(productInput.value);
            productData.nome = newName;
            
            // Atualizar imagem se foi alterada
            if (editImageFile) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    productElement.querySelector('.imgProd1').src = event.target.result;
                    productElement.querySelector('.imgProd1').alt = newName;
                    productData.imagem = event.target.result;
                    productInput.value = JSON.stringify(productData);
                };
                reader.readAsDataURL(editImageFile);
            } else {
                productInput.value = JSON.stringify(productData);
            }
            
            editModal.style.display = 'none';
            alert('Produto atualizado com sucesso!');
        }
    });

    // Deletar produto
    document.getElementById('delete-product').addEventListener('click', function() {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            const productElement = document.querySelector(`.teste1[data-id="${currentProductId}"]`);
            const productInput = document.querySelector(`input[data-product-id="${currentProductId}"]`);
            if (productElement && productInput) {
                productElement.remove();
                productInput.remove();
                editModal.style.display = 'none';
                alert('Produto deletado com sucesso!');
            }
        }
    });

    // Event listener para o envio do formulário
    formPrincipal.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('Formulário pronto para ser enviado:', new FormData(formPrincipal));
        // formPrincipal.submit(); // Descomente esta linha quando o backend estiver pronto
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
            
            // Criar elemento visual
            const productHTML = `
                <div class="teste1" data-id="${productId}">
                    <div class="prod1"><img src="${product.image}" alt="${product.name}" class="imgProd1"></div>
                    <p class="labelProd">${product.name}</p>
                </div>
            `;
            
            produtosContainer.insertAdjacentHTML('beforeend', productHTML);
            
            // Criar campo hidden
            const productData = {
                id: productId,
                nome: product.name,
                imagem: product.image
            };
            
            const productInput = document.createElement('input');
            productInput.type = 'hidden';
            productInput.name = 'produtos[]';
            productInput.value = JSON.stringify(productData);
            productInput.dataset.productId = productId;
            produtosContainer.appendChild(productInput);
            
            // Adicionar evento de clique
            const newProduct = produtosContainer.querySelector(`.teste1[data-id="${productId}"]`);
            newProduct.addEventListener('click', function() {
                const imgSrc = this.querySelector('.imgProd1').src;
                const name = this.querySelector('.labelProd').textContent;
                openEditModal(productId, name, imgSrc);
            });
        });
    }
    
    // Chamar a função para carregar produtos de exemplo
    loadSampleProducts();
});
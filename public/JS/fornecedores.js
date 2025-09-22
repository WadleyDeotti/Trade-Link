document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const formPerfil = document.getElementById('formPerfil');
    const passwordModal = document.getElementById('password-modal');
    const imageModal = document.getElementById('image-modal');
    const productModal = document.getElementById('product-modal');
    const productViewModal = document.getElementById('product-view-modal');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const closeModalButtons = document.querySelectorAll('.close');
    const toast = document.getElementById('toast');
    
    // Elementos do perfil
    const bannerImage = document.getElementById('banner-image');
    const avatarImage = document.getElementById('avatar-image');
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileDescription = document.getElementById('profile-description');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserPic = document.getElementById('header-user-pic');
    const productsCount = document.getElementById('products-count');
    
    // Botões
    const viewPasswordBtn = document.getElementById('view-password-btn');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    
    // Inputs do formulário
    const fornecedorNome = document.getElementById('fornecedor-nome');
    const fornecedorEmail = document.getElementById('fornecedor-email');
    const fornecedorCpf = document.getElementById('fornecedor-cpf');
    const fornecedorLocal = document.getElementById('fornecedor-local');
    const fornecedorSenha = document.getElementById('fornecedor-senha');
    const fornecedorTelefone = document.getElementById('fornecedor-telefone');
    const fornecedorDescricao = document.getElementById('fornecedor-descricao');
    
    // Variáveis de estado
    let currentImageType = '';
    let imageFile = null;
    let isPasswordRevealed = false;
    let products = [];
    let currentProductIndex = 0;
    let carouselInterval;
    let editingProductId = null;
    
    // Senha padrão
    const DEFAULT_PASSWORD = "adminTL";
    
    // Inicialização
    init();
    
    function init() {
        // Configurar senha padrão se não existir
        if (!localStorage.getItem('tradeLinkPassword')) {
            localStorage.setItem('tradeLinkPassword', DEFAULT_PASSWORD);
        }
        
        loadProfileData();
        loadProducts();
        setupEventListeners();
        setupCarousel();
        setupProductModal();
        
        // Adicionar botão de alterar senha se não existir
        if (!document.getElementById('change-password-btn')) {
            const passwordGroup = document.querySelector('.input-with-icon').parentNode;
            const changePasswordBtn = document.createElement('button');
            changePasswordBtn.type = 'button';
            changePasswordBtn.className = 'btn btn-secondary';
            changePasswordBtn.id = 'change-password-btn';
            changePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Alterar Senha';
            changePasswordBtn.style.marginTop = '10px';
            passwordGroup.appendChild(changePasswordBtn);
            
            // Adicionar event listener ao botão
            changePasswordBtn.addEventListener('click', showPasswordModal);
        }
    }
    
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // CORREÇÃO: Event listeners para as imagens (avatar e banner) - usando event delegation
        document.addEventListener('click', function(e) {
            // Verificar se o clique foi no avatar
            if (e.target === avatarImage || e.target.closest('.profile-avatar')) {
                console.log('Clicou na foto de perfil');
                currentImageType = 'avatar';
                showImageModal();
            }
            
            // Verificar se o clique foi no banner
            if (e.target === bannerImage || e.target.closest('.profile-banner')) {
                console.log('Clicou no banner');
                currentImageType = 'banner';
                showImageModal();
            }
        });
        
        // Botão de visualizar/ocultar senha
        viewPasswordBtn.addEventListener('click', togglePasswordVisibility);
        
        // Botão de alterar senha
        const changePasswordBtn = document.getElementById('change-password-btn');
        if (changePasswordBtn) {
            changePasswordBtn.addEventListener('click', showPasswordModal);
        }
        
        // Formulário de perfil
        formPerfil.addEventListener('submit', handleProfileSubmit);
        
        // Botão de cancelar
        cancelBtn.addEventListener('click', resetForm);
        
        // Fechar modais
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Fecha o modal ao clicar fora do conteúdo
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
            if (event.target === imageModal) {
                imageModal.style.display = 'none';
            }
            if (event.target === productModal) {
                productModal.style.display = 'none';
            }
            if (event.target === productViewModal) {
                productViewModal.style.display = 'none';
            }
            if (event.target === deleteConfirmModal) {
                deleteConfirmModal.style.display = 'none';
            }
        });
        
        // CORREÇÃO: Upload de imagem - usando event delegation
        document.addEventListener('change', function(e) {
            if (e.target && e.target.id === 'image-upload') {
                handleImageUpload(e);
            }
        });
        
        document.getElementById('save-image-btn').addEventListener('click', saveImage);
        document.getElementById('cancel-image-btn').addEventListener('click', function() {
            imageModal.style.display = 'none';
        });
        
        // Modal de alteração de senha
        document.getElementById('save-password-btn').addEventListener('click', changePassword);
        document.getElementById('cancel-password-btn').addEventListener('click', function() {
            passwordModal.style.display = 'none';
        });
        
        console.log('Event listeners configurados com sucesso!');
    }
    
    function setupCarousel() {
        const prevButton = document.querySelector('.carousel-button-prev');
        const nextButton = document.querySelector('.carousel-button-next');
        
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => moveCarousel(-1));
            nextButton.addEventListener('click', () => moveCarousel(1));
            
            // Iniciar autoplay
            startCarouselInterval();
        }
    }
    
    function moveCarousel(direction) {
        const track = document.querySelector('.carousel-track');
        if (!track || products.length === 0) return;
        
        currentProductIndex += direction;
        
        if (currentProductIndex < 0) {
            currentProductIndex = products.length - 1;
        } else if (currentProductIndex >= products.length) {
            currentProductIndex = 0;
        }
        
        updateCarousel();
    }
    
    function updateCarousel() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;
        
        const slideWidth = document.querySelector('.carousel-slide').offsetWidth + 15; // inclui gap
        track.style.transform = `translateX(-${currentProductIndex * slideWidth}px)`;
    }
    
    function startCarouselInterval() {
        // Limpar intervalo anterior se existir
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
        
        carouselInterval = setInterval(() => {
            if (products.length > 1) {
                moveCarousel(1);
            }
        }, 3000); // Muda a cada 3 segundos
    }
    
    function setupProductModal() {
        const addProductBtn = document.getElementById('add-product-btn');
        const cancelProductBtn = document.getElementById('cancel-product-btn');
        const saveProductBtn = document.getElementById('save-product-btn');
        const productImageInput = document.getElementById('product-image');
        
        if (addProductBtn) {
            addProductBtn.addEventListener('click', () => openProductModal());
        }
        
        if (cancelProductBtn) {
            cancelProductBtn.addEventListener('click', () => {
                productModal.style.display = 'none';
            });
        }
        
        if (saveProductBtn) {
            saveProductBtn.addEventListener('click', saveProduct);
        }
        
        if (productImageInput) {
            productImageInput.addEventListener('change', function(e) {
                if (e.target.files.length > 0) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        document.getElementById('product-preview-img').src = event.target.result;
                        document.getElementById('product-image-preview').style.display = 'block';
                    };
                    reader.readAsDataURL(e.target.files[0]);
                }
            });
        }
        
        // Botões do modal de visualização
        document.getElementById('close-product-btn').addEventListener('click', function() {
            productViewModal.style.display = 'none';
        });
        
        document.getElementById('edit-product-btn').addEventListener('click', function() {
            productViewModal.style.display = 'none';
            openProductModal(editingProductId);
        });
        
        document.getElementById('delete-product-btn').addEventListener('click', function() {
            productViewModal.style.display = 'none';
            openDeleteConfirmModal(editingProductId);
        });
        
        // Botões do modal de confirmação de exclusão
        document.getElementById('cancel-delete-btn').addEventListener('click', function() {
            deleteConfirmModal.style.display = 'none';
        });
        
        document.getElementById('confirm-delete-btn').addEventListener('click', function() {
            const productId = editingProductId;
            products = products.filter(p => p.id !== productId);
            saveProducts();
            renderProducts();
            deleteConfirmModal.style.display = 'none';
            showToast('Produto excluído com sucesso!');
        });
    }
    
    function openProductModal(productId = null) {
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('product-modal-title');
        const form = document.getElementById('formProduct');
        
        editingProductId = productId;
        
        if (productId) {
            title.textContent = 'Editar Produto';
            const product = products.find(p => p.id === productId);
            
            if (product) {
                document.getElementById('product-name').value = product.name;
                document.getElementById('product-description').value = product.description;
                document.getElementById('product-price').value = product.price;
                document.getElementById('product-category').value = product.category;
                
                if (product.image) {
                    document.getElementById('product-preview-img').src = product.image;
                    document.getElementById('product-image-preview').style.display = 'block';
                } else {
                    document.getElementById('product-image-preview').style.display = 'none';
                }
            }
        } else {
            title.textContent = 'Adicionar Produto';
            form.reset();
            document.getElementById('product-image-preview').style.display = 'none';
        }
        
        modal.style.display = 'flex';
    }
    
    function saveProduct() {
        const name = document.getElementById('product-name').value;
        const description = document.getElementById('product-description').value;
        const price = parseFloat(document.getElementById('product-price').value);
        const category = document.getElementById('product-category').value;
        const previewImg = document.getElementById('product-preview-img');
        
        if (!name || !description || !price || !category) {
            showToast('Preencha todos os campos obrigatórios.', 'error');
            return;
        }
        
        const product = {
            id: editingProductId || Date.now().toString(),
            name,
            description,
            price,
            category,
            image: previewImg.src !== '#' ? previewImg.src : ''
        };
        
        if (editingProductId) {
            // Editar produto existente
            const index = products.findIndex(p => p.id === editingProductId);
            if (index !== -1) {
                products[index] = product;
            }
        } else {
            // Adicionar novo produto
            products.push(product);
        }
        
        saveProducts();
        renderProducts();
        document.getElementById('product-modal').style.display = 'none';
        
        showToast(`Produto ${editingProductId ? 'editado' : 'adicionado'} com sucesso!`);
        editingProductId = null;
    }
    
    function renderProducts() {
        const track = document.querySelector('.carousel-track');
        if (!track) return;
        
        track.innerHTML = '';
        
        if (products.length === 0) {
            track.innerHTML = '<p style="text-align: center; width: 100%;">Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.</p>';
            productsCount.textContent = '0';
            return;
        }
        
        products.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'carousel-slide';
            productElement.innerHTML = `
                <img src="${product.image || 'https://via.placeholder.com/250x150?text=Sem+Imagem'}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="product-price">R$ ${product.price.toFixed(2)}</p>
                <span class="product-category">${product.category}</span>
            `;
            
            productElement.addEventListener('click', () => openProductView(product.id));
            track.appendChild(productElement);
        });
        
        productsCount.textContent = products.length;
        
        if (products.length > 0) {
            updateCarousel();
        }
    }
    
    function openProductView(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        const modal = document.getElementById('product-view-modal');
        const content = document.getElementById('product-view-content');
        const title = document.getElementById('product-view-title');
        
        editingProductId = productId;
        title.textContent = product.name;
        
        content.innerHTML = `
            <div style="text-align: center;">
                <img src="${product.image || 'https://via.placeholder.com/300x200?text=Sem+Imagem'}" alt="${product.name}">
                <p><strong>Descrição:</strong> ${product.description}</p>
                <p><strong>Preço:</strong> R$ ${product.price.toFixed(2)}</p>
                <p><strong>Categoria:</strong> ${product.category}</p>
            </div>
        `;
        
        modal.style.display = 'flex';
    }
    
    function openDeleteConfirmModal(productId) {
        editingProductId = productId;
        deleteConfirmModal.style.display = 'flex';
    }
    
    function loadProducts() {
        const savedProducts = localStorage.getItem('tradeLinkProducts');
        if (savedProducts) {
            products = JSON.parse(savedProducts);
            renderProducts();
        }
    }
    
    function saveProducts() {
        localStorage.setItem('tradeLinkProducts', JSON.stringify(products));
    }
    
    function togglePasswordVisibility() {
        if (isPasswordRevealed) {
            // Ocultar senha
            fornecedorSenha.type = 'password';
            fornecedorSenha.value = '••••••••';
            viewPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
            isPasswordRevealed = false;
        } else {
            // Verificar senha antes de revelar
            showVerifyPasswordModal();
        }
    }
    
    function showVerifyPasswordModal() {
        // Criar modal de verificação
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Verificar Senha</h2>
                    <span class="close">&times;</span>
                </div>
                <div class="modal-body">
                    <p>Para visualizar sua senha, digite sua senha atual:</p>
                    <div class="form-group">
                        <input type="password" id="verify-password-input" required>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" id="cancel-verify-btn">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="confirm-verify-btn">Verificar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Event listeners para o modal de verificação
        modal.querySelector('.close').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('#cancel-verify-btn').addEventListener('click', function() {
            modal.remove();
        });
        
        modal.querySelector('#confirm-verify-btn').addEventListener('click', function() {
            const passwordInput = modal.querySelector('#verify-password-input');
            const storedPassword = localStorage.getItem('tradeLinkPassword');
            
            if (passwordInput.value === storedPassword) {
                // Revelar senha
                fornecedorSenha.type = 'text';
                fornecedorSenha.value = storedPassword;
                viewPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
                isPasswordRevealed = true;
                modal.remove();
                showToast('Senha revelada', 'success');
            } else {
                showToast('Senha incorreta. Tente novamente.', 'error');
                passwordInput.value = '';
            }
        });
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    function showPasswordModal() {
        console.log('Abrindo modal de senha');
        // Limpar campos do modal
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        passwordModal.style.display = 'flex';
    }
    
    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('tradeLinkProfile')) || {};
        
        // Preencher dados do perfil se existirem
        if (profileData.nome) {
            fornecedorNome.value = profileData.nome;
            profileName.textContent = profileData.nome;
            headerUserName.textContent = profileData.nome;
        }
        
        if (profileData.email) {
            fornecedorEmail.value = profileData.email;
        }
        
        if (profileData.cpf_cnpj) {
            fornecedorCpf.value = profileData.cpf_cnpj;
        }
        
        if (profileData.localizacao) {
            fornecedorLocal.value = profileData.localizacao;
            profileLocation.textContent = profileData.localizacao;
        }
        
        if (profileData.senha) {
            // A senha é armazenada criptografada (em um caso real)
            fornecedorSenha.value = '••••••••';
        }
        
        if (profileData.telefone) {
            fornecedorTelefone.value = profileData.telefone;
        }
        
        if (profileData.descricao) {
            fornecedorDescricao.value = profileData.descricao;
            profileDescription.textContent = profileData.descricao;
        }
        
        if (profileData.avatar) {
            avatarImage.src = profileData.avatar;
            headerUserPic.src = profileData.avatar;
        } else {
            avatarImage.src = 'images/foto.jpg';
            headerUserPic.src = 'images/foto.jpg';
        }
        
        if (profileData.banner) {
            bannerImage.src = profileData.banner;
        } else {
            bannerImage.src = 'images/banner.jpg';
        }
    }
    
    function saveProfileData() {
        const profileData = {
            nome: fornecedorNome.value,
            email: fornecedorEmail.value,
            cpf_cnpj: fornecedorCpf.value,
            localizacao: fornecedorLocal.value,
            telefone: fornecedorTelefone.value,
            descricao: fornecedorDescricao.value,
            avatar: avatarImage.src,
            banner: bannerImage.src
        };
        
        localStorage.setItem('tradeLinkProfile', JSON.stringify(profileData));
        
        // Atualizar header
        headerUserName.textContent = fornecedorNome.value;
        headerUserPic.src = avatarImage.src;
        
        // Atualizar exibição do perfil
        profileName.textContent = fornecedorNome.value;
        profileLocation.textContent = fornecedorLocal.value;
        profileDescription.textContent = fornecedorDescricao.value;
    }
    
    function handleProfileSubmit(e) {
        e.preventDefault();
        
        // Mostrar spinner de carregamento
        document.getElementById('submit-text').style.display = 'none';
        document.getElementById('submit-spinner').style.display = 'inline-block';
        
        // Simular processamento
        setTimeout(() => {
            saveProfileData();
            
            // Esconder spinner
            document.getElementById('submit-text').style.display = 'inline-block';
            document.getElementById('submit-spinner').style.display = 'none';
            
            showToast('Perfil atualizado com sucesso!');
        }, 1000);
    }
    
    function resetForm() {
        loadProfileData();
        showToast('Alterações canceladas.');
    }
    
    function showImageModal() {
        console.log('Abrindo modal de imagem para:', currentImageType);
        document.getElementById('image-modal-title').textContent = 
            currentImageType === 'avatar' ? 'Alterar Foto de Perfil' : 'Alterar Banner';
        
        // Resetar o upload
        document.getElementById('image-upload').value = '';
        document.getElementById('image-preview-container').style.display = 'none';
        
        imageModal.style.display = 'flex';
    }
    
    // CORREÇÃO: Função handleImageUpload corrigida
    function handleImageUpload(e) {
        if (e.target.files.length > 0) {
            imageFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const previewContainer = document.getElementById('image-preview-container');
                const preview = document.getElementById('image-preview');
                
                preview.innerHTML = currentImageType === 'avatar' 
                    ? `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; border-radius: 50%;">`
                    : `<img src="${event.target.result}" alt="Preview" style="max-width: 100%;">`;
                
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(imageFile);
        }
    }
    
    // CORREÇÃO: Função saveImage corrigida
    function saveImage() {
        const imageUpload = document.getElementById('image-upload');
        
        // Verificar se um arquivo foi selecionado
        if (imageUpload.files.length === 0) {
            showToast('Selecione uma imagem primeiro.', 'error');
            return;
        }
        
        // Usar o arquivo do input diretamente
        const file = imageUpload.files[0];
        const reader = new FileReader();
        
        reader.onload = function(event) {
            if (currentImageType === 'avatar') {
                avatarImage.src = event.target.result;
                headerUserPic.src = event.target.result;
            } else {
                bannerImage.src = event.target.result;
            }
            
            // Salvar no perfil
            saveProfileData();
            
            imageModal.style.display = 'none';
            showToast('Imagem atualizada com sucesso!');
        };
        
        reader.readAsDataURL(file);
    }
    
    function changePassword() {
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const storedPassword = localStorage.getItem('tradeLinkPassword');
        
        // Verificar se a senha atual está correta
        if (currentPassword !== storedPassword) {
            showToast('Senha atual incorreta.', 'error');
            return;
        }
        
        // Verificar se as novas senhas coincidem
        if (newPassword !== confirmPassword) {
            showToast('As novas senhas não coincidem.', 'error');
            return;
        }
        
        // Verificar se a nova senha é diferente da atual
        if (newPassword === currentPassword) {
            showToast('A nova senha deve ser diferente da senha atual.', 'warning');
            return;
        }
        
        // Salvar a nova senha
        localStorage.setItem('tradeLinkPassword', newPassword);
        
        passwordModal.style.display = 'none';
        showToast('Senha alterada com sucesso!');
        
        // Limpar os campos
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }
    
    function closeAllModals() {
        passwordModal.style.display = 'none';
        imageModal.style.display = 'none';
        productModal.style.display = 'none';
        productViewModal.style.display = 'none';
        deleteConfirmModal.style.display = 'none';
        
        // Remover qualquer modal de verificação
        document.querySelectorAll('.modal').forEach(modal => {
            if (!modal.id) {
                modal.remove();
            }
        });
    }
    
    function showToast(message, type = 'success') {
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
        // Alterar ícone e cor baseado no tipo
        if (type === 'error') {
            toast.className = 'toast error';
            toastIcon.className = 'fas fa-exclamation-circle';
        } else if (type === 'warning') {
            toast.className = 'toast warning';
            toastIcon.className = 'fas fa-exclamation-triangle';
        } else if (type === 'info') {
            toast.className = 'toast info';
            toastIcon.className = 'fas fa-info-circle';
        } else {
            toast.className = 'toast';
            toastIcon.className = 'fas fa-check-circle';
        }
        
        toast.classList.add('show');
        
        // Esconder após 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
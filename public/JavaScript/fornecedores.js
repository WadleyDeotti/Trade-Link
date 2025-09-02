document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const formPerfil = document.getElementById('formPerfil');
    const passwordModal = document.getElementById('password-modal');
    const imageModal = document.getElementById('image-modal');
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
        setupEventListeners();
        
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
        
        // Event listeners para as imagens (avatar e banner)
        avatarImage.addEventListener('click', function() {
            console.log('Clicou na foto de perfil');
            currentImageType = 'avatar';
            showImageModal();
        });
        
        bannerImage.addEventListener('click', function() {
            console.log('Clicou no banner');
            currentImageType = 'banner';
            showImageModal();
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
        });
        
        // Upload de imagem
        document.getElementById('image-upload').addEventListener('change', handleImageUpload);
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
        }
        
        if (profileData.banner) {
            bannerImage.src = profileData.banner;
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
    
    function saveImage() {
        if (!imageFile) {
            showToast('Selecione uma imagem primeiro.', 'error');
            return;
        }
        
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
        
        reader.readAsDataURL(imageFile);
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
        
        // Remover qualquer modal de verificação
        document.querySelectorAll('.modal').forEach(modal => {
            if (modal.id !== 'password-modal' && modal.id !== 'image-modal') {
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
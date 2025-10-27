document.addEventListener('DOMContentLoaded', function() {
    const formPerfil = document.getElementById('formPerfil');
    const formSenha = document.getElementById('formSenha');
    const formAvatar = document.getElementById('formAvatar');
    const formBanner = document.getElementById('formBanner');
    
    const passwordModal = document.getElementById('password-modal');
    const avatarModal = document.getElementById('avatar-modal');
    const bannerModal = document.getElementById('banner-modal');
    
    const closeModalButtons = document.querySelectorAll('.close');
    const toast = document.getElementById('toast');
    
    const bannerImage = document.getElementById('banner-image');
    const avatarImage = document.getElementById('avatar-image');
    const profileName = document.getElementById('profile-name');
    const profileLocation = document.getElementById('profile-location');
    const profileDescription = document.getElementById('profile-description');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserPic = document.getElementById('header-user-pic');
    
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    
    const fornecedorNome = document.getElementById('fornecedor-nome');
    const fornecedorEmail = document.getElementById('fornecedor-email');
    const fornecedorCpf = document.getElementById('fornecedor-cpf');
    const fornecedorLocal = document.getElementById('fornecedor-local');
    const fornecedorTelefone = document.getElementById('fornecedor-telefone');
    const fornecedorDescricao = document.getElementById('fornecedor-descricao');
    
    let avatarFile = null;
    let bannerFile = null;
    
    const DEFAULT_PASSWORD = "adminTL";
    
    init();
    
    function init() {
        // Função de inicialização pra setar senha padrão se senha salva = null/undefined
        if (!localStorage.getItem('tradeLinkPassword')) {
            localStorage.setItem('tradeLinkPassword', DEFAULT_PASSWORD);
        }
        
        loadProfileData();
        setupEventListeners();
    }
    
    function setupEventListeners() {
        console.log('Configurando event listeners...');
        
        avatarImage.addEventListener('click', function() {
            console.log('Clicou na foto de perfil');
            showAvatarModal();
        });
        
        bannerImage.addEventListener('click', function() {
            console.log('Clicou no banner');
            showBannerModal();
        });
        
        changePasswordBtn.addEventListener('click', showPasswordModal);
        
        formPerfil.addEventListener('submit', handleProfileSubmit);
        formSenha.addEventListener('submit', handlePasswordSubmit);
        formAvatar.addEventListener('submit', handleAvatarSubmit);
        formBanner.addEventListener('submit', handleBannerSubmit);
        
        cancelBtn.addEventListener('click', resetForm);
        
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
            if (event.target === avatarModal) {
                avatarModal.style.display = 'none';
            }
            if (event.target === bannerModal) {
                bannerModal.style.display = 'none';
            }
        });
        
        document.getElementById('avatar-upload').addEventListener('change', handleAvatarUpload);
        document.getElementById('save-avatar-btn').addEventListener('click', function() {
            formAvatar.dispatchEvent(new Event('submit'));
        });
        document.getElementById('cancel-avatar-btn').addEventListener('click', function() {
            avatarModal.style.display = 'none';
        });
        
        document.getElementById('banner-upload').addEventListener('change', handleBannerUpload);
        document.getElementById('save-banner-btn').addEventListener('click', function() {
            formBanner.dispatchEvent(new Event('submit'));
        });
        document.getElementById('cancel-banner-btn').addEventListener('click', function() {
            bannerModal.style.display = 'none';
        });
        
        document.getElementById('save-password-btn').addEventListener('click', function() {
            formSenha.dispatchEvent(new Event('submit'));
        });
        document.getElementById('cancel-password-btn').addEventListener('click', function() {
            passwordModal.style.display = 'none';
        });
        
        console.log('Event listeners configurados com sucesso!');
    }
    
    function showPasswordModal() {
        console.log('Abrindo modal de senha');
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        passwordModal.style.display = 'flex';
    }
    
    function showAvatarModal() {
        console.log('Abrindo modal de avatar');
        document.getElementById('avatar-upload').value = '';
        document.getElementById('avatar-preview-container').style.display = 'none';
        avatarFile = null;
        
        avatarModal.style.display = 'flex';
    }
    
    function showBannerModal() {
        console.log('Abrindo modal de banner');
        document.getElementById('banner-upload').value = '';
        document.getElementById('banner-preview-container').style.display = 'none';
        bannerFile = null;
        
        bannerModal.style.display = 'flex';
    }
    
    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('tradeLinkProfile')) || {};
        
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
        
        headerUserName.textContent = fornecedorNome.value;
        headerUserPic.src = avatarImage.src;
        
        profileName.textContent = fornecedorNome.value;
        profileLocation.textContent = fornecedorLocal.value;
        profileDescription.textContent = fornecedorDescricao.value;
    }
    
    function handleProfileSubmit(e) {
        e.preventDefault();
        console.log('Enviando formulário de perfil...');
        
        document.getElementById('submit-text').style.display = 'none';
        document.getElementById('submit-spinner').style.display = 'inline-block';
        
        // Simular Processamento
        setTimeout(() => {
            saveProfileData();
            
            document.getElementById('submit-text').style.display = 'inline-block';
            document.getElementById('submit-spinner').style.display = 'none';
            
            showToast('Perfil atualizado com sucesso!');
        }, 1000);
    }
    
    function handlePasswordSubmit(e) {
        e.preventDefault();
        console.log('Enviando formulário de senha...');
        
        const formData = new FormData(formSenha);
        const currentPassword = formData.get('senha_atual');
        const newPassword = formData.get('nova_senha');
        const confirmPassword = formData.get('confirmar_senha');
        const storedPassword = localStorage.getItem('tradeLinkPassword');
        
        // Validações
        // Não tirar os 3 sinais
        if (currentPassword !== storedPassword) {
            showToast('Senha atual incorreta.', 'error');
            return;
        }
        
        if (newPassword !== confirmPassword) {
            showToast('As novas senhas não coincidem.', 'error');
            return;
        }
        
        if (newPassword === currentPassword) {
            showToast('A nova senha deve ser diferente da senha atual.', 'warning');
            return;
        }
        
        localStorage.setItem('tradeLinkPassword', newPassword);
        
        passwordModal.style.display = 'none';
        showToast('Senha alterada com sucesso!');
        
        formSenha.reset();
    }
    
    function handleAvatarSubmit(e) {
        e.preventDefault();
        console.log('Enviando formulário de avatar...');
        
        if (!avatarFile) {
            showToast('Selecione uma imagem primeiro.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            avatarImage.src = event.target.result;
            headerUserPic.src = event.target.result;
            
            saveProfileData();
            
            avatarModal.style.display = 'none';
            showToast('Foto de perfil atualizada com sucesso!');
        };
        
        reader.readAsDataURL(avatarFile);
    }
    
    function handleBannerSubmit(e) {
        e.preventDefault();
        console.log('Enviando formulário de banner...');
        
        if (!bannerFile) {
            showToast('Selecione uma imagem primeiro.', 'error');
            return;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(event) {
            bannerImage.src = event.target.result;
            
            saveProfileData();
            
            bannerModal.style.display = 'none';
            showToast('Banner atualizado com sucesso!');
        };
        
        reader.readAsDataURL(bannerFile);
    }
    
    function handleAvatarUpload(e) {
        if (e.target.files.length > 0) {
            avatarFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const previewContainer = document.getElementById('avatar-preview-container');
                const preview = document.getElementById('avatar-preview');
                
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%; border-radius: 50%;">`;
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(avatarFile);
        }
    }
    
    function handleBannerUpload(e) {
        if (e.target.files.length > 0) {
            bannerFile = e.target.files[0];
            const reader = new FileReader();
            
            reader.onload = function(event) {
                const previewContainer = document.getElementById('banner-preview-container');
                const preview = document.getElementById('banner-preview');
                
                preview.innerHTML = `<img src="${event.target.result}" alt="Preview" style="max-width: 100%;">`;
                previewContainer.style.display = 'block';
            };
            
            reader.readAsDataURL(bannerFile);
        }
    }
    
    function resetForm() {
        loadProfileData();
        showToast('Alterações canceladas.');
    }
    
    function closeAllModals() {
        passwordModal.style.display = 'none';
        avatarModal.style.display = 'none';
        bannerModal.style.display = 'none';
    }
    
    function showToast(message, type = 'success') {
        const toastMessage = document.getElementById('toast-message');
        const toastIcon = toast.querySelector('i');
        
        toastMessage.textContent = message;
        
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
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
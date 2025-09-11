document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const form = document.getElementById('settings-form');
    const passwordModal = document.getElementById('password-modal');
    const toast = document.getElementById('toast');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    const changePasswordBtn = document.getElementById('change-password-btn');
    
    // Elementos de informações da conta
    const accountName = document.getElementById('account-name');
    const accountEmail = document.getElementById('account-email');
    const accountCpf = document.getElementById('account-cpf');
    const accountLocation = document.getElementById('account-location');
    const accountPhone = document.getElementById('account-phone');
    const headerUserName = document.getElementById('header-user-name');
    const headerUserPic = document.getElementById('header-user-pic');
    
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
        loadSettingsData();
    }
    
    function setupEventListeners() {
        // Navegação entre seções
        settingsNavBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetId = this.getAttribute('data-target');
                activateSection(targetId);
            });
        });
        
        // Formulário de configurações
        form.addEventListener('submit', handleSettingsSubmit);
        
        // Botão de cancelar
        cancelBtn.addEventListener('click', resetForm);
        
        // Botão de alterar senha
        changePasswordBtn.addEventListener('click', showPasswordModal);
        
        // Fechar modais
        document.querySelectorAll('.close').forEach(btn => {
            btn.addEventListener('click', closeAllModals);
        });
        
        // Fecha o modal ao clicar fora do conteúdo
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) {
                passwordModal.style.display = 'none';
            }
        });
        
        // Modal de alteração de senha
        document.getElementById('save-password-btn').addEventListener('click', changePassword);
        document.getElementById('cancel-password-btn').addEventListener('click', () => {
            passwordModal.style.display = 'none';
        });
    }
    
    function activateSection(targetId) {
        settingsNavBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-target') === targetId) {
                btn.classList.add('active');
            }
        });
        
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    }
    
    function loadProfileData() {
        const profileData = JSON.parse(localStorage.getItem('tradeLinkProfile')) || {};
        
        // Preencher informações da conta
        if (profileData.nome) {
            accountName.textContent = profileData.nome;
            headerUserName.textContent = profileData.nome;
        } else {
            accountName.textContent = "Não definido";
        }
        
        if (profileData.email) {
            accountEmail.textContent = profileData.email;
        } else {
            accountEmail.textContent = "Não definido";
        }
        
        if (profileData.cpf_cnpj) {
            accountCpf.textContent = profileData.cpf_cnpj;
        } else {
            accountCpf.textContent = "Não definido";
        }
        
        if (profileData.localizacao) {
            accountLocation.textContent = profileData.localizacao;
        } else {
            accountLocation.textContent = "Não definido";
        }
        
        if (profileData.telefone) {
            accountPhone.textContent = profileData.telefone;
        } else {
            accountPhone.textContent = "Não definido";
        }
        
        if (profileData.avatar) {
            headerUserPic.src = profileData.avatar;
        }
    }
    
    function loadSettingsData() {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Radio buttons e checkboxes
            const setChecked = (name, value) => {
                const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
                if (element) element.checked = true;
            };
            
            const setCheckbox = (name, checked) => {
                const element = document.querySelector(`input[name="${name}"]`);
                if (element) element.checked = checked;
            };
            
            setChecked('visibility', data.visibility || 'public');
            setCheckbox('data_sharing', data.data_sharing || false);
            setCheckbox('show_activity', data.show_activity || false);
            setCheckbox('search_visibility', data.search_visibility || false);
            setCheckbox('notify_messages', data.notify_messages || false);
            setCheckbox('notify_mentions', data.notify_mentions || false);
            setCheckbox('notify_updates', data.notify_updates || false);
            setCheckbox('notify_comments', data.notify_comments || false);
            setCheckbox('important_only', data.important_only || false);
            setCheckbox('email_notifications', data.email_notifications || false);
            setCheckbox('push_notifications', data.push_notifications || false);
            setChecked('datetime_format', data.datetime_format || '24h');
            
            // Selects
            if (data.language) {
                document.getElementById('language-select').value = data.language;
            }
            if (data.timezone) {
                document.getElementById('timezone-select').value = data.timezone;
            }
        }
    }
    
    function saveSettingsData() {
        const settingsData = {
            visibility: document.querySelector('input[name="visibility"]:checked').value,
            data_sharing: document.querySelector('input[name="data_sharing"]').checked,
            show_activity: document.querySelector('input[name="show_activity"]').checked,
            search_visibility: document.querySelector('input[name="search_visibility"]').checked,
            notify_messages: document.querySelector('input[name="notify_messages"]').checked,
            notify_mentions: document.querySelector('input[name="notify_mentions"]').checked,
            notify_updates: document.querySelector('input[name="notify_updates"]').checked,
            notify_comments: document.querySelector('input[name="notify_comments"]').checked,
            important_only: document.querySelector('input[name="important_only"]').checked,
            email_notifications: document.querySelector('input[name="email_notifications"]').checked,
            push_notifications: document.querySelector('input[name="push_notifications"]').checked,
            language: document.getElementById('language-select').value,
            timezone: document.getElementById('timezone-select').value,
            datetime_format: document.querySelector('input[name="datetime_format"]:checked').value
        };
        
        localStorage.setItem('userSettings', JSON.stringify(settingsData));
    }
    
    function handleSettingsSubmit(e) {
        e.preventDefault();
        
        // Mostrar spinner de carregamento
        const submitText = saveBtn.querySelector('span:first-child');
        const submitSpinner = saveBtn.querySelector('.spinner');
        
        submitText.style.display = 'none';
        submitSpinner.style.display = 'inline-block';
        
        // Simular processamento
        setTimeout(() => {
            saveSettingsData();
            
            // Esconder spinner
            submitText.style.display = 'inline-block';
            submitSpinner.style.display = 'none';
            
            showToast('Configurações salvas com sucesso!');
        }, 1000);
    }
    
    function resetForm() {
        loadSettingsData();
        showToast('Alterações canceladas.', 'warning');
    }
    
    function showPasswordModal() {
        // Limpar campos do modal
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        passwordModal.style.display = 'flex';
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
    }
    
    function closeAllModals() {
        passwordModal.style.display = 'none';
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
    
    // Ensure all DOM selectors, event listeners, and function calls are correctly referencing elements in the HTML file.
    // Example:
    document.getElementById("change-password-btn").addEventListener("click", () => {
        // Logic for handling password change
    });
});
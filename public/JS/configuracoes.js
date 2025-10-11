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
    
    
    function showPasswordModal() {
        // Limpar campos do modal
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        passwordModal.style.display = 'flex';
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
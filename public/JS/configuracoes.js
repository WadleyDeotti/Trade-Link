document.addEventListener('DOMContentLoaded', function() {
    // -------------------------
    // Seletores da interface
    // -------------------------
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const form = document.getElementById('settings-form');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    const saveBtn = document.getElementById('save-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Modal de senha
    const passwordModal = document.getElementById('password-modal');
    const changePasswordBtn = document.getElementById('change-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    const closeModalBtns = document.querySelectorAll('.close');

    // -------------------------
    // Inicialização
    // -------------------------
    setupEventListeners();
    activateSection('conta'); // seção inicial

    // -------------------------
    // Funções
    // -------------------------

    // Configura eventos
    function setupEventListeners() {
        // Navegação entre seções
        settingsNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                activateSection(targetId);
            });
        });

        // Formulário de configurações
        if (form) form.addEventListener('submit', handleSettingsSubmit);

        // Botão cancelar do formulário
        if (cancelBtn) cancelBtn.addEventListener('click', resetForm);

        // Modal de senha
        if (changePasswordBtn) changePasswordBtn.addEventListener('click', showPasswordModal);
        if (savePasswordBtn) savePasswordBtn.addEventListener('click', changePassword);
        if (cancelPasswordBtn) cancelPasswordBtn.addEventListener('click', closePasswordModal);
        closeModalBtns.forEach(btn => btn.addEventListener('click', closePasswordModal));

        // Fecha modal ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === passwordModal) closePasswordModal();
        });
    }

    // Alterna seções
    function activateSection(targetId) {
        settingsNavBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-target') === targetId);
        });
        contentSections.forEach(section => {
            section.classList.toggle('active', section.id === targetId);
        });
    }

    // Exibir modal de senha
    function showPasswordModal() {
        passwordModal.style.display = 'flex';
        // Limpa campos
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
    }

    // Fechar modal de senha
    function closePasswordModal() {
        passwordModal.style.display = 'none';
    }

    // Alterar senha (simples)
    function changePassword() {
        const current = document.getElementById('current-password').value;
        const newPass = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (!current || !newPass || !confirm) {
            showToast('Preencha todos os campos', 'error');
            return;
        }
        if (newPass !== confirm) {
            showToast('As senhas não coincidem', 'error');
            return;
        }

        // Aqui você adicionaria lógica real de alteração de senha (ex: API)
        showToast('Senha alterada com sucesso!', 'success');
        closePasswordModal();
    }

    // Exibir toast
    function showToast(message, type = 'success') {
        const toastIcon = toast.querySelector('i');
        toastMessage.textContent = message;

        toast.className = `toast ${type}`;
        switch(type) {
            case 'error':
                toastIcon.className = 'fas fa-exclamation-circle';
                break;
            case 'warning':
                toastIcon.className = 'fas fa-exclamation-triangle';
                break;
            case 'info':
                toastIcon.className = 'fas fa-info-circle';
                break;
            default:
                toastIcon.className = 'fas fa-check-circle';
        }

        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    // Submissão do formulário de configurações
    function handleSettingsSubmit(e) {
        e.preventDefault();

        // Aqui você pode enviar via fetch/ajax para salvar
        showToast('Configurações salvas com sucesso!', 'success');
    }

    // Reset do formulário (simples)
    function resetForm() {
        if (!form) return;
        form.reset();
        showToast('Formulário resetado', 'info');
    }
});

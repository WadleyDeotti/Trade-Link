document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const settingsNavBtns = document.querySelectorAll('.settings-nav-btn');
    const contentSections = document.querySelectorAll('.content-section');
    const form = document.getElementById('settings-form');
    const toast = document.getElementById('toast');
    const cancelBtn = document.getElementById('cancel-btn');
    const saveBtn = document.getElementById('save-btn');
    
    // Inicialização
    init();

    function init() {
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
    }

    // Alterna entre seções da página
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

    

    // Salva as configurações no localStorage
    

    // Ao clicar em “Salvar”
    

    // Ao clicar em “Cancelar”
    

    // Exibe o toast (notificação)
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

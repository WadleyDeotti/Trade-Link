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

    // Carrega configurações salvas localmente
    function loadSettingsData() {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            const data = JSON.parse(savedData);

            // Funções auxiliares
            const setChecked = (name, value) => {
                const element = document.querySelector(`input[name="${name}"][value="${value}"]`);
                if (element) element.checked = true;
            };

            const setCheckbox = (name, checked) => {
                const element = document.querySelector(`input[name="${name}"]`);
                if (element) element.checked = checked;
            };

            // Aplica os valores salvos
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

    // Salva as configurações no localStorage
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

    // Ao clicar em “Salvar”
    function handleSettingsSubmit(e) {
        e.preventDefault();

        // Mostrar spinner de carregamento
        const submitText = saveBtn.querySelector('span:first-child');
        const submitSpinner = saveBtn.querySelector('.spinner');

        submitText.style.display = 'none';
        submitSpinner.style.display = 'inline-block';

        // Simular um pequeno delay (como se estivesse salvando)
        setTimeout(() => {
            saveSettingsData();

            // Restaurar o botão
            submitText.style.display = 'inline-block';
            submitSpinner.style.display = 'none';

            showToast('Configurações salvas com sucesso!');
        }, 1000);
    }

    // Ao clicar em “Cancelar”
    function resetForm() {
        loadSettingsData();
        showToast('Alterações canceladas.', 'warning');
    }

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

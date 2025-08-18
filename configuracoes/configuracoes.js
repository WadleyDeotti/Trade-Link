document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const sidebarItems = document.querySelectorAll('.sidebar-item');
    const contentSections = document.querySelectorAll('.content-section');
    const form = document.getElementById('settings-form');
    const profilePic = document.getElementById('profile-pic');
    const profileUpload = document.getElementById('profile-upload');
    const changePicBtn = document.getElementById('change-pic-btn');
    const previewContainer = document.getElementById('preview-container');
    const statusMessage = document.getElementById('status-message');
    const loadingOverlay = document.getElementById('loading-overlay');
    const cancelBtn = document.querySelector('.cancel-btn');
    const saveBtn = document.querySelector('.save-btn');

    // Navegação entre seções
    function activateSection(targetId) {
        sidebarItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            }
        });

        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetId) {
                section.classList.add('active');
            }
        });
    }

    sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            activateSection(targetId);
            
            // Salva a seção ativa no localStorage
            localStorage.setItem('activeSettingsSection', targetId);
        });
    });

    // Upload de foto de perfil
    function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Validação do tipo de arquivo
        if (!file.type.match('image.*')) {
            showStatus('Por favor, selecione uma imagem válida (JPEG, PNG, etc.)', 'error');
            return;
        }

        // Validação do tamanho do arquivo (máximo 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showStatus('A imagem deve ter menos de 5MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            profilePic.src = e.target.result;
            showPreview(file);
            showStatus('Imagem carregada com sucesso!', 'success');
        };
        reader.onerror = function() {
            showStatus('Erro ao ler o arquivo', 'error');
        };
        reader.readAsDataURL(file);
    }

    function showPreview(file) {
        previewContainer.innerHTML = `
            <div class="preview-item">
                <span>${file.name} (${formatFileSize(file.size)})</span>
                <button type="button" class="remove-preview-btn" title="Remover imagem">×</button>
            </div>
        `;
        previewContainer.style.display = 'block';

        const removeBtn = previewContainer.querySelector('.remove-preview-btn');
        removeBtn.addEventListener('click', function() {
            profilePic.src = 'images/default-profile.jpg';
            profileUpload.value = '';
            previewContainer.style.display = 'none';
            showStatus('Imagem removida', 'warning');
        });
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    profileUpload.addEventListener('change', handleImageUpload);
    changePicBtn.addEventListener('click', function() {
        profileUpload.click();
    });

    // Validação de formulário
    function validateForm() {
        let isValid = true;
        const username = document.getElementById('username');
        const email = document.getElementById('email');
        const usernameError = document.getElementById('username-error');
        const emailError = document.getElementById('email-error');

        // Reset errors
        usernameError.style.display = 'none';
        emailError.style.display = 'none';

        // Validação do nome de usuário
        if (!username.value.trim()) {
            usernameError.textContent = 'Nome de usuário é obrigatório';
            usernameError.style.display = 'block';
            isValid = false;
        } else if (username.value.trim().length < 3) {
            usernameError.textContent = 'Nome de usuário deve ter pelo menos 3 caracteres';
            usernameError.style.display = 'block';
            isValid = false;
        } else if (!/^[a-zA-Z0-9_]+$/.test(username.value.trim())) {
            usernameError.textContent = 'Use apenas letras, números e underline';
            usernameError.style.display = 'block';
            isValid = false;
        }

        // Validação de email
        if (!email.value.trim()) {
            emailError.textContent = 'Email é obrigatório';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
            emailError.textContent = 'Por favor, insira um email válido';
            emailError.style.display = 'block';
            isValid = false;
        }

        return isValid;
    }

    // Envio do formulário
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        showLoading(true);
        
        try {
            // Simulação de envio para o backend
            // Substitua por uma chamada real à sua API
            const response = await mockApiCall();
            
            if (response.success) {
                showStatus('Configurações salvas com sucesso!', 'success');
                saveToLocalStorage();
            } else {
                showStatus('Erro ao salvar configurações: ' + response.message, 'error');
            }
        } catch (error) {
            showStatus('Erro na conexão com o servidor', 'error');
            console.error('Error:', error);
        } finally {
            showLoading(false);
        }
    });

    // Função de simulação de API (substitua pela sua implementação real)
    function mockApiCall() {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulando 80% de chance de sucesso
                const isSuccess = Math.random() < 0.8;
                resolve({
                    success: isSuccess,
                    message: isSuccess ? 'Dados atualizados' : 'Erro simulado no servidor'
                });
            }, 1500);
        });
    }

    // Botão cancelar
    cancelBtn.addEventListener('click', function() {
        if (confirm('Tem certeza que deseja descartar todas as alterações não salvas?')) {
            loadFromLocalStorage();
            profilePic.src = 'images/default-profile.jpg';
            profileUpload.value = '';
            previewContainer.style.display = 'none';
            showStatus('Alterações descartadas.', 'warning');
        }
    });

    // Funções auxiliares
    function showStatus(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = 'status-message ' + type;
        
        // Rolagem suave para a mensagem
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = 'status-message';
        }, 5000);
    }

    function showLoading(show) {
        if (show) {
            loadingOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            loadingOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    }

    function saveToLocalStorage() {
        const formData = {
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            bio: document.getElementById('bio').value,
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
            datetime_format: document.querySelector('input[name="datetime_format"]:checked').value,
            profilePic: profilePic.src
        };
        
        localStorage.setItem('userSettings', JSON.stringify(formData));
    }

    function loadFromLocalStorage() {
        const savedData = localStorage.getItem('userSettings');
        if (savedData) {
            const data = JSON.parse(savedData);
            
            // Preenche os campos do formulário
            document.getElementById('username').value = data.username || '';
            document.getElementById('email').value = data.email || '';
            document.getElementById('bio').value = data.bio || '';
            
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
            
            // Foto de perfil
            if (data.profilePic && data.profilePic !== 'images/default-profile.jpg') {
                profilePic.src = data.profilePic;
                previewContainer.innerHTML = '<div class="preview-item">Foto carregada</div>';
                previewContainer.style.display = 'block';
            }
        }
    }

    // Inicialização
    function init() {
        // Carrega dados salvos
        loadFromLocalStorage();
        
        // Ativa a seção salva ou a padrão
        const savedSection = localStorage.getItem('activeSettingsSection') || 'conta';
        activateSection(savedSection);
        
        // Evento para salvar automaticamente quando o usuário muda os campos
        form.addEventListener('change', function() {
            saveBtn.textContent = 'Salvar Alterações *';
            saveBtn.classList.add('unsaved');
        });
        
        // Evento para salvar no localStorage periodicamente (autosave)
        setInterval(() => {
            if (document.querySelector('.unsaved')) {
                saveToLocalStorage();
                saveBtn.textContent = 'Salvar Alterações';
                saveBtn.classList.remove('unsaved');
            }
        }, 30000); // A cada 30 segundos
    }

    init();
});
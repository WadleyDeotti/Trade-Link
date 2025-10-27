// editor-contratos.js - Editor Avançado de Contratos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    let quill;
    const backBtn = document.getElementById('back-btn');
    const clearBtn = document.getElementById('clear-btn');
    const uploadBtn = document.getElementById('upload-btn');
    const saveBtn = document.getElementById('save-btn');
    const downloadBtn = document.getElementById('download-btn');
    const templateBtns = document.querySelectorAll('.template-btn');
    const addAttachmentBtn = document.getElementById('add-attachment');
    
    // Modais
    const clearConfirmModal = document.getElementById('clear-confirm-modal');
    const toast = document.getElementById('toast');
    
    // Estado do documento
    let currentDocument = {
        id: null,
        title: 'Novo Contrato',
        content: '',
        attachments: [],
        versions: [],
        lastSaved: null,
        isDraft: true
    };

    // Templates pré-definidos
    const templates = {
        comercial: `
            <h1>CONTRATO COMERCIAL</h1>
            
            <p><strong>Entre as partes:</strong></p>
            
            <p><strong>CONTRATANTE:</strong> [NOME DA EMPRESA CONTRATANTE], 
            com sede em [ENDEREÇO COMPLETO], inscrita no CNPJ sob o nº [CNPJ], 
            neste ato representada por [NOME DO REPRESENTANTE], [CARGO], 
            doravante denominada simplesmente CONTRATANTE;</p>
            
            <p><strong>CONTRATADA:</strong> [NOME DA EMPRESA CONTRATADA], 
            com sede em [ENDEREÇO COMPLETO], inscrita no CNPJ sob o nº [CNPJ], 
            neste ato representada por [NOME DO REPRESENTANTE], [CARGO], 
            doravante denominada simplesmente CONTRATADA.</p>
            
            <h2>CLÁUSULA 1ª - DO OBJETO</h2>
            <p>O presente contrato tem por objeto a [DESCRIÇÃO DO OBJETO DO CONTRATO].</p>
            
            <h2>CLÁUSULA 2ª - DAS OBRIGAÇÕES DAS PARTES</h2>
            <p><strong>2.1.</strong> São obrigações da CONTRATANTE:</p>
            <ul>
                <li>[DESCRIÇÃO DAS OBRIGAÇÕES]</li>
            </ul>
            
            <p><strong>2.2.</strong> São obrigações da CONTRATADA:</p>
            <ul>
                <li>[DESCRIÇÃO DAS OBRIGAÇÕES]</li>
            </ul>
            
            <h2>CLÁUSULA 3ª - DO PRAZO E VIGÊNCIA</h2>
            <p>O presente contrato terá vigência de [NÚMERO] meses, 
            iniciando-se em [DATA DE INÍCIO] e terminando em [DATA DE TÉRMINO], 
            podendo ser renovado mediante acordo entre as partes.</p>
            
            <h2>CLÁUSULA 4ª - DO VALOR E FORMA DE PAGAMENTO</h2>
            <p><strong>4.1.</strong> O valor total do contrato é de R$ [VALOR] 
            ([VALOR POR EXTENSO]).</p>
            <p><strong>4.2.</strong> O pagamento será realizado da seguinte forma: 
            [FORMA DE PAGAMENTO].</p>
            
            <h2>CLÁUSULA 5ª - DAS DISPOSIÇÕES GERAIS</h2>
            <p>[OUTRAS DISPOSIÇÕES NECESSÁRIAS]</p>
            
            <p>E por estarem assim justas e contratadas, firmam o presente 
            contrato em duas vias de igual teor e forma, na presença das 
            testemunhas abaixo.</p>
            
            <p>Local e Data: [CIDADE], [DATA COMPLETA]</p>
            
            <table style="width: 100%; margin-top: 40px;">
                <tr>
                    <td style="text-align: center; width: 50%;">
                        <p>___________________________________</p>
                        <p><strong>CONTRATANTE</strong></p>
                        <p>[NOME DO REPRESENTANTE]</p>
                        <p>[CARGO]</p>
                    </td>
                    <td style="text-align: center; width: 50%;">
                        <p>___________________________________</p>
                        <p><strong>CONTRATADA</strong></p>
                        <p>[NOME DO REPRESENTANTE]</p>
                        <p>[CARGO]</p>
                    </td>
                </tr>
            </table>
            
            <table style="width: 100%; margin-top: 40px;">
                <tr>
                    <td style="text-align: center; width: 50%;">
                        <p>___________________________________</p>
                        <p><strong>Testemunha</strong></p>
                        <p>[NOME]</p>
                        <p>[RG/CPF]</p>
                    </td>
                    <td style="text-align: center; width: 50%;">
                        <p>___________________________________</p>
                        <p><strong>Testemunha</strong></p>
                        <p>[NOME]</p>
                        <p>[RG/CPF]</p>
                    </td>
                </tr>
            </table>
        `,
        
        servicos: `
            <h1>CONTRATO DE PRESTAÇÃO DE SERVIÇOS</h1>
            
            <p><strong>Entre:</strong></p>
            
            <p><strong>CONTRATANTE:</strong> [NOME], [NACIONALIDADE], 
            [ESTADO CIVIL], [PROFISSÃO], portador do RG nº [RG] e CPF nº [CPF], 
            residente e domiciliado em [ENDEREÇO COMPLETO];</p>
            
            <p><strong>CONTRATADO:</strong> [NOME], [NACIONALIDADE], 
            [ESTADO CIVIL], [PROFISSÃO], portador do RG nº [RG] e CPF nº [CPF], 
            residente e domiciliado em [ENDEREÇO COMPLETO].</p>
            
            <h2>CLÁUSULA 1ª - DO OBJETO</h2>
            <p>O presente contrato tem por objeto a prestação de serviços de 
            [ESPECIFICAR O SERVIÇO], conforme especificações constantes deste instrumento.</p>
            
            <h2>CLÁUSULA 2ª - DAS ESPECIFICAÇÕES DOS SERVIÇOS</h2>
            <p>Os serviços a serem prestados consistem em:</p>
            <ul>
                <li>[DETALHAMENTO DOS SERVIÇOS]</li>
            </ul>
            
            <h2>CLÁUSULA 3ª - DO PRAZO</h2>
            <p>Os serviços serão executados no prazo de [PRAZO], 
            a partir da data de assinatura deste contrato.</p>
            
            <h2>CLÁUSULA 4ª - DO VALOR E FORMA DE PAGAMENTO</h2>
            <p>O valor total dos serviços é de R$ [VALOR] ([VALOR POR EXTENSO]), 
            a ser pago da seguinte forma: [FORMA DE PAGAMENTO].</p>
            
            <h2>CLÁUSULA 5ª - DAS OBRIGAÇÕES DAS PARTES</h2>
            <p><strong>5.1.</strong> São obrigações do CONTRATANTE:</p>
            <ul>
                <li>[OBRIGAÇÕES]</li>
            </ul>
            
            <p><strong>5.2.</strong> São obrigações do CONTRATADO:</p>
            <ul>
                <li>[OBRIGAÇÕES]</li>
            </ul>
        `,
        
        confidencialidade: `
            <h1>ACORDO DE CONFIDENCIALIDADE</h1>
            
            <p><strong>Entre:</strong></p>
            
            <p><strong>PARTE REVELADORA:</strong> [NOME DA EMPRESA], 
            com sede em [ENDEREÇO], CNPJ [CNPJ], representada por [NOME], [CARGO];</p>
            
            <p><strong>PARTE RECEPTORA:</strong> [NOME DA EMPRESA], 
            com sede em [ENDEREÇO], CNPJ [CNPJ], representada por [NOME], [CARGO].</p>
            
            <h2>CLÁUSULA 1ª - DEFINIÇÕES</h2>
            <p>Para os fins deste acordo, considera-se "Informação Confidencial" 
            qualquer informação de caráter confidencial revelada pela Parte 
            Reveladora à Parte Receptora.</p>
            
            <h2>CLÁUSULA 2ª - OBRIGAÇÕES DE CONFIDENCIALIDADE</h2>
            <p>A Parte Receptora se obriga a manter em caráter confidencial 
            todas as Informações Confidenciais e a não divulgá-las a terceiros 
            sem autorização prévia por escrito da Parte Reveladora.</p>
            
            <h2>CLÁUSULA 3ª - VIGÊNCIA</h2>
            <p>Este acordo terá vigência de [NÚMERO] anos, a partir da data 
            de sua assinatura.</p>
        `,
        
        parceria: `
            <h1>CONTRATO DE PARCERIA COMERCIAL</h1>
            
            <p><strong>Entre as partes:</strong></p>
            
            <p><strong>PARCEIRO A:</strong> [NOME DA EMPRESA], 
            com sede em [ENDEREÇO], CNPJ [CNPJ], representada por [NOME], [CARGO];</p>
            
            <p><strong>PARCEIRO B:</strong> [NOME DA EMPRESA], 
            com sede em [ENDEREÇO], CNPJ [CNPJ], representada por [NOME], [CARGO].</p>
            
            <h2>CLÁUSULA 1ª - DO OBJETO</h2>
            <p>As partes resolvem estabelecer uma parceria comercial para 
            [OBJETIVO DA PARCERIA].</p>
            
            <h2>CLÁUSULA 2ª - DOS DIREITOS E OBRIGAÇÕES</h2>
            <p><strong>2.1.</strong> Direitos e obrigações do PARCEIRO A:</p>
            <ul>
                <li>[DIREITOS E OBRIGAÇÕES]</li>
            </ul>
            
            <p><strong>2.2.</strong> Direitos e obrigações do PARCEIRO B:</p>
            <ul>
                <li>[DIREITOS E OBRIGAÇÕES]</li>
            </ul>
            
            <h2>CLÁUSULA 3ª - DA REMUNERAÇÃO</h2>
            <p>A remuneração oriunda desta parceria será distribuída da 
            seguinte forma: [FORMA DE DISTRIBUIÇÃO].</p>
        `
    };

    // Inicialização
    initEditor();

    function initEditor() {
        initializeQuill();
        setupEventListeners();
        loadDocumentFromURL();
        startAutoSave();
    }

    function initializeQuill() {
        // Configuração do Quill
        quill = new Quill('#editor-container', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    [{ 'indent': '-1'}, { 'indent': '+1' }],
                    [{ 'align': [] }],
                    ['link', 'image'],
                    ['clean']
                ]
            },
            placeholder: 'Digite o conteúdo do seu contrato...',
            formats: [
                'header', 'bold', 'italic', 'underline', 'strike',
                'color', 'background', 'list', 'indent', 'align',
                'link', 'image'
            ]
        });

        // Event listener para mudanças no conteúdo
        quill.on('text-change', function() {
            currentDocument.content = quill.root.innerHTML;
            updateAutoSaveStatus('saving');
        });
    }

    function setupEventListeners() {
        // Navegação
        backBtn.addEventListener('click', function() {
            if (hasUnsavedChanges()) {
                showConfirmNavigation();
            } else {
                window.location.href = 'contratos.html';
            }
        });

        // Ações do editor
        clearBtn.addEventListener('click', showClearConfirmation);
        uploadBtn.addEventListener('click', handleFileUpload);
        saveBtn.addEventListener('click', manualSave);
        downloadBtn.addEventListener('click', downloadDocument);

        // Templates
        templateBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const templateType = this.getAttribute('data-template');
                applyTemplate(templateType);
            });
        });

        // Anexos
        addAttachmentBtn.addEventListener('click', addAttachment);

        // Modal de confirmação de limpeza
        document.querySelector('#clear-confirm-modal .close').addEventListener('click', closeModals);
        document.getElementById('clear-cancel').addEventListener('click', closeModals);
        document.getElementById('clear-confirm').addEventListener('click', confirmClear);

        // Fechar modal ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === clearConfirmModal) {
                closeModals();
            }
        });

        // Prevenir saída da página com alterações não salvas
        window.addEventListener('beforeunload', function(e) {
            if (hasUnsavedChanges()) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    }

    function loadDocumentFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const action = urlParams.get('action');
        const contractId = urlParams.get('id');

        if (action === 'edit' && contractId) {
            loadExistingContract(contractId);
        } else if (action === 'new') {
            // Novo documento - já está pronto
            updateDocumentTitle('Novo Contrato');
        }
    }

    function loadExistingContract(contractId) {
        // TODO: Substituir por chamada API real
        // fetch(`/api/contratos/${contractId}`)
        //   .then(response => response.json())
        //   .then(contract => {
        //       currentDocument = contract;
        //       quill.root.innerHTML = contract.content;
        //       updateDocumentTitle(contract.title);
        //       loadAttachments(contract.attachments);
        //       loadVersions(contract.versions);
        //   });

        // Simulação de carregamento
        setTimeout(() => {
            const sampleContract = {
                id: contractId,
                title: 'Contrato Existente',
                content: '<h1>Contrato Carregado</h1><p>Este é um contrato existente que foi carregado para edição.</p>',
                attachments: [],
                versions: [],
                lastSaved: new Date(),
                isDraft: false
            };

            currentDocument = sampleContract;
            quill.root.innerHTML = sampleContract.content;
            updateDocumentTitle(sampleContract.title);
            showToast('Contrato carregado com sucesso!');
        }, 500);
    }

    function applyTemplate(templateType) {
        if (hasUnsavedChanges()) {
            showConfirmModal(
                'Aplicar este template substituirá o conteúdo atual. Deseja continuar?',
                function() {
                    insertTemplate(templateType);
                }
            );
        } else {
            insertTemplate(templateType);
        }
    }

    function insertTemplate(templateType) {
        const template = templates[templateType];
        if (template) {
            quill.root.innerHTML = template;
            currentDocument.content = template;
            updateDocumentTitle(`Contrato ${templateType.charAt(0).toUpperCase() + templateType.slice(1)}`);
            showToast(`Template ${templateType} aplicado com sucesso!`);
        }
    }

    function startAutoSave() {
        setInterval(() => {
            if (hasUnsavedChanges() && currentDocument.content.trim() !== '') {
                autoSave();
            }
        }, 30000); // Salva a cada 30 segundos
    }

    function autoSave() {
        // TODO: Substituir por chamada API real
        // fetch('/api/contratos/autosave', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(currentDocument)
        // })

        currentDocument.lastSaved = new Date();
        currentDocument.isDraft = true;
        
        // Simular salvamento
        setTimeout(() => {
            updateAutoSaveStatus('saved');
            console.log('Documento salvo automaticamente:', currentDocument);
        }, 1000);
    }

    function manualSave() {
        if (currentDocument.content.trim() === '') {
            showToast('Não é possível salvar um documento vazio.', 'warning');
            return;
        }

        // TODO: Substituir por chamada API real
        // fetch('/api/contratos', {
        //     method: currentDocument.id ? 'PUT' : 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         ...currentDocument,
        //         isDraft: false
        //     })
        // })

        currentDocument.lastSaved = new Date();
        currentDocument.isDraft = false;
        
        // Simular salvamento
        updateAutoSaveStatus('saving');
        setTimeout(() => {
            updateAutoSaveStatus('saved');
            showToast('Contrato salvo com sucesso!');
            
            // Adicionar à versões
            addVersion('Salvamento manual');
        }, 1500);
    }

    function handleFileUpload() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.txt,.jpg,.jpeg,.png';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                processFileUpload(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    function processFileUpload(file) {
        // TODO: Substituir por upload real para o servidor
        // const formData = new FormData();
        // formData.append('file', file);
        // fetch('/api/upload', { method: 'POST', body: formData })

        const reader = new FileReader();
        
        reader.onload = function(e) {
            if (file.type.startsWith('image/')) {
                // Inserir imagem no editor
                const range = quill.getSelection();
                quill.insertEmbed(range.index, 'image', e.target.result);
            } else {
                // Para outros arquivos, adicionar como anexo
                addAttachmentToList(file.name, e.target.result);
            }
            
            showToast(`Arquivo "${file.name}" processado com sucesso!`);
        };
        
        reader.readAsDataURL(file);
    }

    function addAttachment() {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '*/*';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                addAttachmentFile(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    function addAttachmentFile(file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            addAttachmentToList(file.name, e.target.result, file.type);
            showToast(`Anexo "${file.name}" adicionado com sucesso!`);
        };
        
        reader.readAsDataURL(file);
    }

    function addAttachmentToList(name, data, type = 'application/octet-stream') {
        const attachment = {
            id: 'att-' + Date.now(),
            name: name,
            data: data,
            type: type,
            date: new Date()
        };

        currentDocument.attachments.push(attachment);
        renderAttachmentsList();
    }

    function renderAttachmentsList() {
        const container = document.getElementById('attachments-list');
        
        if (currentDocument.attachments.length === 0) {
            container.innerHTML = `
                <div class="empty-attachments">
                    <i class="fas fa-paperclip"></i>
                    <p>Nenhum anexo adicionado</p>
                </div>
            `;
            return;
        }

        container.innerHTML = currentDocument.attachments.map(att => `
            <div class="attachment-item" data-attachment-id="${att.id}">
                <i class="fas fa-paperclip attachment-icon"></i>
                <span class="attachment-name">${att.name}</span>
                <button class="remove-attachment" title="Remover anexo">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');

        // Adicionar event listeners para remover anexos
        container.querySelectorAll('.remove-attachment').forEach(btn => {
            btn.addEventListener('click', function() {
                const attachmentId = this.closest('.attachment-item').getAttribute('data-attachment-id');
                removeAttachment(attachmentId);
            });
        });
    }

    function removeAttachment(attachmentId) {
        currentDocument.attachments = currentDocument.attachments.filter(att => att.id !== attachmentId);
        renderAttachmentsList();
        showToast('Anexo removido com sucesso!');
    }

    function downloadDocument() {
        if (currentDocument.content.trim() === '') {
            showToast('Não é possível baixar um documento vazio.', 'warning');
            return;
        }

        // Criar conteúdo para download
        const content = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${currentDocument.title}</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
                    h1, h2, h3 { color: #333; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td { padding: 10px; vertical-align: top; }
                </style>
            </head>
            <body>
                ${currentDocument.content}
                ${currentDocument.attachments.length > 0 ? `
                    <h2>Anexos</h2>
                    <ul>
                        ${currentDocument.attachments.map(att => `<li>${att.name}</li>`).join('')}
                    </ul>
                ` : ''}
            </body>
            </html>
        `;

        // Criar e disparar download
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${currentDocument.title}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        showToast('Download do contrato iniciado!');
    }

    function showClearConfirmation() {
        clearConfirmModal.style.display = 'flex';
    }

    function confirmClear() {
        const saveBeforeClear = document.getElementById('save-before-clear').checked;
        
        if (saveBeforeClear && hasUnsavedChanges()) {
            manualSave();
        }

        quill.root.innerHTML = '';
        currentDocument.content = '';
        updateDocumentTitle('Novo Contrato');
        closeModals();
        showToast('Documento limpo com sucesso!');
    }

    function addVersion(description) {
        const version = {
            id: 'v' + Date.now(),
            date: new Date(),
            content: currentDocument.content,
            description: description
        };

        currentDocument.versions.unshift(version);
        renderVersionsList();
    }

    function renderVersionsList() {
        const container = document.getElementById('versions-list');
        
        if (currentDocument.versions.length === 0) {
            container.innerHTML = `
                <div class="empty-versions">
                    <i class="fas fa-clock"></i>
                    <p>Nenhuma versão salva</p>
                </div>
            `;
            return;
        }

        container.innerHTML = currentDocument.versions.slice(0, 5).map(version => `
            <div class="version-item" data-version-id="${version.id}">
                <div class="version-date">${formatDate(version.date)}</div>
                <div class="version-info">
                    <span>${version.description}</span>
                </div>
            </div>
        `).join('');

        // Adicionar event listeners para restaurar versões
        container.querySelectorAll('.version-item').forEach(item => {
            item.addEventListener('click', function() {
                const versionId = this.getAttribute('data-version-id');
                restoreVersion(versionId);
            });
        });
    }

    function restoreVersion(versionId) {
        const version = currentDocument.versions.find(v => v.id === versionId);
        if (version) {
            quill.root.innerHTML = version.content;
            currentDocument.content = version.content;
            showToast('Versão restaurada com sucesso!');
        }
    }

    function updateDocumentTitle(title) {
        currentDocument.title = title;
        document.getElementById('doc-title').textContent = title;
        document.title = `${title} - Editor de Contratos - TradeLink`;
    }

    function updateAutoSaveStatus(status) {
        const statusElement = document.getElementById('autosave-status');
        
        switch(status) {
            case 'saving':
                statusElement.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i> Salvando...';
                statusElement.className = 'autosave-status saving';
                break;
            case 'saved':
                statusElement.innerHTML = `<i class="fas fa-check"></i> Salvo ${formatTime(new Date())}`;
                statusElement.className = 'autosave-status saved';
                break;
            default:
                statusElement.innerHTML = '<i class="fas fa-save"></i> Salvando automaticamente...';
                statusElement.className = 'autosave-status';
        }
    }

    function hasUnsavedChanges() {
        // Verifica se há alterações não salvas
        // Em uma implementação real, isso seria mais sofisticado
        return currentDocument.content !== quill.root.innerHTML || 
               currentDocument.isDraft;
    }

    function showConfirmNavigation() {
        if (confirm('Você tem alterações não salvas. Deseja realmente sair?')) {
            window.location.href = 'contratos.html';
        }
    }

    function showConfirmModal(message, confirmCallback) {
        if (confirm(message)) {
            confirmCallback();
        }
    }

    function closeModals() {
        clearConfirmModal.style.display = 'none';
    }

    function formatDate(date) {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatTime(date) {
        return new Date(date).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
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
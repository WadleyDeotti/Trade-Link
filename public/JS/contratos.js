// contratos.js - Sistema de Gerenciamento de Contratos
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.section');
    const searchInputs = document.querySelectorAll('.search-box input');
    const createOptions = document.querySelectorAll('.option-card');
    
    // Modais
    const previewModal = document.getElementById('preview-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const toast = document.getElementById('toast');
    
    // Dados de exemplo (substituir por chamadas API)
    let contractsData = {
        andamento: [
            { id: 'CT-001', title: 'Contrato de Prestação de Serviços', parts: 'Empresa ABC & Fornecedor XYZ', date: '15/03/2023', status: 'andamento', type: 'servico' },
            { id: 'CT-002', title: 'Contrato de Fornecimento', parts: 'Comércio Ltda & Indústria ABC', date: '10/03/2023', status: 'andamento', type: 'fornecimento' }
        ],
        assinar: [
            { id: 'CT-003', title: 'Contrato de Parceria', parts: 'Startup Tech & Investidor', date: '20/03/2023', status: 'pendente', type: 'parceria' }
        ],
        assinados: [
            { id: 'CT-004', title: 'Contrato de Confidencialidade', parts: 'Empresa A & Empresa B', date: '05/03/2023', status: 'assinado', type: 'confidencialidade' },
            { id: 'CT-005', title: 'Contrato de Prestação de Serviços', parts: 'Cliente Final & Prestador', date: '01/03/2023', status: 'assinado', type: 'servico' }
        ],
        meus: [
            { id: 'CT-006', title: 'Contrato em Rascunho', parts: 'Eu & Cliente Potencial', date: '25/03/2023', status: 'rascunho', type: 'servico' },
            { id: 'CT-001', title: 'Contrato de Prestação de Serviços', parts: 'Empresa ABC & Fornecedor XYZ', date: '15/03/2023', status: 'andamento', type: 'servico' },
            { id: 'CT-004', title: 'Contrato de Confidencialidade', parts: 'Empresa A & Empresa B', date: '05/03/2023', status: 'assinado', type: 'confidencialidade' }
        ]
    };

    // Inicialização
    initContracts();

    function initContracts() {
        setupEventListeners();
        loadContractsData();
    }

    function setupEventListeners() {
        // Navegação entre seções
        navBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const targetSection = this.getAttribute('data-section');
                activateSection(targetSection);
            });
        });

        // Busca em tempo real
        searchInputs.forEach(input => {
            input.addEventListener('input', function() {
                const sectionId = this.closest('.section').id.replace('section-', '');
                filterContracts(sectionId, this.value);
            });
        });

        // Opções de criação
        createOptions.forEach(option => {
            option.addEventListener('click', function() {
                const type = this.getAttribute('data-type');
                handleCreateOption(type);
            });
        });

        // Fechar modais
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', closeAllModals);
        });

        // Fecha modal ao clicar fora
        window.addEventListener('click', function(event) {
            if (event.target === previewModal) {
                closeAllModals();
            }
            if (event.target === confirmModal) {
                closeAllModals();
            }
        });

        // Ações do modal de preview
        document.getElementById('close-preview').addEventListener('click', closeAllModals);
        document.getElementById('edit-contract').addEventListener('click', function() {
            const contractId = this.getAttribute('data-contract-id');
            editContract(contractId);
        });
        document.getElementById('download-contract').addEventListener('click', function() {
            const contractId = this.getAttribute('data-contract-id');
            downloadContract(contractId);
        });

        // Modal de confirmação
        document.getElementById('confirm-cancel').addEventListener('click', closeAllModals);
        document.getElementById('confirm-ok').addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            const contractId = this.getAttribute('data-contract-id');
            executeAction(action, contractId);
        });
    }

    function activateSection(sectionId) {
        // Atualizar botões de navegação
        navBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-section') === sectionId) {
                btn.classList.add('active');
            }
        });

        // Atualizar seções
        sections.forEach(section => {
            section.classList.remove('active');
            if (section.id === `section-${sectionId}`) {
                section.classList.add('active');
            }
        });

        // Carregar dados da seção
        loadSectionData(sectionId);
    }

    function loadContractsData() {
        // TODO: Substituir por chamada API
        // fetch('/api/contratos')
        //   .then(response => response.json())
        //   .then(data => {
        //       contractsData = data;
        //       loadSectionData('andamento');
        //   });

        loadSectionData('andamento');
    }

    function loadSectionData(sectionId) {
        const sectionData = contractsData[sectionId] || [];
        const listContainer = document.getElementById(`list-${sectionId}`);
        
        if (sectionData.length === 0) {
            showEmptyState(listContainer, sectionId);
            return;
        }

        renderContractsList(sectionData, listContainer, sectionId);
    }

    function renderContractsList(contracts, container, sectionId) {
        container.innerHTML = '';

        contracts.forEach(contract => {
            const contractElement = createContractElement(contract, sectionId);
            container.appendChild(contractElement);
        });
    }

    function createContractElement(contract, sectionId) {
        const div = document.createElement('div');
        div.className = 'contract-item';
        div.setAttribute('data-contract-id', contract.id);

        const statusClass = `status-${contract.status}`;
        const statusText = getStatusText(contract.status);

        div.innerHTML = `
            <div class="contract-header">
                <div class="contract-info">
                    <div class="contract-title">${contract.title}</div>
                    <div class="contract-meta">
                        <span><i class="fas fa-users"></i> ${contract.parts}</span>
                        <span><i class="far fa-calendar"></i> ${contract.date}</span>
                        <span class="contract-status ${statusClass}">${statusText}</span>
                    </div>
                </div>
                <div class="contract-actions">
                    ${sectionId !== 'gerar' ? `
                        <button class="btn-icon view-contract" title="Visualizar">
                            <i class="fas fa-eye"></i>
                        </button>
                        ${sectionId === 'meus' ? `
                            <button class="btn-icon edit-contract" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon duplicate-contract" title="Duplicar">
                                <i class="fas fa-copy"></i>
                            </button>
                        ` : ''}
                        ${sectionId === 'assinar' ? `
                            <button class="btn-icon sign-contract" title="Assinar">
                                <i class="fas fa-signature"></i>
                            </button>
                        ` : ''}
                    ` : ''}
                </div>
            </div>
        `;

        // Event listeners para ações
        const viewBtn = div.querySelector('.view-contract');
        if (viewBtn) {
            viewBtn.addEventListener('click', () => viewContract(contract.id));
        }

        const editBtn = div.querySelector('.edit-contract');
        if (editBtn) {
            editBtn.addEventListener('click', () => editContract(contract.id));
        }

        const duplicateBtn = div.querySelector('.duplicate-contract');
        if (duplicateBtn) {
            duplicateBtn.addEventListener('click', () => duplicateContract(contract.id));
        }

        const signBtn = div.querySelector('.sign-contract');
        if (signBtn) {
            signBtn.addEventListener('click', () => signContract(contract.id));
        }

        return div;
    }

    function showEmptyState(container, sectionId) {
        const emptyTexts = {
            andamento: 'Nenhum contrato em andamento no momento.',
            assinar: 'Nenhum contrato aguardando assinatura.',
            assinados: 'Nenhum contrato assinado encontrado.',
            meus: 'Você ainda não criou nenhum contrato.'
        };

        container.innerHTML = `
            <div class="empty-state">
                <i class="far fa-file-alt"></i>
                <h3>${emptyTexts[sectionId] || 'Nenhum contrato encontrado.'}</h3>
                ${sectionId === 'meus' ? `
                    <p>Comece criando seu primeiro contrato!</p>
                    <button class="btn btn-primary" onclick="activateSection('gerar')">
                        <i class="fas fa-plus"></i> Criar Contrato
                    </button>
                ` : ''}
            </div>
        `;
    }

    function filterContracts(sectionId, searchTerm) {
        const contracts = contractsData[sectionId] || [];
        const filteredContracts = contracts.filter(contract => 
            contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.parts.toLowerCase().includes(searchTerm.toLowerCase()) ||
            contract.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const listContainer = document.getElementById(`list-${sectionId}`);
        
        if (filteredContracts.length === 0) {
            listContainer.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-search"></i>
                    <h3>Nenhum contrato encontrado para "${searchTerm}"</h3>
                </div>
            `;
        } else {
            renderContractsList(filteredContracts, listContainer, sectionId);
        }
    }

    function handleCreateOption(type) {
        switch(type) {
            case 'novo':
                createNewContract();
                break;
            case 'upload':
                uploadContract();
                break;
            case 'template':
                useTemplate();
                break;
        }
    }

    function createNewContract() {
        // Redireciona para o editor de contratos
        window.location.href = 'editor-contratos.html?action=new';
    }

    function uploadContract() {
        // TODO: Implementar upload de arquivo
        // Criar input file dinamicamente
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.txt';
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Processar upload
                handleFileUpload(file);
            }
        });

        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
    }

    function handleFileUpload(file) {
        // TODO: Substituir por upload real para o servidor
        // Exemplo: 
        // const formData = new FormData();
        // formData.append('contractFile', file);
        // fetch('/api/contratos/upload', { method: 'POST', body: formData })

        showToast(`Arquivo "${file.name}" enviado com sucesso!`);
        
        // Simular processamento
        setTimeout(() => {
            // Adicionar à lista de meus contratos
            const newContract = {
                id: 'CT-' + Date.now(),
                title: file.name,
                parts: 'Uploaded Document',
                date: new Date().toLocaleDateString('pt-BR'),
                status: 'rascunho',
                type: 'upload'
            };
            
            if (!contractsData.meus) contractsData.meus = [];
            contractsData.meus.unshift(newContract);
            
            // Atualizar seção meus contratos se estiver ativa
            if (document.getElementById('section-meus').classList.contains('active')) {
                loadSectionData('meus');
            }
        }, 1000);
    }

    function useTemplate() {
        // TODO: Implementar seleção de template
        showToast('Funcionalidade de templates em desenvolvimento!', 'info');
    }

    function viewContract(contractId) {
        // TODO: Buscar dados completos do contrato via API
        // fetch(`/api/contratos/${contractId}`)
        const contract = findContractById(contractId);
        
        if (contract) {
            showContractPreview(contract);
        }
    }

    function showContractPreview(contract) {
        const previewContent = document.getElementById('contract-preview-content');
        const editBtn = document.getElementById('edit-contract');
        const downloadBtn = document.getElementById('download-contract');

        // TODO: Buscar conteúdo real do contrato
        previewContent.innerHTML = `
            <h3>${contract.title}</h3>
            <p><strong>Partes:</strong> ${contract.parts}</p>
            <p><strong>Data:</strong> ${contract.date}</p>
            <p><strong>Status:</strong> ${getStatusText(contract.status)}</p>
            <p><strong>Tipo:</strong> ${contract.type}</p>
            <hr>
            <p>Este é um preview do contrato. O conteúdo completo será carregado aqui.</p>
        `;

        // Configurar botões de ação
        editBtn.setAttribute('data-contract-id', contract.id);
        downloadBtn.setAttribute('data-contract-id', contract.id);

        // Mostrar/ocultar botão de edição baseado no status
        if (contract.status === 'rascunho' || contract.status === 'andamento') {
            editBtn.style.display = 'inline-flex';
        } else {
            editBtn.style.display = 'none';
        }

        previewModal.style.display = 'flex';
    }

    function editContract(contractId) {
        // Redireciona para o editor com o ID do contrato
        window.location.href = `editor-contratos.html?action=edit&id=${contractId}`;
    }

    function duplicateContract(contractId) {
        showConfirmModal(
            'Deseja duplicar este contrato?',
            'duplicate',
            contractId
        );
    }

    function signContract(contractId) {
        showConfirmModal(
            'Deseja assinar este contrato?',
            'sign',
            contractId
        );
    }

    function downloadContract(contractId) {
        // TODO: Implementar download real
        const contract = findContractById(contractId);
        showToast(`Download do contrato ${contract.title} iniciado!`);
        
        // Simular download
        setTimeout(() => {
            showToast(`Contrato ${contract.title} baixado com sucesso!`);
        }, 1500);
    }

    function executeAction(action, contractId) {
        switch(action) {
            case 'duplicate':
                duplicateContractAction(contractId);
                break;
            case 'sign':
                signContractAction(contractId);
                break;
        }
        closeAllModals();
    }

    function duplicateContractAction(contractId) {
        const originalContract = findContractById(contractId);
        if (originalContract) {
            const duplicatedContract = {
                ...originalContract,
                id: 'CT-' + Date.now(),
                title: originalContract.title + ' (Cópia)',
                date: new Date().toLocaleDateString('pt-BR'),
                status: 'rascunho'
            };

            // TODO: Substituir por chamada API
            // fetch('/api/contratos', { method: 'POST', body: JSON.stringify(duplicatedContract) })
            
            contractsData.meus.unshift(duplicatedContract);
            loadSectionData('meus');
            showToast('Contrato duplicado com sucesso!');
        }
    }

    function signContractAction(contractId) {
        // TODO: Implementar assinatura real
        const contract = findContractById(contractId);
        if (contract) {
            contract.status = 'assinado';
            showToast('Contrato assinado com sucesso!');
            
            // Atualizar interface
            if (document.getElementById('section-assinar').classList.contains('active')) {
                loadSectionData('assinar');
            }
        }
    }

    function findContractById(contractId) {
        for (const section in contractsData) {
            const contract = contractsData[section].find(c => c.id === contractId);
            if (contract) return contract;
        }
        return null;
    }

    function getStatusText(status) {
        const statusMap = {
            'rascunho': 'Rascunho',
            'andamento': 'Em Andamento',
            'pendente': 'Pendente',
            'assinado': 'Assinado',
            'cancelado': 'Cancelado'
        };
        return statusMap[status] || status;
    }

    function showConfirmModal(message, action, contractId) {
        document.getElementById('confirm-message').textContent = message;
        document.getElementById('confirm-ok').setAttribute('data-action', action);
        document.getElementById('confirm-ok').setAttribute('data-contract-id', contractId);
        confirmModal.style.display = 'flex';
    }

    function closeAllModals() {
        previewModal.style.display = 'none';
        confirmModal.style.display = 'none';
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
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
});
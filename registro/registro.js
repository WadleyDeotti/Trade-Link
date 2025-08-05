document.addEventListener('DOMContentLoaded', function() {
    // Elementos do formulário
    const typeOptions = document.querySelectorAll('.typeOption');
    const docField = document.getElementById('campoTroca');
    const submitBtn = document.getElementById('submit-btn');
    
    // Elementos das checkboxes
    const termosCheckbox = document.getElementById('termosCheckbox');
    const privacidadeCheckbox = document.getElementById('privacidadeCheckbox');
    
    // Modais
    const mainDialog = document.getElementById('meuDialog');
    const termosDialog = document.getElementById('termosDialog');
    const privacidadeDialog = document.getElementById('privacidadeDialog');
    const resultado = document.getElementById('resultado');
    const confirmarModal = document.getElementById('confirmarModal');
    
    // Alternância entre Fornecedor/Empresa
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            typeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            
            if (this.dataset.type === 'fornecedor') {
                docField.innerHTML = `
                    <div class="formGroup">
                        <p class="labelregis">CPF:</p>
                        <input type="text" class="inputregis" id="inputCpf" placeholder="XXX.XXX.XXX-XX" 
                            maxlength="14" oninput="mascaraCpf()">
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="termosCheckbox" class="customCheckbox">
                        <label for="termosCheckbox" class="checkboxLabel">
                            Li e aceito os <span class="linkModal" data-modal="termosDialog">Termos de Serviço</span>
                        </label>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="privacidadeCheckbox" class="customCheckbox">
                        <label for="privacidadeCheckbox" class="checkboxLabel">
                            Li e aceito a <span class="linkModal" data-modal="privacidadeDialog">Política de Privacidade</span>
                        </label>
                    </div>
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login/login.html">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores/fornecedores.html">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn" disabled>CONCLUIR</button>
                `;
                
                // Reatribuir eventos após mudar o HTML
                setupCheckboxes();
            } else {
                docField.innerHTML = `
                    <div class="formGroup">
                        <p class="labelregis">CNPJ:</p>
                        <input type="text" class="inputregis" id="inputCnpj" placeholder="XX.XXX.XXX/XXXX-XX" 
                            maxlength="18" oninput="mascaraCnpj()">
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="termosCheckbox" class="customCheckbox">
                        <label for="termosCheckbox" class="checkboxLabel">
                            Li e aceito os <span class="linkModal" data-modal="termosDialog">Termos de Serviço</span>
                        </label>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="privacidadeCheckbox" class="customCheckbox">
                        <label for="privacidadeCheckbox" class="checkboxLabel">
                            Li e aceito a <span class="linkModal" data-modal="privacidadeDialog">Política de Privacidade</span>
                        </label>
                    </div>
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login/login.html">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores/fornecedores.html">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn" disabled>CONCLUIR</button>
                `;
                
                // Reatribuir eventos após mudar o HTML
                setupCheckboxes();
            }
        });
    });

    // Configurar checkboxes e modais
    function setupCheckboxes() {
        const termosCheckbox = document.getElementById('termosCheckbox');
        const privacidadeCheckbox = document.getElementById('privacidadeCheckbox');
        const submitBtn = document.getElementById('submit-btn');
        const modalLinks = document.querySelectorAll('.linkModal');
        
        // Verificar estado das checkboxes
        function verificarCheckboxes() {
            if (termosCheckbox.checked && privacidadeCheckbox.checked) {
                submitBtn.disabled = false;
            } else {
                submitBtn.disabled = true;
            }
        }
        
        // Eventos das checkboxes
        termosCheckbox.addEventListener('change', verificarCheckboxes);
        privacidadeCheckbox.addEventListener('change', verificarCheckboxes);
        
        // Eventos dos links dos modais
        modalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                document.getElementById(modalId).showModal();
            });
        });
        
        // Evento do botão submit
        submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const selectedType = document.querySelector('.typeOption.selected').dataset.type;
            
            if (selectedType === 'fornecedor') {
                validarCPF();
            } else {
                validarCNPJ();
            }
        });
    }
    
    // Inicializar configurações
    setupCheckboxes();
    
    // Eventos para fechar modais
    document.querySelectorAll('.fechar-modal, .fechar-modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('dialog').close();
        });
    });
    
    // Fechar modais ao clicar no backdrop
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            if (e.target === this) {
                this.close();
            }
        });
    });
    
    // Confirmar modal principal
    confirmarModal.addEventListener('click', function() {
        mainDialog.close();
    });
});

// Funções de máscara
function mascaraTelefone() {
    const telefone = document.getElementById("inputTel");
    let value = telefone.value.replace(/\D/g, '').slice(0, 11);
    let inputFormat = '';
    
    if (value.length > 0) inputFormat = `(${value.substring(0, 2)}`;
    if (value.length > 2) inputFormat += `) ${value.substring(2, 7)}`;
    if (value.length > 7) inputFormat += `-${value.substring(7, 11)}`;
    
    telefone.value = inputFormat;
}

function mascaraCpf() {
    const cpf = document.getElementById("inputCpf");
    let value = cpf.value.replace(/\D/g, '').slice(0, 11);
    let valorFormatado = '';
    
    if (value.length > 0) valorFormatado = value.substring(0, 3);
    if (value.length > 3) valorFormatado += '.' + value.substring(3, 6);
    if (value.length > 6) valorFormatado += '.' + value.substring(6, 9);
    if (value.length > 9) valorFormatado += '-' + value.substring(9, 11);
    
    cpf.value = valorFormatado;
}

function mascaraCnpj() {
    const cnpj = document.getElementById("inputCnpj");
    let value = cnpj.value.replace(/\D/g, '').slice(0, 14);
    let valorFormatado = '';
    
    if (value.length > 0) valorFormatado = value.substring(0, 2);
    if (value.length > 2) valorFormatado += '.' + value.substring(2, 5);
    if (value.length > 5) valorFormatado += '.' + value.substring(5, 8);
    if (value.length > 8) valorFormatado += '/' + value.substring(8, 12);
    if (value.length > 12) valorFormatado += '-' + value.substring(12, 14);
    
    cnpj.value = valorFormatado;
}

// Funções de validação
function validarCPF() {
    const cpf = document.getElementById('inputCpf').value.replace(/\D/g, '');
    const resultado = document.getElementById('resultado');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        resultado.textContent = 'CPF inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    // Cálculo dos dígitos verificadores
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    if (resto !== parseInt(cpf.charAt(9))) {
        resultado.textContent = 'CPF inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    if (resto !== parseInt(cpf.charAt(10))) {
        resultado.textContent = 'CPF inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    resultado.textContent = 'Cadastro realizado com sucesso!';
    resultado.style.color = '#5cb85c';
    meuDialog.showModal();
}

function validarCNPJ() {
    const cnpj = document.getElementById('inputCnpj').value.replace(/\D/g, '');
    const resultado = document.getElementById('resultado');
    
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        resultado.textContent = 'CNPJ inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    // Cálculo dos dígitos verificadores
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado1 !== parseInt(digitos.charAt(0))) {
        resultado.textContent = 'CNPJ inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += numeros.charAt(tamanho - i) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado2 !== parseInt(digitos.charAt(1))) {
        resultado.textContent = 'CNPJ inválido!';
        resultado.style.color = '#d9534f';
        meuDialog.showModal();
        return;
    }
    
    resultado.textContent = 'Cadastro realizado com sucesso!';
    resultado.style.color = '#5cb85c';
    meuDialog.showModal();
}
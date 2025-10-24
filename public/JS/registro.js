document.addEventListener('DOMContentLoaded', function() {
    const formRegister = document.getElementById('register');
    const typeOptions = document.querySelectorAll('.typeOption');
    const tipoCadastroInput = document.getElementById('tipoCadastro');
    const docField = document.getElementById('campoTroca');
    const senhaInput = document.getElementById('senha');
    const confirmarSenhaInput = document.getElementById('confirmarSenha');

    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            typeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            tipoCadastroInput.value = this.dataset.type;
            
            if (this.dataset.type === 'fornecedor') {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cpf" class="labelregis">CPF:</label>
                        <input id="cpf" name="cpf" type="text" class="inputregis" placeholder="XXX.XXX.XXX-XX" 
                            maxlength="14" oninput="mascaraCpf(this)" required>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="termosCheckbox" name="aceita_termos" class="customCheckbox" required>
                        <label for="termosCheckbox" class="checkboxLabel">
                            Li e aceito os <span class="linkModal" data-modal="termosDialog">Termos de Serviço</span>
                        </label>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="privacidadeCheckbox" name="aceita_privacidade" class="customCheckbox" required>
                        <label for="privacidadeCheckbox" class="checkboxLabel">
                            Li e aceito a <span class="linkModal" data-modal="privacidadeDialog">Política de Privacidade</span>
                        </label>
                    </div>
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn" disabled>CONCLUIR</button>
                `;
            } else {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cnpj" class="labelregis">CNPJ:</label>
                        <input id="cnpj" name="cnpj" type="text" class="inputregis" placeholder="XX.XXX.XXX/XXXX-XX" 
                            maxlength="18" oninput="mascaraCnpj(this)" required>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="termosCheckbox" name="aceita_termos" class="customCheckbox" required>
                        <label for="termosCheckbox" class="checkboxLabel">
                            Li e aceito os <span class="linkModal" data-modal="termosDialog">Termos de Serviço</span>
                        </label>
                    </div>
                    <div class="checkboxGroup">
                        <input type="checkbox" id="privacidadeCheckbox" name="aceita_privacidade" class="customCheckbox" required>
                        <label for="privacidadeCheckbox" class="checkboxLabel">
                            Li e aceito a <span class="linkModal" data-modal="privacidadeDialog">Política de Privacidade</span>
                        </label>
                    </div>
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn" disabled>CONCLUIR</button>
                `;
            }
            
            setupForm();
        });
    });

    function setupForm() {
        const termosCheckbox = document.getElementById('termosCheckbox');
        const privacidadeCheckbox = document.getElementById('privacidadeCheckbox');
        const submitBtn = document.getElementById('submit-btn');
        const modalLinks = document.querySelectorAll('.linkModal');
        const togglePasswordButtons = document.querySelectorAll('.toggle-password');
        
        function verificarCheckboxes() {
            submitBtn.disabled = !(termosCheckbox && termosCheckbox.checked && 
                                 privacidadeCheckbox && privacidadeCheckbox.checked);
        }
        
        if (termosCheckbox && privacidadeCheckbox) {
            termosCheckbox.addEventListener('change', verificarCheckboxes);
            privacidadeCheckbox.addEventListener('change', verificarCheckboxes);
        }
        
        modalLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const modalId = this.getAttribute('data-modal');
                document.getElementById(modalId).showModal();
            });
        });
        
        togglePasswordButtons.forEach(button => {
            button.addEventListener('click', function() {
                const input = this.parentElement.querySelector('input');
                const icon = this.querySelector('svg');
                if (input.type === 'password') {
                    input.type = 'text';
                    icon.innerHTML = '<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 10a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1-2.5 2.5z"/>';
                } else {
                    input.type = 'password';
                    icon.innerHTML = '<path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>';
                }
            });
        });
    }
    
    setupForm();
    
    document.querySelectorAll('.fechar-modal, .fechar-modal-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('dialog').close();
        });
    });
    
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', function(e) {
            if (e.target === this) {
                this.close();
            }
        });
    });
    
    // formRegister.addEventListener('submit', function(e) {
    //     e.preventDefault();
        
    //     if (senhaInput.value !== confirmarSenhaInput.value) {
    //         const resultado = document.getElementById('resultado');
    //         resultado.textContent = 'As senhas não coincidem!';
    //         resultado.style.color = '#d9534f';
    //         document.getElementById('meuDialog').showModal();
    //         return;
    //     }
        
    //     if (senhaInput.value.length < 8) {
    //         const resultado = document.getElementById('resultado');
    //         resultado.textContent = 'A senha deve ter pelo menos 8 caracteres!';
    //         resultado.style.color = '#d9534f';
    //         document.getElementById('meuDialog').showModal();
    //         return;
    //     }
        
    //     let isValid = false;
    //     const resultado = document.getElementById('resultado');
        
    //     if (tipoCadastroInput.value === 'fornecedor') {
    //         isValid = validarCPF(document.getElementById('cpf'));
    //     } else {
    //         isValid = validarCNPJ(document.getElementById('cnpj'));
    //     }
        
    //     if (!isValid) {
    //         resultado.textContent = tipoCadastroInput.value === 'fornecedor' ? 'CPF inválido!' : 'CNPJ inválido!';
    //         resultado.style.color = '#d9534f';
    //         document.getElementById('meuDialog').showModal();
    //         return;
    //     }
      
    // });
});

// ======= Funções auxiliares =======

function mascaraCpf(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 11);
    let valorFormatado = '';
    
    if (value.length > 0) valorFormatado = value.substring(0, 3);
    if (value.length > 3) valorFormatado += '.' + value.substring(3, 6);
    if (value.length > 6) valorFormatado += '.' + value.substring(6, 9);
    if (value.length > 9) valorFormatado += '-' + value.substring(9, 11);
    
    input.value = valorFormatado;
}

function mascaraCnpj(input) {
    let value = input.value.replace(/\D/g, '').slice(0, 14);
    let valorFormatado = '';
    
    if (value.length > 0) valorFormatado = value.substring(0, 2);
    if (value.length > 2) valorFormatado += '.' + value.substring(2, 5);
    if (value.length > 5) valorFormatado += '.' + value.substring(5, 8);
    if (value.length > 8) valorFormatado += '/' + value.substring(8, 12);
    if (value.length > 12) valorFormatado += '-' + value.substring(12, 14);
    
    input.value = valorFormatado;
}

function validarCPF(cpfInput) {
    const cpf = cpfInput.value.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    if (resto !== parseInt(cpf.charAt(9))) {
        return false;
    }
    
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpjInput) {
    const cnpj = cnpjInput.value.replace(/\D/g, '');
    
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
        return false;
    }
    
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
        return false;
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
    return resultado2 === parseInt(digitos.charAt(1));
}

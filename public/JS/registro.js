document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById('register');
    const typeOptions = document.querySelectorAll('.typeOption');
    const tipoCadastroInput = document.getElementById('tipoCadastro');
    const docField = document.getElementById('campoTroca');

    // Toggle password visibility
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-password');
        if (!btn) return;
        e.preventDefault();
        const container = btn.closest('.password-container');
        const input = container.querySelector('input');
        const icon = btn.querySelector('svg');
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = '<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 10a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5z"/>';
        } else {
            input.type = 'password';
            icon.innerHTML = '<path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>';
        }
    });

    // Troca de tipo (fornecedor/empresa)
    typeOptions.forEach(option => {
        option.addEventListener('click', function () {
            typeOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            tipoCadastroInput.value = this.dataset.type || 'fornecedor';

            if (this.dataset.type === 'fornecedor') {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cpf" class="labelregis">CPF:</label>
                        <input id="cpf" name="cpf" type="text" class="inputregis" placeholder="XXX.XXX.XXX-XX" maxlength="14" required>
                    </div>
                    ${camposComunsHTML()}
                `;
            } else {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cnpj" class="labelregis">CNPJ:</label>
                        <input id="cnpj" name="cnpj" type="text" class="inputregis" placeholder="XX.XXX.XXX/XXXX-XX" maxlength="18" required>
                    </div>
                    ${camposComunsHTML()}
                `;
            }

            // Adicionar eventos aos novos campos
            const docInput = document.getElementById('cpf') || document.getElementById('cnpj');
            if (docInput) {
                docInput.addEventListener('input', function() {
                    if (this.id === 'cpf') {
                        mascaraCpf(this);
                    } else {
                        mascaraCnpj(this);
                    }
                });
                docInput.addEventListener('blur', function() {
                    validarDocumentoVisual(this);
                });
            }

            checaEstadoCheckboxes();
        });
    });

    // Fechar modais
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.fechar-modal, .fechar-modal-btn');
        if (btn) {
            e.preventDefault();
            const dlg = btn.closest('dialog');
            if (dlg) dlg.close();
        }
    });

    // Abrir modais
    document.addEventListener('click', function (e) {
        const link = e.target.closest('.linkModal');
        if (!link) return;
        e.preventDefault();
        e.stopPropagation();
        const modalId = link.getAttribute('data-modal');
        const dlg = document.getElementById(modalId);
        if (dlg) dlg.showModal();
    });

    // Validação no submit
    formRegister.addEventListener('submit', function (e) {
        e.preventDefault();

        const senhaInput = document.getElementById('senha');
        const confirmarSenhaInput = document.getElementById('confirmarSenha');
        const resultado = document.getElementById('resultado');
        const meuDialog = document.getElementById('meuDialog');

        if (senhaInput.value !== confirmarSenhaInput.value) {
            mostrarModal('As senhas não coincidem!', '#d9534f');
            return;
        }

        if (senhaInput.value.length < 8) {
            mostrarModal('A senha deve ter pelo menos 8 caracteres!', '#d9534f');
            return;
        }

        const tipo = tipoCadastroInput.value;
        const docInput = document.getElementById(tipo === 'fornecedor' ? 'cpf' : 'cnpj');
        
        if (!docInput || !validarDocumentoVisual(docInput)) {
            mostrarModal(`${tipo === 'fornecedor' ? 'CPF' : 'CNPJ'} inválido!`, '#d9534f');
            return;
        }

        mostrarModal('Cadastro realizado com sucesso!', '#5cb85c');
        setTimeout(() => {
            this.submit();
        }, 1500);
    });

    function camposComunsHTML() {
        return `
            <div class="checkboxGroup">
                <input type="checkbox" id="termosCheckbox" name="aceita_termos" class="customCheckbox" required>
                <label for="termosCheckbox" class="checkboxLabel">
                    Li e aceito os <span class="linkModal" data-modal="termosDialog">Termos de Uso</span>
                </label>
            </div>
            <div class="checkboxGroup">
                <input type="checkbox" id="privacidadeCheckbox" name="aceita_privacidade" class="customCheckbox" required>
                <label for="privacidadeCheckbox" class="checkboxLabel">
                    Li e aceito a <span class="linkModal" data-modal="privacidadeDialog">Termos de Consentimento</span>
                </label>
            </div>
            <div class="loginTem">
                Já tem uma conta? <a class="loginSend" href="login">LOGIN</a>
            </div>
            <button type="submit" class="submit-btn" id="submit-btn" disabled>CONCLUIR</button>
        `;
    }

    function checaEstadoCheckboxes() {
        setTimeout(() => {
            const termos = document.getElementById('termosCheckbox');
            const privacidade = document.getElementById('privacidadeCheckbox');
            const submit = document.getElementById('submit-btn');
            if (submit) {
                submit.disabled = !(termos && termos.checked && privacidade && privacidade.checked);
            }
        }, 100);
    }

    function mostrarModal(mensagem, cor) {
        const resultado = document.getElementById('resultado');
        const meuDialog = document.getElementById('meuDialog');
        resultado.textContent = mensagem;
        resultado.style.color = cor;
        meuDialog.showModal();
    }

    // Eventos para checkboxes
    document.addEventListener('change', (e) => {
        if (e.target.id === 'termosCheckbox' || e.target.id === 'privacidadeCheckbox') {
            checaEstadoCheckboxes();
        }
    });

    // Adicionar eventos ao campo CPF inicial
    const cpfInicial = document.getElementById('cpf');
    if (cpfInicial) {
        cpfInicial.addEventListener('input', function() { mascaraCpf(this); });
        cpfInicial.addEventListener('blur', function() { validarDocumentoVisual(this); });
    }

    checaEstadoCheckboxes();
});

function mascaraCpf(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    input.value = value;
}

function mascaraCnpj(input) {
    let value = input.value.replace(/\D/g, '');
    value = value.replace(/^(\d{2})(\d)/, '$1.$2');
    value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
    value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
    value = value.replace(/(\d{4})(\d)/, '$1-$2');
    input.value = value;
}

function validarDocumentoVisual(input) {
    const documento = input.value.replace(/\D/g, '');
    let valido = false;
    
    if (input.id === 'cpf' && documento.length === 11) {
        valido = validarCPF(documento);
    } else if (input.id === 'cnpj' && documento.length === 14) {
        valido = validarCNPJ(documento);
    }
    
    if (documento.length > 0) {
        input.style.borderColor = valido ? '#28a745' : '#dc3545';
        input.style.boxShadow = valido ? '0 0 0 0.2rem rgba(40, 167, 69, 0.25)' : '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
    } else {
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
    
    return valido;
}

function validarCPF(cpf) {
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;
    
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    
    return resto === parseInt(cpf.charAt(10));
}

function validarCNPJ(cnpj) {
    if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
    
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    return resultado === parseInt(digitos.charAt(1));
}
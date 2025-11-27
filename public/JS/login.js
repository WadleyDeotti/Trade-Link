document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('login');
    const documentoInput = document.getElementById('documento');
    const senhaInput = document.getElementById('senha');
    const dialog = document.getElementById('meuDialog');
    const resultado = document.getElementById('resultado');

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('svg');
            if (input.type === 'password') {
                input.type = 'text';
                icon.innerHTML = '<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 10a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5z"/>';
            } else {
                input.type = 'password';
                icon.innerHTML = '<path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>';
            }
        });
    });

    // Validação visual em tempo real
    documentoInput.addEventListener('blur', function() {
        validarDocumentoVisual(this);
    });

    // Validação no submit
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validarDocumentoVisual(documentoInput)) {
            mostrarModal('CPF/CNPJ inválido! Verifique os dados inseridos.', '#d9534f');
            return;
        }
        
        if (senhaInput.value.length < 6) {
            mostrarModal('A senha deve ter pelo menos 6 caracteres!', '#d9534f');
            return;
        }
        
        this.submit();
    });

    // Fechar modal
    document.getElementById('confirmarModal').addEventListener('click', () => dialog.close());
    document.getElementById('fecharModal').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });

    function mostrarModal(mensagem, cor) {
        resultado.textContent = mensagem;
        resultado.style.color = cor;
        dialog.showModal();
    }

    function validarDocumentoVisual(input) {
        const documento = input.value.replace(/\D/g, '');
        let valido = false;
        
        if (documento.length === 11) {
            valido = validarCPF(documento);
        } else if (documento.length === 14) {
            valido = validarCNPJ(documento);
        }
        
        input.style.borderColor = valido ? '#28a745' : '#dc3545';
        input.style.boxShadow = valido ? '0 0 0 0.2rem rgba(40, 167, 69, 0.25)' : '0 0 0 0.2rem rgba(220, 53, 69, 0.25)';
        
        return valido;
    }
});

function formatarDocumento(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
        // CPF
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d)/, '$1.$2');
        value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    } else {
        // CNPJ
        value = value.replace(/^(\d{2})(\d)/, '$1.$2');
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3');
        value = value.replace(/\.(\d{3})(\d)/, '.$1/$2');
        value = value.replace(/(\d{4})(\d)/, '$1-$2');
    }
    
    input.value = value;
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
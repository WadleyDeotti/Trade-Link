document.addEventListener('DOMContentLoaded', function() {
    const formLogin = document.getElementById('login');
    
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar documento
        const documentoInput = document.getElementById('documento');
        const documento = documentoInput.value.replace(/\D/g, '');
        const isCpf = documento.length <= 11;
        
        if (isCpf && !validarCPF(documentoInput)) {
            alert('Por favor, insira um CPF válido');
            documentoInput.focus();
            return;
        }
        
        if (!isCpf && !validarCNPJ(documentoInput)) {
            alert('Por favor, insira um CNPJ válido');
            documentoInput.focus();
            return;
        }
        
        // Validar senha
        const senhaInput = document.getElementById('senha');
        if (senhaInput.value.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres');
            senhaInput.focus();
            return;
        }
        
        // Se todas as validações passarem
        console.log('Dados do formulário:', {
            documento: documentoInput.value,
            senha: senhaInput.value
        });
        
        // Simular envio (substitua por formLogin.submit() em produção)
        setTimeout(() => {
            alert('Login realizado com sucesso! Redirecionando...');
            // window.location.href = '/dashboard.html'; // Descomente para redirecionar
        }, 500);
    });
});

function formatarDocumento(input) {
    let value = input.value.replace(/\D/g, '');
    let formattedValue = '';
    
    if (value.length <= 11) { // CPF
        if (value.length > 0) formattedValue = value.substring(0, 3);
        if (value.length > 3) formattedValue += '.' + value.substring(3, 6);
        if (value.length > 6) formattedValue += '.' + value.substring(6, 9);
        if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
    } else { // CNPJ
        if (value.length > 0) formattedValue = value.substring(0, 2);
        if (value.length > 2) formattedValue += '.' + value.substring(2, 5);
        if (value.length > 5) formattedValue += '.' + value.substring(5, 8);
        if (value.length > 8) formattedValue += '/' + value.substring(8, 12);
        if (value.length > 12) formattedValue += '-' + value.substring(12, 14);
    }
    
    input.value = formattedValue;
}

function validarCPF(cpfInput) {
    const cpf = cpfInput.value.replace(/\D/g, '');
    
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
        return false;
    }
    
    // Cálculo dos dígitos verificadores
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
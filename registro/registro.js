document.addEventListener('DOMContentLoaded', function() {
    // Alternância entre Fornecedor/Empresa
    const typeOptions = document.querySelectorAll('.typeOption');
    const docField = document.getElementById('campoTroca');
    
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
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login/login.html">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores/fornecedores.html">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn">CONCLUIR</button>
                `;
            } else {
                docField.innerHTML = `
                    <div class="formGroup">
                        <p class="labelregis">CNPJ:</p>
                        <input type="text" class="inputregis" id="inputCnpj" placeholder="XX.XXX.XXX/XXXX-XX" 
                            maxlength="18" oninput="mascaraCnpj()">
                    </div>
                    <div class="loginTem">
                        Já tem uma conta? <a class="loginSend" href="/login/login.html">LOGIN</a>
                    </div>
                    <div class="loginTem">
                        <a class="loginSend" href="/fornecedores/fornecedores.html">Fornecedores</a>
                    </div>
                    <button type="submit" class="submit-btn" id="submit-btn">CONCLUIR</button>
                `;
            }

            // Reatribui os eventos do botão após mudar o HTML
            document.getElementById('submit-btn').addEventListener('click', function(e) {
                e.preventDefault();
                const selectedType = document.querySelector('.typeOption.selected').dataset.type;
                if (selectedType === 'fornecedor') {
                    validarCPF();
                } else {
                    validarCNPJ();
                }
            });
        });
    });

    // Máscaras de input
    window.mascaraTelefone = function() {
        const telefone = document.getElementById("inputTel");
        let value = telefone.value.replace(/\D/g, '').slice(0, 11);
        let inputFormat = '';
        
        if (value.length > 0) inputFormat = `(${value.substring(0, 2)}`;
        if (value.length > 2) inputFormat += `) ${value.substring(2, 7)}`;
        if (value.length > 7) inputFormat += `-${value.substring(7, 11)}`;
        
        telefone.value = inputFormat;
    };

    window.mascaraCpf = function() {
        const cpf = document.getElementById("inputCpf");
        let value = cpf.value.replace(/\D/g, '').slice(0, 11);
        let valorFormatado = '';
        
        if (value.length > 0) valorFormatado = value.substring(0, 3);
        if (value.length > 3) valorFormatado += '.' + value.substring(3, 6);
        if (value.length > 6) valorFormatado += '.' + value.substring(6, 9);
        if (value.length > 9) valorFormatado += '-' + value.substring(9, 11);
        
        cpf.value = valorFormatado;
    };

    window.mascaraCnpj = function() {
        const cnpj = document.getElementById("inputCnpj");
        let value = cnpj.value.replace(/\D/g, '').slice(0, 14);
        let valorFormatado = '';
        
        if (value.length > 0) valorFormatado = value.substring(0, 2);
        if (value.length > 2) valorFormatado += '.' + value.substring(2, 5);
        if (value.length > 5) valorFormatado += '.' + value.substring(5, 8);
        if (value.length > 8) valorFormatado += '/' + value.substring(8, 12);
        if (value.length > 12) valorFormatado += '-' + value.substring(12, 14);
        
        cnpj.value = valorFormatado;
    };

    // Validações
    window.validarCPF = function() {
        const cpf = document.getElementById('inputCpf').value.replace(/\D/g, '');
        const resultado = document.getElementById('resultado');
        let mensagem = '';
        
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
            mensagem = 'CPF inválido!';
        } else {
            // Cálculo dos dígitos verificadores
            let soma = 0;
            for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
            let resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            
            if (resto !== parseInt(cpf.charAt(9))) {
                mensagem = 'CPF inválido!';
            } else {
                soma = 0;
                for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
                resto = (soma * 10) % 11;
                if (resto === 10 || resto === 11) resto = 0;
                
                mensagem = (resto === parseInt(cpf.charAt(10))) ? 'CPF válido!' : 'CPF inválido!';
            }
        }
        
        resultado.innerHTML = mensagem;
        dialog.showModal();
    };

    window.validarCNPJ = function() {
        const cnpj = document.getElementById('inputCnpj').value.replace(/\D/g, '');
        const resultado = document.getElementById('resultado');
        let mensagem = '';
        
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
            mensagem = 'CNPJ inválido!';
        } else {
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
                mensagem = 'CNPJ inválido!';
            } else {
                tamanho = tamanho + 1;
                numeros = cnpj.substring(0, tamanho);
                soma = 0;
                pos = tamanho - 7;
                
                for (let i = tamanho; i >= 1; i--) {
                    soma += numeros.charAt(tamanho - i) * pos--;
                    if (pos < 2) pos = 9;
                }
                
                let resultado2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
                mensagem = (resultado2 === parseInt(digitos.charAt(1))) ? 'CNPJ válido!' : 'CNPJ inválido!';
            }
        }
        
        resultado.innerHTML = mensagem;
        dialog.showModal();
    };

    // Modal
    const dialog = document.getElementById('meuDialog');
    const fecharBtn = document.getElementById('fecharModal');
    
    // Fechar modal
    fecharBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
        if (event.target === dialog) dialog.close();
    });
});
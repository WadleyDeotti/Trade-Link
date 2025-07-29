document.addEventListener('DOMContentLoaded', function() {
    const typeOptions = document.querySelectorAll('.typeOption');
    const docField = document.getElementById('campoTroca');
    
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            // reomve o anterior
            typeOptions.forEach(opt => opt.classList.remove('selected'));
            
            // add a seleção atual
            this.classList.add('selected');
            
            // muda o campo de documento dependendo do que tu escole
            if(this.dataset.type === 'fornecedor') {
                docField.innerHTML = `
                    <div id="campoTroca">
        <div class="formGroup">
        <p class="labelregis">CPF:</p>
            <input type="text" class="inputregis" id="inputCpf" placeholder="XXX.XXX.XXX-XX" 
               maxlength="15" oninput="mascaraCpf()">
        </div>
        <div class="loginTem">
            Já tem uma conta? <a id="loginSend" href="pagina2.html">LOGIN</a>
        </div>
        <button type="submit" class="submit-btn" id="submit-btn" onclick="validarCPF()">CONCLUIR</button>
        </div>
                `;
            } else {
                docField.innerHTML = `
                    <div id="campoTroca">
        <div class="formGroup">
        <p class="labelregis">CPF:</p>
            <input type="text" class="inputregis" id="inputCpf" placeholder="XX.XXX.XXX/XXXX-XX" 
               maxlength="18" oninput="mascaraCpf()">
        </div>
        <div class="loginTem">
            Já tem uma conta? <a id="loginSend" href="pagina2.html">LOGIN</a>
        </div>
        <button type="submit" class="submit-btn" id="submit-btn" onclick="validarCPF()">CONCLUIR</button>
        </div>
                `;
            }
        });
    });
});

function mascaraTelefone(){

    const telefone = document.getElementById("inputTel")

    let value = telefone.value.replace(/\D/g, '').slice(0, 11); //se pá dá pra remover o slice

    //let telefone = input.telefone.replace(/\D/g, '');
    
    let inputFormat = '';
    if (value.length > 0) {
        inputFormat = `(${value.substring(0, 2)}`;
    }
    if (value.length > 2) {
        inputFormat += `) ${value.substring(2, 7)}`;
    }
    if (value.length > 7) {
        inputFormat += `-${value.substring(7, 11)}`;
    }
    
    if (telefone.value !== inputFormat) {
        telefone.value = inputFormat;
    }

}

function mascaraCnpj(){

    const cnpj = document.getElementById("inputCnpj");

    let value = cnpj.value.replace(/\D/g, '').slice(0, 14);

    let valorFormatado = '';
    
    if (value.length > 0) {
        valorFormatado = value.substring(0, 2);
    }
    if (value.length > 2) {
        valorFormatado += '.' + value.substring(2, 5);
    }
    if (value.length > 5) {
        valorFormatado += '.' + value.substring(5, 8);
    }
    if (value.length > 8) {
        valorFormatado += '/' + value.substring(8, 12);
    }
    if (value.length > 12) {
        valorFormatado += '-' + value.substring(12, 14);
    }

    if (cnpj.value !== valorFormatado) {
        cnpj.value = valorFormatado;
    }

}

function mascaraCpf(){

    const cpf = document.getElementById("inputCpf");

    const value = cpf.value.replace(/\D/g, '').slice(0, 11);

    let valorFormatado = '';
    
    if (value.length > 0) {
        valorFormatado = value.substring(0, 3);
    }
    if (value.length > 3) {
        valorFormatado += '.' + value.substring(3, 6);
    }
    if (value.length > 6) {
        valorFormatado += '.' + value.substring(6, 9);
    }
    if (value.length > 9) {
        valorFormatado += '-' + value.substring(9, 11);
    }

    if (cpf.value !== valorFormatado) {
        cpf.value = valorFormatado;
    }
}

// Elementos do DOM
        const dialog = document.getElementById('meuDialog');
        const abrirBtn = document.getElementById('submit-btn');
        const fecharBtn = document.getElementById('fecharModal');

        // Abrir modal
        abrirBtn.addEventListener('click', () => {
            dialog.showModal(); // Método nativo para abrir o dialog como modal
        });

        // Fechar modal
        fecharBtn.addEventListener('click', () => {
            dialog.close(); // Método nativo para fechar o dialog
        });

        // Fechar ao pressionar ESC (funciona automaticamente com dialog)
        
        // Fechar ao clicar no backdrop (fora do modal)
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                dialog.close();
            }
        });

        // Evento quando o modal é fechado
        dialog.addEventListener('close', () => {
            console.log('Modal foi fechado');
        });


// Função para validar CNPJ

// const btnCon = document.getElementById("submit-btn");

function validarCPF(cpf) {

    const cpf = document.getElementById('inputCpf').value;
    const resultado = document.getElementById('resultado');

    // Valida CPF se preenchido
            if (cpf) {
                const cpfValido = validarCPF(cpf);
                const p = document.createElement('p');
                p.textContent = `CPF ${cpfValido ? 'válido' : 'inválido'}: ${cpf}`;
                p.className = cpfValido ? 'valid' : 'invalid';
                resultado.appendChild(p);
            }

            // Remove caracteres não numéricos
            cpf = cpf.replace(/[^\d]/g, '');
            
            // Verifica se tem 11 dígitos ou se é uma sequência de dígitos iguais
            if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
                return false;
            }
            
            // Calcula o primeiro dígito verificador
            let soma = 0;
            for (let i = 0; i < 9; i++) {
                soma += parseInt(cpf.charAt(i)) * (10 - i);
            }
            let resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.charAt(9))) {
                return false;
            }
            
            // Calcula o segundo dígito verificador
            soma = 0;
            for (let i = 0; i < 10; i++) {
                soma += parseInt(cpf.charAt(i)) * (11 - i);
            }
            resto = (soma * 10) % 11;
            if (resto === 10 || resto === 11) resto = 0;
            if (resto !== parseInt(cpf.charAt(10))) {
                return "CPF inválido";
            }
            
            return "CPF válido";
        }

function validarCNPJ(cnpj) {

    const cnpj = document.getElementById('inputCnpj').value;
    const resultado = document.getElementById('resultado');

    resultado.innerHTML = '';
    resultado.className = 'result';

    // Valida CNPJ se preenchido
            if (cnpj) {
                const cnpjValido = validarCNPJ(cnpj);
                const p = document.createElement('p');
                p.textContent = `CNPJ ${cnpjValido ? 'válido' : 'inválido'}: ${cnpj}`;
                p.className = cnpjValido ? 'valid' : 'invalid';
                resultado.appendChild(p);
            }

            // Remove caracteres não numéricos
            cnpj = cnpj.replace(/[^\d]/g, '');
            
            // Verifica se tem 14 dígitos ou se é uma sequência de dígitos iguais
            if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
                return false;
            }
            
            // Valida primeiro dígito verificador
            let tamanho = cnpj.length - 2;
            let numeros = cnpj.substring(0, tamanho);
            const digitos = cnpj.substring(tamanho);
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
            
            // Valida segundo dígito verificador
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
                return "CNPJ inválido";
            }
            
            return "CNPJ válido";
}

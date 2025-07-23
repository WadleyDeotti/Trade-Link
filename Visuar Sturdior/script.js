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
                    <p class="labelregis">CPF:</p>
            <input type="text" class="inputregis" id="inputCpf" placeholder="XXX.XXX.XXX-XX" 
               maxlength="15" oninput="mascaraCpf()">
                `;
            } else {
                docField.innerHTML = `
                    <p class="labelregis">CNPJ:</p>
            <input type="text" class="inputregis" id="inputCnpj" placeholder="XX.XXX.XXX/XXXX-XX" 
               maxlength="18" oninput="mascaraCnpj()">
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


document.addEventListener('DOMContentLoaded', function () {
    const typeOptions = document.querySelectorAll('.typeOption');
    const tabIndicator = document.querySelector('.tab-indicator');
    const docField = document.getElementById('campoTroca');
    const registerContainer = document.getElementById('register');

    typeOptions.forEach(option => {
        option.addEventListener('click', function () {
           typeOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            // Move o indicador de fundo
            if (this.dataset.type === 'fornecedor') {
                tabIndicator.style.transform = 'translateX(0%)';
            } else {
                tabIndicator.style.transform = 'translateX(100%)';
            }


            // animação container
// registerContainer.classList.add('fade-register');
// ...
// docField.classList.remove('fade-slide');
// void docField.offsetWidth;
// docField.classList.add('fade-slide');
// ...
// setTimeout(() => {
//     registerContainer.classList.remove('fade-register');
// }, 300);

        });
    });
});

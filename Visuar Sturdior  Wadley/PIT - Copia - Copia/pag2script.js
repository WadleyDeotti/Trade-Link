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

    const cnpj = document.getElementById("inputCnpj")

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

function verificarDado(){

    const docField = document.getElementById('buttonTocra');

    let teste = (document.getElementById("inputTroca").value).length;
    //let comprimento = teste.length;
    console.log(teste);
    
    if (teste < 13) {
        
            console.log("CPF");
            const cpf = document.getElementById("inputTroca");

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
            document.getElementById("inputTroca").value = valorFormatado;
                
    } else {
        
            console.log("CNPJ");
            const cnpj = document.getElementById("inputTroca");

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
            document.getElementById("inputTroca").value = valorFormatado;
                

            }
}
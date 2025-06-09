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
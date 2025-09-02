// document.addEventListener('DOMContentLoaded', function() {
//     const formLogin = document.getElementById('login');
//     const togglePasswordButtons = document.querySelectorAll('.toggle-password');
//     const senhaInput = document.getElementById('senha');
//     const documentoInput = document.getElementById('documento');
//     const dialog = document.getElementById('meuDialog');
//     const resultado = document.getElementById('resultado');
//     const confirmarModal = document.getElementById('confirmarModal');
//     const fecharModal = document.getElementById('fecharModal');

//     togglePasswordButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const input = this.parentElement.querySelector('input');
//             const icon = this.querySelector('svg');
//             if (input.type === 'password') {
//                 input.type = 'text';
//                 icon.innerHTML = '<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 10a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5z"/>';
//             } else {
//                 input.type = 'password';
//                 icon.innerHTML = '<path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>';
//             }
//         });
//     });

//     confirmarModal.addEventListener('click', function() {
//         dialog.close();
//     });

//     fecharModal.addEventListener('click', function() {
//         dialog.close();
//     });

//     dialog.addEventListener('click', function(e) {
//         if (e.target === this) {
//             this.close();
//         }
//     });

//     formLogin.addEventListener('submit', function(e) {
//         e.preventDefault();
        
//         const documento = documentoInput.value.replace(/\D/g, '');
//         const isCpf = documento.length <= 11;
        
//         if (isCpf && !validarCPF(documentoInput)) {
//             resultado.textContent = 'Por favor, insira um CPF válido';
//             resultado.style.color = '#d9534f';
//             dialog.showModal();
//             documentoInput.focus();
//             return;
//         }
        
//         if (!isCpf && !validarCNPJ(documentoInput)) {
//             resultado.textContent = 'Por favor, insira um CNPJ válido';
//             resultado.style.color = '#d9534f';
//             dialog.showModal();
//             documentoInput.focus();
//             return;
//         }
        
//         if (senhaInput.value.length < 6) {
//             resultado.textContent = 'A senha deve ter pelo menos 6 caracteres';
//             resultado.style.color = '#d9534f';
//             dialog.showModal();
//             senhaInput.focus();
//             return;
//         }
        
//         resultado.textContent = 'Login realizado com sucesso! Redirecionando...';
//         resultado.style.color = '#5cb85c';
//         dialog.showModal();
        
//         setTimeout(() => {
//         }, 2000);
//     });
// });

// function formatarDocumento(input) {
//     let value = input.value.replace(/\D/g, '');
//     let formattedValue = '';
    
//     if (value.length <= 11) {
//         if (value.length > 0) formattedValue = value.substring(0, 3);
//         if (value.length > 3) formattedValue += '.' + value.substring(3, 6);
//         if (value.length > 6) formattedValue += '.' + value.substring(6, 9);
//         if (value.length > 9) formattedValue += '-' + value.substring(9, 11);
//     } else {
//         if (value.length > 0) formattedValue = value.substring(0, 2);
//         if (value.length > 2) formattedValue += '.' + value.substring(2, 5);
//         if (value.length > 5) formattedValue += '.' + value.substring(5, 8);
//         if (value.length > 8) formattedValue += '/' + value.substring(8, 12);
//         if (value.length > 12) formattedValue += '-' + value.substring(12, 14);
//     }
    
//     input.value = formattedValue;
// }

// function validarCPF(cpfInput) {
//     const cpf = cpfInput.value.replace(/\D/g, '');
    
//     if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) {
//         return false;
//     }
    
//     let soma = 0;
//     for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
//     let resto = (soma * 10) % 11;
//     if (resto === 10 || resto === 11) resto = 0;
    
//     if (resto !== parseInt(cpf.charAt(9))) {
//         return false;
//     }
    
//     soma = 0;
//     for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
//     resto = (soma * 10) % 11;
//     if (resto === 10 || resto === 11) resto = 0;
    
//     return resto === parseInt(cpf.charAt(10));
// }

// function validarCNPJ(cnpjInput) {
//     const cnpj = cnpjInput.value.replace(/\D/g, '');
    
//     if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) {
//         return false;
//     }
    
//     let tamanho = cnpj.length - 2;
//     let numeros = cnpj.substring(0, tamanho);
//     let digitos = cnpj.substring(tamanho);
//     let soma = 0;
//     let pos = tamanho - 7;
    
//     for (let i = tamanho; i >= 1; i--) {
//         soma += numeros.charAt(tamanho - i) * pos--;
//         if (pos < 2) pos = 9;
//     }
    
//     let resultado1 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
//     if (resultado1 !== parseInt(digitos.charAt(0))) {
//         return false;
//     }
    
//     tamanho = tamanho + 1;
//     numeros = cnpj.substring(0, tamanho);
//     soma = 0;
//     pos = tamanho - 7;
    
//     for (let i = tamanho; i >= 1; i--) {
//         soma += numeros.charAt(tamanho - i) * pos--;
//         if (pos < 2) pos = 9;
//     }
    
//     let resultado2 = soma % 11 < 2 ? 0 : 11 - (soma % 11);
//     return resultado2 === parseInt(digitos.charAt(1));
// }
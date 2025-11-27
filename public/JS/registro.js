// registro.js (substituir todo o arquivo)
document.addEventListener('DOMContentLoaded', () => {
    const formRegister = document.getElementById('register');
    const typeOptions = document.querySelectorAll('.typeOption');
    const tipoCadastroInput = document.getElementById('tipoCadastro');
    const docField = document.getElementById('campoTroca');

    // ---------- pointerdown em captura: evita que label marque checkbox antes do handler ----------
    document.addEventListener('pointerdown', function (e) {
        const link = e.target.closest('.linkModal');
        if (!link) return;
        // previne a ativação do label/checkbox e abre o dialog antes
        e.preventDefault();
        e.stopImmediatePropagation();
        const modalId = link.getAttribute('data-modal');
        const dlg = document.getElementById(modalId);
        if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
    }, true); // captura

    // ---------- delegação: teclado para abrir modais quando o foco está em .linkModal ----------
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        if (!active) return;
        const link = active.closest && active.closest('.linkModal');
        if (!link) return;
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const modalId = link.getAttribute('data-modal');
            const dlg = document.getElementById(modalId);
            if (dlg && typeof dlg.showModal === 'function') dlg.showModal();
        }
    });

    // ---------- função que gera campos comuns ----------
    function camposComunsHTML() {
        return `
            <div class="checkboxGroup">
                <input type="checkbox" id="termosCheckbox" name="aceita_termos" class="customCheckbox" required>
                <label for="termosCheckbox" class="checkboxLabel">
                    Li e aceito os <span class="linkModal" data-modal="termosDialog" tabindex="0" role="button">Termos de Serviço</span>
                </label>
            </div>
            <div class="checkboxGroup">
                <input type="checkbox" id="privacidadeCheckbox" name="aceita_privacidade" class="customCheckbox" required>
                <label for="privacidadeCheckbox" class="checkboxLabel">
                    Li e aceito a <span class="linkModal" data-modal="privacidadeDialog" tabindex="0" role="button">Política de Privacidade</span>
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

    // ---------- troca de tipo (fornecedor/empresa) ----------
    typeOptions.forEach(option => {
        option.addEventListener('click', function () {
            typeOptions.forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            tipoCadastroInput.value = this.dataset.type || 'fornecedor';

            if (this.dataset.type === 'fornecedor') {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cpf" class="labelregis">CPF:</label>
                        <input id="cpf" name="cpf" type="text" class="inputregis" placeholder="XXX.XXX.XXX-XX" maxlength="14" oninput="mascaraCpf(this)" required>
                    </div>
                    ${camposComunsHTML()}
                `;
            } else {
                docField.innerHTML = `
                    <div class="formGroup">
                        <label for="cnpj" class="labelregis">CNPJ:</label>
                        <input id="cnpj" name="cnpj" type="text" class="inputregis" placeholder="XX.XXX.XXX/XXXX-XX" maxlength="18" oninput="mascaraCnpj(this)" required>
                    </div>
                    ${camposComunsHTML()}
                `;
            }

            // garanta que o estado do botão seja rechecado após a injeção do innerHTML
            checaEstadoCheckboxes();
        });
    });

    // ---------- delegação para toggle de senha (olho) ----------
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.toggle-password');
        if (!btn) return;
        e.preventDefault();
        const container = btn.closest('.password-container');
        const input = container ? container.querySelector('input') : null;
        const icon = btn.querySelector('svg');
        if (!input || !icon) return;
        if (input.type === 'password') {
            input.type = 'text';
            icon.innerHTML = '<path d="M12 9a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3m0-4.5c-5 0-9.27 3.11-11 7.5 1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5m0 10a2.5 2.5 0 0 1-2.5-2.5 2.5 2.5 0 0 1 2.5-2.5 2.5 2.5 0 0 1 2.5 2.5 2.5 2.5 0 0 1-2.5 2.5z"/>';
        } else {
            input.type = 'password';
            icon.innerHTML = '<path d="M12 9a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3m0-4.5c5 0 9.27 3.11 11 7.5-1.73 4.39-6 7.5-11 7.5S2.73 16.39 1 12c1.73-4.39 6-7.5 11-7.5M3.18 12a9.821 9.821 0 0 0 17.64 0 9.821 9.821 0 0 0-17.64 0z"/>';
        }
    });

    // ---------- fechar modais (delegado) ----------
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.fechar-modal, .fechar-modal-btn');
        if (!btn) return;
        e.preventDefault();
        const dlg = btn.closest('dialog');
        if (dlg) dlg.close();
    });

    // fechar dialog ao clicar fora (mantive)
    document.querySelectorAll('dialog').forEach(dialog => {
        dialog.addEventListener('click', function (e) {
            if (e.target === this) this.close();
        });
    });

    // ---------- checagem do estado do botão (re-busca elementos) ----------
    function checaEstadoCheckboxes() {
        const termos = document.getElementById('termosCheckbox');
        const privacidade = document.getElementById('privacidadeCheckbox');
        const submit = document.getElementById('submit-btn');
        if (!submit) return;
        submit.disabled = !(termos && termos.checked && privacidade && privacidade.checked);
    }

    // reagir a changes nas checkboxes (delegado)
    document.addEventListener('change', (e) => {
        if (!e.target) return;
        if (e.target.id === 'termosCheckbox' || e.target.id === 'privacidadeCheckbox') {
            checaEstadoCheckboxes();
        }
    });

    // clique direto em checkbox (touch) — espera o estado atualizar
    document.addEventListener('click', (e) => {
        if (!e.target) return;
        if (e.target.id === 'termosCheckbox' || e.target.id === 'privacidadeCheckbox') {
            setTimeout(checaEstadoCheckboxes, 0);
        }
    });

    // ---------- submit com validações (re-busca inputs dinâmicos) ----------
    formRegister.addEventListener('submit', function (e) {
        e.preventDefault();

        const senhaInputNow = document.getElementById('senha');
        const confirmarSenhaInputNow = document.getElementById('confirmarSenha');
        const resultado = document.getElementById('resultado');
        const meuDialog = document.getElementById('meuDialog');
        const confirmarModal = document.getElementById('confirmarModal');

        if (!senhaInputNow || !confirmarSenhaInputNow) {
            alert('Erro: campos de senha não encontrados.');
            return;
        }

        if (senhaInputNow.value !== confirmarSenhaInputNow.value) {
            if (resultado) {
                resultado.textContent = 'As senhas não coincidem!';
                resultado.style.color = '#d9534f';
                if (meuDialog && typeof meuDialog.showModal === 'function') meuDialog.showModal();
            } else alert('As senhas não coincidem!');
            return;
        }

        if (senhaInputNow.value.length < 8) {
            if (resultado) {
                resultado.textContent = 'A senha deve ter pelo menos 8 caracteres!';
                resultado.style.color = '#d9534f';
                if (meuDialog && typeof meuDialog.showModal === 'function') meuDialog.showModal();
            } else alert('A senha deve ter pelo menos 8 caracteres!');
            return;
        }

        // valida CPF/CNPJ conforme tipo atual
        const tipo = (document.getElementById('tipoCadastro') && document.getElementById('tipoCadastro').value) || 'fornecedor';
        let valido = false;
        if (tipo === 'fornecedor') {
            const cpfInput = document.getElementById('cpf');
            if (!cpfInput || !validarCPF(cpfInput)) {
                if (resultado) {
                    resultado.textContent = 'CPF inválido!';
                    resultado.style.color = '#d9534f';
                    if (meuDialog && typeof meuDialog.showModal === 'function') meuDialog.showModal();
                } else alert('CPF inválido!');
                return;
            }
            valido = true;
        } else {
            const cnpjInput = document.getElementById('cnpj');
            if (!cnpjInput || !validarCNPJ(cnpjInput)) {
                if (resultado) {
                    resultado.textContent = 'CNPJ inválido!';
                    resultado.style.color = '#d9534f';
                    if (meuDialog && typeof meuDialog.showModal === 'function') meuDialog.showModal();
                } else alert('CNPJ inválido!');
                return;
            }
            valido = true;
        }

        if (valido) {
            if (resultado) {
                resultado.textContent = 'Cadastro realizado com sucesso!';
                resultado.style.color = '#5cb85c';
                if (meuDialog && typeof meuDialog.showModal === 'function') meuDialog.showModal();
            }

            if (confirmarModal) {
                const handler = () => {
                    confirmarModal.removeEventListener('click', handler);
                    // envia form para backend
                    formRegister.submit();
                };
                confirmarModal.addEventListener('click', handler);
            } else {
                formRegister.submit();
            }
        }
    });

    // inicial
    checaEstadoCheckboxes();
});

document.addEventListener('DOMContentLoaded', function () {
  // ======= ELEMENTOS DA INTERFACE =======
  const formPerfil = document.getElementById('formPerfil');
  const passwordModal = document.getElementById('password-modal');
  const imageModal = document.getElementById('image-modal');
  const closeModalButtons = document.querySelectorAll('.close');
  const toast = document.getElementById('toast');

  // ======= ELEMENTOS DO PERFIL (IDs do seu HTML) =======
  const bannerImage = document.getElementById('banner-image'); // corrigido
  const avatarImage = document.getElementById('avatar-image'); // corrigido
  const profileName = document.getElementById('profile-name');
  const profileLocation = document.getElementById('profile-location');
  const profileDescription = document.getElementById('profile-description');
  const headerUserName = document.getElementById('header-user-name');
  const headerUserPic = document.getElementById('header-user-pic');

  // ======= BOTÕES =======
  const viewPasswordBtn = document.getElementById('view-password-btn');
  const saveBtn = document.getElementById('save-btn');
  const cancelBtn = document.getElementById('cancel-btn');

  // ======= INPUTS DO FORM =======
  const fornecedorNome = document.getElementById('fornecedor-nome');
  const fornecedorEmail = document.getElementById('fornecedor-email');
  const fornecedorCpf = document.getElementById('fornecedor-cpf');
  const fornecedorLocal = document.getElementById('fornecedor-local');
  const fornecedorSenha = document.getElementById('fornecedor-senha');
  const fornecedorTelefone = document.getElementById('fornecedor-telefone');
  const fornecedorDescricao = document.getElementById('fornecedor-descricao');

  // ======= MODAL DE IMAGEM =======
  const imageUpload = document.getElementById('image-upload');
  const imagePreviewContainer = document.getElementById('image-preview-container');
  const imagePreview = document.getElementById('image-preview');
  const saveImageBtn = document.getElementById('save-image-btn');
  const cancelImageBtn = document.getElementById('cancel-image-btn');

  // ======= ESTADO =======
  let currentImageType = ''; // 'avatar' | 'banner'
  let imageFile = null;
  let isPasswordRevealed = false;

  // ======= SENHA PADRÃO =======
  const DEFAULT_PASSWORD = 'adminTL';

  // ======= INICIALIZA =======
  init();

  function init() {
    // senha padrão se não houver
    if (!localStorage.getItem('tradeLinkPassword')) {
      localStorage.setItem('tradeLinkPassword', DEFAULT_PASSWORD);
    }

    loadProfileData();
    setupEventListeners();

    // garante botão "Alterar Senha" caso não exista
    if (!document.getElementById('change-password-btn')) {
      const passwordGroup = document.querySelector('.input-with-icon')?.parentNode;
      if (passwordGroup) {
        const changePasswordBtn = document.createElement('button');
        changePasswordBtn.type = 'button';
        changePasswordBtn.className = 'btn btn-secondary';
        changePasswordBtn.id = 'change-password-btn';
        changePasswordBtn.innerHTML = '<i class="fas fa-key"></i> Alterar Senha';
        changePasswordBtn.style.marginTop = '10px';
        passwordGroup.appendChild(changePasswordBtn);
        changePasswordBtn.addEventListener('click', showPasswordModal);
      }
    }
  }

  function setupEventListeners() {
    // Click nas imagens → abre modal
    avatarImage.addEventListener('click', () => {
      currentImageType = 'avatar';
      showImageModal();
    });

    bannerImage.addEventListener('click', () => {
      currentImageType = 'banner';
      showImageModal();
    });

    // Ver/ocultar senha (com verificação)
    viewPasswordBtn.addEventListener('click', togglePasswordVisibility);
    const changePasswordBtn = document.getElementById('change-password-btn');
    if (changePasswordBtn) changePasswordBtn.addEventListener('click', showPasswordModal);

    // Form perfil
    formPerfil.addEventListener('submit', handleProfileSubmit);
    cancelBtn.addEventListener('click', resetForm);

    // Fechar modais
    closeModalButtons.forEach((btn) => btn.addEventListener('click', closeAllModals));
    window.addEventListener('click', function (event) {
      if (event.target === passwordModal) passwordModal.style.display = 'none';
      if (event.target === imageModal) imageModal.style.display = 'none';
    });

    // Upload & salvar imagem
    imageUpload.addEventListener('change', handleImageUpload);
    saveImageBtn.addEventListener('click', saveImage);
    cancelImageBtn.addEventListener('click', () => (imageModal.style.display = 'none'));

    // Modal de senha
    document.getElementById('save-password-btn').addEventListener('click', changePassword);
    document.getElementById('cancel-password-btn').addEventListener('click', () => (passwordModal.style.display = 'none'));

    // Máscaras
    addTelefoneMask(fornecedorTelefone);
    addCpfCnpjMask(fornecedorCpf);
  }

  // ======= CARREGAR DADOS =======
  function loadProfileData() {
    // tenta conciliar dados de várias origens
    const fromProfile = JSON.parse(localStorage.getItem('tradeLinkProfile') || '{}');
    const fromUser = JSON.parse(localStorage.getItem('user') || '{}'); // script AUTO-INJECT usa "user"
    const fromRegistro = JSON.parse(localStorage.getItem('tradeLinkRegistro') || '{}');

    // prioridade: profile > user > registro
    const data = { ...fromRegistro, ...fromUser, ...fromProfile };

    // pré-processa documento (cpf/cnpj)
    const doc =
      data.cpf_cnpj ||
      data.documento ||
      data.cpf ||
      data.cnpj ||
      fornecedorCpf.value ||
      '';

    // preencher inputs
    if (data.nome || data.nome_completo) {
      const nome = data.nome || data.nome_completo;
      fornecedorNome.value = nome;
      profileName.textContent = nome;
      headerUserName.textContent = nome;
    }

    if (data.email) fornecedorEmail.value = data.email;
    if (doc) fornecedorCpf.value = formatCpfCnpj(doc);
    if (data.localizacao || data.endereco || data.cidade) {
      const loc = data.localizacao || data.endereco || data.cidade;
      fornecedorLocal.value = loc;
      profileLocation.textContent = loc;
    }
    if (data.telefone || data.celular) {
      fornecedorTelefone.value = formatTelefone(data.telefone || data.celular);
    }
    if (data.descricao || data.bio || data.sobre) {
      const desc = data.descricao || data.bio || data.sobre;
      fornecedorDescricao.value = desc;
      profileDescription.textContent = desc;
    }

    if (data.avatar) {
      avatarImage.src = data.avatar;
      headerUserPic.src = data.avatar;
    }
    if (data.banner) {
      bannerImage.src = data.banner;
    }

    // mantém consistência do tradeLinkProfile
    const keep = {
      nome: fornecedorNome.value,
      email: fornecedorEmail.value,
      cpf_cnpj: fornecedorCpf.value,
      localizacao: fornecedorLocal.value,
      telefone: fornecedorTelefone.value,
      descricao: fornecedorDescricao.value,
      avatar: avatarImage.src,
      banner: bannerImage.src,
    };
    localStorage.setItem('tradeLinkProfile', JSON.stringify({ ...fromProfile, ...keep }));
  }

  // ======= SALVAR DADOS DO FORM =======
  function saveProfileData() {
    const existing = JSON.parse(localStorage.getItem('tradeLinkProfile') || '{}');

    const profileData = {
      ...existing,
      nome: fornecedorNome.value,
      email: fornecedorEmail.value,
      cpf_cnpj: fornecedorCpf.value,
      localizacao: fornecedorLocal.value,
      telefone: fornecedorTelefone.value,
      descricao: fornecedorDescricao.value,
      avatar: avatarImage.src,
      banner: bannerImage.src,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem('tradeLinkProfile', JSON.stringify(profileData));

    // também espelha no "user" (script AUTO-INJECT usa isso)
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(
      'user',
      JSON.stringify({
        ...user,
        nome: profileData.nome,
        email: profileData.email,
        cpf_cnpj: profileData.cpf_cnpj,
        documento: profileData.cpf_cnpj,
        localizacao: profileData.localizacao,
        telefone: profileData.telefone,
        descricao: profileData.descricao,
        avatar: profileData.avatar,
        banner: profileData.banner,
        updatedAt: profileData.updatedAt,
      })
    );

    // atualiza cabeçalho/infos visuais
    headerUserName.textContent = profileData.nome || 'TradeLink';
    headerUserPic.src = profileData.avatar || headerUserPic.src;
    profileName.textContent = profileData.nome || 'Nome do Fornecedor';
    profileLocation.textContent = profileData.localizacao || 'Localização';
    profileDescription.textContent = profileData.descricao || '';

    showToast('Perfil salvo com sucesso!');
  }

  function handleProfileSubmit(e) {
    e.preventDefault();
    // spinner ON
    document.getElementById('submit-text').style.display = 'none';
    document.getElementById('submit-spinner').style.display = 'inline-block';

    setTimeout(() => {
      saveProfileData();
      // spinner OFF
      document.getElementById('submit-text').style.display = 'inline-block';
      document.getElementById('submit-spinner').style.display = 'none';
    }, 400);
  }

  function resetForm() {
    loadProfileData();
    showToast('Alterações canceladas.');
  }

  // ======= MODAL DE IMAGEM =======
  function showImageModal() {
    document.getElementById('image-modal-title').textContent =
      currentImageType === 'avatar' ? 'Alterar Foto de Perfil' : 'Alterar Banner';
    imageUpload.value = '';
    imagePreview.innerHTML = '';
    imagePreviewContainer.style.display = 'none';
    imageFile = null;
    imageModal.style.display = 'flex';
  }

  function handleImageUpload(e) {
    if (e.target.files.length > 0) {
      imageFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = function (ev) {
        imagePreview.innerHTML =
          currentImageType === 'avatar'
            ? `<img src="${ev.target.result}" alt="Preview" style="max-width: 100%; border-radius: 50%;">`
            : `<img src="${ev.target.result}" alt="Preview" style="max-width: 100%;">`;
        imagePreviewContainer.style.display = 'block';
      };
      reader.readAsDataURL(imageFile);
    }
  }

  function saveImage() {
    if (!imageFile) {
      showToast('Selecione uma imagem primeiro.', 'error');
      return;
    }
    const reader = new FileReader();
    reader.onload = function (ev) {
      // aplica na UI
      if (currentImageType === 'avatar') {
        avatarImage.src = ev.target.result;
        headerUserPic.src = ev.target.result;
      } else {
        bannerImage.src = ev.target.result;
      }

      // salva direto no storage (sem depender do submit do form)
      const profileData = JSON.parse(localStorage.getItem('tradeLinkProfile') || '{}');
      const updated = {
        ...profileData,
        avatar: currentImageType === 'avatar' ? ev.target.result : profileData.avatar,
        banner: currentImageType === 'banner' ? ev.target.result : profileData.banner,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('tradeLinkProfile', JSON.stringify(updated));

      // espelha no "user"
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({ ...user, ...updated }));

      imageModal.style.display = 'none';
      showToast('Imagem atualizada com sucesso!');
    };
    reader.readAsDataURL(imageFile);
  }

  // ======= SENHA (VER/ALTERAR) =======
  function togglePasswordVisibility() {
    if (isPasswordRevealed) {
      fornecedorSenha.type = 'password';
      fornecedorSenha.value = '••••••••';
      viewPasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
      isPasswordRevealed = false;
    } else {
      showVerifyPasswordModal();
    }
  }

  function showVerifyPasswordModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'flex';
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-header">
          <h2>Verificar Senha</h2>
          <span class="close">&times;</span>
        </div>
        <div class="modal-body">
          <p>Para visualizar sua senha, digite sua senha atual:</p>
          <div class="form-group">
            <input type="password" id="verify-password-input" required>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" id="cancel-verify-btn">Cancelar</button>
          <button type="button" class="btn btn-primary" id="confirm-verify-btn">Verificar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.close').addEventListener('click', () => modal.remove());
    modal.querySelector('#cancel-verify-btn').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => e.target === modal && modal.remove());

    modal.querySelector('#confirm-verify-btn').addEventListener('click', function () {
      const passwordInput = modal.querySelector('#verify-password-input');
      const storedPassword = localStorage.getItem('tradeLinkPassword');
      if (passwordInput.value === storedPassword) {
        fornecedorSenha.type = 'text';
        fornecedorSenha.value = storedPassword;
        viewPasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        isPasswordRevealed = true;
        modal.remove();
        showToast('Senha revelada', 'success');
      } else {
        showToast('Senha incorreta. Tente novamente.', 'error');
        passwordInput.value = '';
      }
    });
  }

  function showPasswordModal() {
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
    passwordModal.style.display = 'flex';
  }

  function changePassword() {
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const storedPassword = localStorage.getItem('tradeLinkPassword');

    if (currentPassword !== storedPassword) {
      showToast('Senha atual incorreta.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('As novas senhas não coincidem.', 'error');
      return;
    }
    if (newPassword === currentPassword) {
      showToast('A nova senha deve ser diferente da senha atual.', 'warning');
      return;
    }

    localStorage.setItem('tradeLinkPassword', newPassword);
    passwordModal.style.display = 'none';
    showToast('Senha alterada com sucesso!');
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  }

  function closeAllModals() {
    passwordModal.style.display = 'none';
    imageModal.style.display = 'none';
    // remove modais de verificação abertos dinamicamente
    document.querySelectorAll('body > .modal').forEach((m) => {
      if (m.id !== 'password-modal' && m.id !== 'image-modal') m.remove();
    });
  }

  // ======= MÁSCARAS =======
  function onlyDigits(v) {
    return String(v || '').replace(/\D/g, '');
  }

  function formatTelefone(v) {
    let d = onlyDigits(v).slice(0, 11);
    if (d.length <= 10) {
      // (00) 0000-0000
      return d.replace(/(\d{0,2})(\d{0,4})(\d{0,4}).*/, function (_, a, b, c) {
        let out = '';
        if (a) out += `(${a}`;
        if (a.length === 2) out += ') ';
        if (b) out += b;
        if (b.length === 4 && c) out += '-' + c;
        return out;
      });
    } else {
      // (00) 00000-0000
      return d.replace(/(\d{0,2})(\d{0,5})(\d{0,4}).*/, function (_, a, b, c) {
        let out = '';
        if (a) out += `(${a}`;
        if (a.length === 2) out += ') ';
        if (b) out += b;
        if (b.length === 5 && c) out += '-' + c;
        return out;
      });
    }
  }

  function formatCpfCnpj(v) {
    let d = onlyDigits(v);
    if (d.length <= 11) {
      d = d.slice(0, 11);
      // 000.000.000-00
      return d.replace(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*/, function (_, a, b, c, d4) {
        let out = '';
        if (a) out += a;
        if (a.length === 3 && b) out += '.' + b;
        if (b && b.length === 3 && c) out += '.' + c;
        if (c && c.length === 3 && d4) out += '-' + d4;
        return out;
      });
    } else {
      d = d.slice(0, 14);
      // 00.000.000/0000-00
      return d.replace(/(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/, function (_, a, b, c, d4, e) {
        let out = '';
        if (a) out += a;
        if (a.length === 2 && b) out += '.' + b;
        if (b && b.length === 3 && c) out += '.' + c;
        if (c && c.length === 3 && d4) out += '/' + d4;
        if (d4 && d4.length === 4 && e) out += '-' + e;
        return out;
      });
    }
  }

  function addTelefoneMask(input) {
    if (!input) return;
    input.addEventListener('input', () => (input.value = formatTelefone(input.value)));
    // aplica máscara se já vier preenchido
    if (input.value) input.value = formatTelefone(input.value);
  }

  function addCpfCnpjMask(input) {
    if (!input) return;
    input.addEventListener('input', () => (input.value = formatCpfCnpj(input.value)));
    if (input.value) input.value = formatCpfCnpj(input.value);
  }

  // ======= TOAST =======
  function showToast(message, type = 'success') {
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = toast.querySelector('i');

    toastMessage.textContent = message;

    if (type === 'error') {
      toast.className = 'toast error';
      toastIcon.className = 'fas fa-exclamation-circle';
    } else if (type === 'warning') {
      toast.className = 'toast warning';
      toastIcon.className = 'fas fa-exclamation-triangle';
    } else if (type === 'info') {
      toast.className = 'toast info';
      toastIcon.className = 'fas fa-info-circle';
    } else {
      toast.className = 'toast';
      toastIcon.className = 'fas fa-check-circle';
    }

    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }
});

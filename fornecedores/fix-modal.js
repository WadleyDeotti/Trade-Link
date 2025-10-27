
// Arquivo extra NÃO DESTRUTIVO pra corrigir as modais a alteração da foto de perfil/banner
// Adiciona um modal customizado que permite o upload e preview das imagens
// A página original não depende desses fixers para funcionar nada além da modal de alterar imagem
(function(){
  if(window.__fix_modal_installed) return;
  window.__fix_modal_installed = true;

  function createModalDOM(){
    if(document.getElementById('__fix_modal_backdrop')) return;
    const backdrop = document.createElement('div');
    backdrop.id = '__fix_modal_backdrop';
    backdrop.className = 'fix-modal-backdrop';
    backdrop.style.visibility = 'hidden';
    backdrop.innerHTML = `
      <div class="fix-modal" role="dialog" aria-modal="true" aria-labelledby="__fix_modal_title">
        <h3 id="__fix_modal_title">Alterar imagem</h3>
        <div class="fix-modal-body">
          <div class="fix-preview" id="__fix_preview"><img id="__fix_preview_img" alt="Preview"></div>
          <div class="fix-controls">
            <label class="fix-file-label">Selecionar arquivo
              <input id="__fix_file_input" type="file" accept="image/*" style="display:none">
            </label>
            <div style="margin-top:8px;color:#6b7280;font-size:13px">Arraste e solte ou selecione um arquivo.</div>
          </div>
        </div>
        <div class="fix-actions">
          <button id="__fix_cancel" class="fix-btn fix-btn-ghost">Cancelar</button>
          <button id="__fix_save" class="fix-btn fix-btn-primary" disabled>Salvar</button>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);

    const fileInput = document.getElementById('__fix_file_input');
    const previewImg = document.getElementById('__fix_preview_img');
    const previewBox = document.getElementById('__fix_preview');
    const cancelBtn = document.getElementById('__fix_cancel');
    const saveBtn = document.getElementById('__fix_save');

    let currentTargetEl = null;
    let tempData = null;

    function openFor(targetEl, kind){
      currentTargetEl = targetEl;
      tempData = null;
      previewImg.src = '';
      saveBtn.disabled = true;
      const backdrop = document.getElementById('__fix_modal_backdrop');
      backdrop.style.visibility = 'visible';
      backdrop.addEventListener('click', function onb(e){
        if(e.target === backdrop){
          closeModal();
          backdrop.removeEventListener('click', onb);
        }
      });
      document.addEventListener('keydown', onEsc);
    }

    function closeModal(){
      const backdrop = document.getElementById('__fix_modal_backdrop');
      backdrop.style.visibility = 'hidden';
      fileInput.value = '';
      tempData = null;
      currentTargetEl = null;
      document.removeEventListener('keydown', onEsc);
    }

    function onEsc(e){ if(e.key === 'Escape') closeModal(); }

    fileInput.addEventListener('change', function(e){
      const f = e.target.files && e.target.files[0];
      if(!f) return;
      if(!f.type.startsWith('image/')) return alert('Por favor selecione uma imagem.');
      const r = new FileReader();
      r.onload = function(){ tempData = r.result; previewImg.src = tempData; saveBtn.disabled = false; };
      r.readAsDataURL(f);
    });

    previewBox.addEventListener('dragover', function(e){ e.preventDefault(); previewBox.style.opacity = 0.9; });
    previewBox.addEventListener('dragleave', function(e){ previewBox.style.opacity = 1; });
    previewBox.addEventListener('drop', function(e){ e.preventDefault(); previewBox.style.opacity = 1;
      const f = e.dataTransfer.files && e.dataTransfer.files[0]; if(!f) return;
      if(!f.type.startsWith('image/')) return alert('Por favor selecione uma imagem.');
      const r = new FileReader(); r.onload = function(){ tempData = r.result; previewImg.src = tempData; saveBtn.disabled = false; }; r.readAsDataURL(f);
    });

    cancelBtn.addEventListener('click', closeModal);

    saveBtn.addEventListener('click', function(){
      if(!tempData || !currentTargetEl) return;
      const img = currentTargetEl.querySelector('img');
      if(img) img.src = tempData;
      else currentTargetEl.style.backgroundImage = `url('${tempData}')`;

      const ev = new CustomEvent('__fix_image_changed', { detail: { dataUrl: tempData, element: currentTargetEl } });
      document.dispatchEvent(ev);

      closeModal();
    });

    const label = document.querySelector('.fix-file-label');
    if(label){ label.addEventListener('click', ()=>{ fileInput.click(); }); }

    return {
      openFor
    };
  }

  const api = createModalDOM();

  const avatarSelectors = [
    '#avatar', '#avatarImg', '.avatar', '.avatar-wrap', '.profile-avatar', '.user-avatar', '.avatarImg'
  ];
  const bannerSelectors = [
    '#banner', '#bannerImg', '.banner', '.banner-wrap', '.profile-banner', '.user-banner', '.bannerImg'
  ];

  function tryAttach(selList, kind){
    for(const sel of selList){
      const el = document.querySelector(sel);
      if(el){
        let target = el.tagName === 'IMG' && el.parentElement ? el.parentElement : el;
        if(target.__fix_attached) return true;
        target.style.cursor = 'pointer';
        target.addEventListener('click', function(e){
          e.stopPropagation();
          api.openFor(target, kind);
        });
        target.__fix_attached = true;
        return true;
      }
    }
    return false;
  }

  const attachedAvatar = tryAttach(avatarSelectors, 'avatar');
  const attachedBanner = tryAttach(bannerSelectors, 'banner');

  if(!attachedAvatar || !attachedBanner){
    const imgs = Array.from(document.getElementsByTagName('img'));
    for(const img of imgs){
      const alt = (img.alt||'').toLowerCase();
      if(!attachedAvatar && (alt.includes('avatar') || alt.includes('perfil') || alt.includes('profile'))){
        const t = img.parentElement || img;
        if(!t.__fix_attached){
          t.style.cursor = 'pointer';
          t.addEventListener('click', ()=> api.openFor(t,'avatar'));
          t.__fix_attached = true;
          attachedAvatar = true;
        }
      }
      if(!attachedBanner && (alt.includes('banner') || alt.includes('capa'))){
        const t = img.parentElement || img;
        if(!t.__fix_attached){
          t.style.cursor = 'pointer';
          t.addEventListener('click', ()=> api.openFor(t,'banner'));
          t.__fix_attached = true;
          attachedBanner = true;
        }
      }
    }
  }

  const dataAvatar = document.querySelector('[data-avatar]');
  const dataBanner = document.querySelector('[data-banner]');
  if(dataAvatar && !dataAvatar.__fix_attached){
    dataAvatar.style.cursor='pointer';
    dataAvatar.addEventListener('click', ()=> api.openFor(dataAvatar,'avatar'));
    dataAvatar.__fix_attached = true;
  }
  if(dataBanner && !dataBanner.__fix_attached){
    dataBanner.style.cursor='pointer';
    dataBanner.addEventListener('click', ()=> api.openFor(dataBanner,'banner'));
    dataBanner.__fix_attached = true;
  }

  const obs = new MutationObserver((mut)=>{
    tryAttach(avatarSelectors,'avatar');
    tryAttach(bannerSelectors,'banner');
  });
  obs.observe(document.body, { childList:true, subtree:true });

  window.__fix_modal_open = function(el){ api.openFor(el||document.querySelector('.avatar-wrap')||document.querySelector('.banner-wrap')); };

})();

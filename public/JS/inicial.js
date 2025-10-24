// controle dos carrosséis usando transform (sem scrollbars visíveis)
document.addEventListener('DOMContentLoaded', () => {
  // gap definido no CSS (px) — deve acompanhar .track gap
  const GAP = 16;

  // para cada carousel da página
  document.querySelectorAll('.carousel').forEach(car => {
    const track = car.querySelector('.track');
    if (!track) return;

    const parentWrap = car.parentElement;
    const prevBtn = parentWrap.querySelector('.prev');
    const nextBtn = parentWrap.querySelector('.next');

    // obter tamanho do item (primeiro filho) e do container
    function compute() {
      const first = track.children[0];
      const itemRect = first ? first.getBoundingClientRect() : { width: 200 };
      const itemWidth = Math.round(itemRect.width);
      const visibleWidth = Math.round(car.clientWidth);
      const step = itemWidth + GAP;
      const totalWidth = Array.from(track.children).reduce((acc, el) => {
        const r = el.getBoundingClientRect();
        return acc + Math.round(r.width);
      }, 0) + GAP * Math.max(0, track.children.length - 1);

      const maxTranslate = Math.max(0, totalWidth - visibleWidth);
      return { itemWidth, visibleWidth, step, totalWidth, maxTranslate };
    }

    let state = {
      tx: 0 // current translate X (px, >=0 and <= maxTranslate)
    };

    // atualiza posição visual
    function apply() {
      track.style.transform = `translateX(${-state.tx}px)`;
      updateButtons();
    }

    // habilitar/desabilitar botões
    function updateButtons() {
      if (prevBtn) prevBtn.disabled = state.tx <= 5;
      if (nextBtn) {
        const { maxTranslate } = compute();
        nextBtn.disabled = state.tx >= (maxTranslate - 5);
      }
    }

    // ações de clique
    if (prevBtn) prevBtn.addEventListener('click', () => {
      const { step } = compute();
      state.tx = Math.max(0, state.tx - step);
      apply();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      const { step, maxTranslate } = compute();
      state.tx = Math.min(maxTranslate, state.tx + step);
      apply();
    });

    // recalcular em resize
    let t;
    window.addEventListener('resize', () => {
      clearTimeout(t);
      t = setTimeout(() => {
        // ajustar para que não fique fora do limite após resize
        const { maxTranslate } = compute();
        state.tx = Math.min(state.tx, maxTranslate);
        apply();
      }, 120);
    });

    // inicialização
    // small timeout para garantir medidas após render
    setTimeout(() => {
      const { maxTranslate } = compute();
      state.tx = Math.min(state.tx, maxTranslate);
      apply();
    }, 60);
  });
});

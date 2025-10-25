// ==========================
// PERFIL.JS — versão visual
// ==========================

// ------- Toast de mensagens visuais -------
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("visible");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// ------- Modal de Produto -------
const productModal = document.getElementById("product-modal");
const openProductBtns = document.querySelectorAll(".open-product-modal");
const closeProductModal = document.getElementById("close-product-modal");

if (openProductBtns && productModal) {
  openProductBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      productModal.classList.add("visible");
    });
  });
}

if (closeProductModal) {
  closeProductModal.addEventListener("click", () => {
    productModal.classList.remove("visible");
  });
}

// ------- Modal de Edição de Perfil -------
const editProfileModal = document.getElementById("edit-profile-modal");
const openEditProfileBtn = document.getElementById("open-edit-profile");
const closeEditProfileBtn = document.getElementById("close-edit-profile");

if (openEditProfileBtn && editProfileModal) {
  openEditProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.add("visible");
  });
}

if (closeEditProfileBtn) {
  closeEditProfileBtn.addEventListener("click", () => {
    editProfileModal.classList.remove("visible");
  });
}

// ------- Carrossel -------
document.querySelectorAll(".carousel").forEach(carousel => {
  const track = carousel.querySelector(".track");
  const next = carousel.parentElement.querySelector(".next");
  const prev = carousel.parentElement.querySelector(".prev");

  let index = 0;
  const items = track?.children.length || 0;

  if (next && prev && items > 0) {
    next.addEventListener("click", () => {
      index = (index + 1) % items;
      track.style.transform = `translateX(-${index * 100}%)`;
    });

    prev.addEventListener("click", () => {
      index = (index - 1 + items) % items;
      track.style.transform = `translateX(-${index * 100}%)`;
    });
  }
});

// ------- Exemplo de feedback visual -------
document.querySelectorAll(".fake-action").forEach(btn => {
  btn.addEventListener("click", () => {
    showToast("Ação de exemplo — sem dados reais!", "info");
  });
});

console.log("JS visual carregado com sucesso 🎨");

document.addEventListener('DOMContentLoaded', function () {
  // thumbnail -> main image
  document.querySelectorAll('.thumbs img').forEach(function (t) {
    t.addEventListener('click', function () {
      document.querySelectorAll('.thumbs img').forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      var large = t.dataset.large || t.src;
      var main = document.getElementById('currentImage');
      if (main) main.src = large;
    });
  });

  // qty controls
  var qtyInput = document.getElementById('qty');
  var inc = document.getElementById('incQty');
  var dec = document.getElementById('decQty');
  if (inc && dec && qtyInput) {
    inc.addEventListener('click', function () { qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) + 1); });
    dec.addEventListener('click', function () { qtyInput.value = Math.max(1, parseInt(qtyInput.value || 1) - 1); });
  }

  // form submit (placeholder behaviour)
  var purchaseForm = document.getElementById('purchaseForm');
  if (purchaseForm && qtyInput) {
    purchaseForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var qty = Math.max(1, parseInt(qtyInput.value || 1));
      alert('Adicionado ao carrinho: ' + qty + ' unidade(s).');
    });
  }

  var buyNow = document.getElementById('buyNow');
  if (buyNow) {
    buyNow.addEventListener('click', function () {
      alert('Redirecionando para checkout...');
    });
  }
});

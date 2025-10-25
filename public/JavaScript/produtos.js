document.getElementById("formProduto").addEventListener("submit", async (e) => {
    e.preventDefault();

    const produto = {
      nome: document.getElementById("nome").value,
      marca: document.getElementById("marca").value,
      categoria: document.getElementById("categoria").value,
      formato: document.getElementById("formato").value,
      peso: document.getElementById("peso").value,
      preco: document.getElementById("preco").value,
      altura: document.getElementById("altura").value,
      largura: document.getElementById("largura").value,
      comprimento: document.getElementById("comprimento").value
    };

    try {
      const response = await fetch("http://localhost:3000/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto)
      });

      const data = await response.json();
      alert(data.mensagem || "Erro ao cadastrar");

      e.target.reset();
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  });
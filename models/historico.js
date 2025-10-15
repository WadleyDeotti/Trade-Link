class Historico {
  constructor({
    id_historico = null,
    tipo, // 'compra' ou 'venda'
    valor,
    status,
    data,
    id_empresa,
    id_fornecedor
  }) {
    this.id_historico = id_historico;
    this.tipo = tipo;
    this.valor = valor;
    this.status = status;
    this.data = data;
    this.id_empresa = id_empresa;
    this.id_fornecedor = id_fornecedor;
  }
}

module.exports = Historico;

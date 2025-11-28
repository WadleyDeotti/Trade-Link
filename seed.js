import db from './sqlite.js';
import bcrypt from 'bcryptjs';

console.log('🌱 Populando banco de dados com dados de exemplo...');

// Limpar dados existentes
db.exec('DELETE FROM produtos');
db.exec('DELETE FROM fornecedores');
db.exec('DELETE FROM empresas');

// Criar fornecedor de exemplo
const senhaHash = bcrypt.hashSync('123456', 10);

const fornecedor = db.prepare(`
  INSERT INTO fornecedores (nome_fantasia, cpf, email, senha_hash, telefone, localizacao, descricao)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'Tech Solutions',
  '12345678901',
  'fornecedor@exemplo.com',
  senhaHash,
  '(11) 99999-9999',
  'São Paulo, SP',
  'Fornecedor de equipamentos eletrônicos e tecnologia'
);

const id_fornecedor = fornecedor.lastInsertRowid;

// Criar produtos de exemplo
const produtos = [
  {
    nome: 'Notebook Dell Inspiron',
    descricao: 'Notebook para uso profissional com 8GB RAM e SSD 256GB',
    preco: 2500.00,
    categoria: 'eletronicos'
  },
  {
    nome: 'Mouse Wireless Logitech',
    descricao: 'Mouse sem fio com precisão óptica e bateria de longa duração',
    preco: 89.90,
    categoria: 'eletronicos'
  },
  {
    nome: 'Teclado Mecânico RGB',
    descricao: 'Teclado mecânico com iluminação RGB e switches blue',
    preco: 299.99,
    categoria: 'eletronicos'
  },
  {
    nome: 'Monitor 24" Full HD',
    descricao: 'Monitor LED 24 polegadas com resolução Full HD',
    preco: 599.00,
    categoria: 'eletronicos'
  },
  {
    nome: 'Camiseta Polo',
    descricao: 'Camiseta polo masculina 100% algodão',
    preco: 79.90,
    categoria: 'roupas'
  }
];

const insertProduto = db.prepare(`
  INSERT INTO produtos (id_fornecedor, nome_produto, descricao, preco, categoria)
  VALUES (?, ?, ?, ?, ?)
`);

produtos.forEach(produto => {
  insertProduto.run(id_fornecedor, produto.nome, produto.descricao, produto.preco, produto.categoria);
});

// Criar empresa de exemplo
const empresa = db.prepare(`
  INSERT INTO empresas (nome_fantasia, cnpj, email, senha_hash, telefone, localizacao, descricao)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(
  'Empresa Exemplo Ltda',
  '12345678000199',
  'empresa@exemplo.com',
  senhaHash,
  '(11) 88888-8888',
  'Rio de Janeiro, RJ',
  'Empresa de exemplo para testes do sistema'
);

console.log('✅ Dados de exemplo criados com sucesso!');
console.log('📧 Login fornecedor: fornecedor@exemplo.com | Senha: 123456');
console.log('📧 Login empresa: empresa@exemplo.com | Senha: 123456');
console.log(`📦 ${produtos.length} produtos criados`);

process.exit(0);
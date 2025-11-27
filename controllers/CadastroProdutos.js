import { ExportSourceType } from '@aws-sdk/client-sesv2';
import produto from '../repository/ProdutoRepository.js';
import bcrypt from 'bcrypt';

// Função para cadastrar um novo produto
export const cadastrarProduto = async (req, res) => {
  try {
    const { nome, preco} = req.body;

    // Monta o objeto produto
    const produto = {
      nome,
      preco
    };

    // Chama a função do repository que faz o INSERT no banco
    const resultado = await repository.inserirProduto(produto);

    console.log('Produto inserido com sucesso!', resultado);
    res.status(200).redirect('/produtos'); // redireciona para a lista de produtos
  } catch (error) {
    console.error('Erro ao inserir produto:', error);
    res.status(500).send('Erro ao cadastrar produto');
  }
};


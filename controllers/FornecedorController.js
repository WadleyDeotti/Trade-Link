const repository = require('../repository/fornecedoresRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');
const fornecedoresRepository = require('../repository/fornecedoresRepository');



  // Método para atualizar um fornecedor
  exports.update = async(req, res) => {
    try {
      const { nome_fantasia, cpf, email, senha_hash, telefone, endereco } = req.body;

      // Verifica se todos os campos obrigatórios foram informados
      if (!nome_fantasia || !cpf || !email || !senha_hash) {
        return res.status(400).json({ message: 'Campos obrigatórios não informados.' });
      }

      // Monta o objeto com os dados a atualizar
      const fornecedor = {
        nome_fantasia,
        cpf,
        email,
        senha_hash,
        telefone,
        endereco,
      };

      const resultado = await fornecedorRepository.update(id_fornecedor, fornecedor);

      if (resultado.affectedRows === 0) {
        return res.status(404).json({ message: 'Fornecedor não encontrado.' });
      }

      return res.status(200).json({ message: 'Fornecedor atualizado com sucesso!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao atualizar fornecedor.' });
    }
  };



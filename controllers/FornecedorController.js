const repository = require('../repository/usuarioRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');
const usuarioRepository = require('../repository/usuarioRepository');

const fornecedorController = {
  async getAll(req, res) {
    try {
      const fornecedores = await usuarioRepository.getAll();
      res.status(200).json(fornecedores);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar fornecedores', error });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const fornecedor = await usuarioRepository.getById(id);

      if (!fornecedor) {
        return res.status(404).json({ message: 'Fornecedor não encontrado' });
      }

      res.status(200).json(fornecedor);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar fornecedor', error });
    }
  },

  async create(req, res) {
    try {
      const novoFornecedor = await usuarioRepository.create(req.body);
      res.status(201).json(novoFornecedor);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar fornecedor', error });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const fornecedorAtualizado = await usuarioRepository.update(id, req.body);
      res.status(200).json(fornecedorAtualizado);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar fornecedor', error });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;
      await usuarioRepository.remove(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Erro ao deletar fornecedor', error });
    }
  }
};

module.exports = fornecedorController;
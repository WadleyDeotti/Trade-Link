const repository = require('../repository/fornecedoresRepository');
const bcrypt  = require('bcrypt');
const crypto  = require('crypto');
const nodemailer = require('nodemailer');
const session = require('express-session');
const fornecedoresRepository = require('../repository/fornecedoresRepository');



  // Método para atualizar um fornecedor
  
  
    if (usuario.id_fornecedor) {
      try {
        // Atualiza no banco usando repository com async/await
        await repository.updateFornecedor({

          telefone,
          endereco,
          email,
          id_fornecedor: usuario.id_fornecedor
        });
  
        // Atualiza os dados na sessão
        await atualizarSessaoUsuario(req);
        console.log('Usuário atualizado com sucesso');
        res.redirect("/fornecedores");
  
      } catch (err) {
        console.error('Erro ao atualizar usuário:', err);
        res.status(500).send('Erro ao atualizar usuário');
      }
    }



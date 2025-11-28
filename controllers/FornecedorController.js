import repository from '../repository/fornecedoresRepository.js';
import conexao from '../database/conexao.js';

// Função auxiliar para tratar valores vazios
const safe = val => (val === undefined || val === '' ? null : val);

// ===================================================
// ✏️ Atualizar Fornecedor
// ===================================================
async function atualizarFornecedor(req, res) {
  try {
    const { id_fornecedor, telefone, endereco, email } = req.body;


    // Atualiza no banco usando repository
    await repository.updateFornecedor({
      id_fornecedor,
      telefone: safe(telefone),
      endereco: safe(endereco),
      email: safe(email)
    });

    // Atualiza sessão se o usuário logado for o mesmo fornecedor
    if (req.session && req.session.usuario) {
      req.session.usuario = {
        ...req.session.usuario,
        telefone,
        endereco,
        email
      };
    }

    console.log('✅ Fornecedor atualizado com sucesso!');
    res.redirect("/fornecedores");
  } catch (err) {
    console.error('❌ Erro ao atualizar fornecedor:', err);
    res.status(500).send('Erro ao atualizar fornecedor');
  }
}


export { atualizarFornecedor };
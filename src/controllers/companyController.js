const { Empresa } = require('../models'); 

exports.createCompany = async (req, res) => {
  try {
    const { cnpj, razaoSocial, atividadesExercidas, capitalSocial, endereco, email, telefone, socios } = req.body;
    const newCompany = await Empresa.create({
      cnpj,
      razao_social: razaoSocial,
      atividades_exercidas: atividadesExercidas,
      capital_social: capitalSocial,
      endereco,
      email,
      telefone,
      socios,
    });
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar empresa', error });
  }
};

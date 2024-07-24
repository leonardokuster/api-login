const { Funcionario } = require('../models'); 

exports.createEmployee = async (req, res) => {
  try {
    const {
      nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
      nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
      complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
      estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
      carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
      funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
      periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales, empresa_id
    } = req.body;
    const newEmployee = await Funcionario.create({
      nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
      nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
      complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
      estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
      carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
      funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
      periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales, empresa_id
    });
    res.status(201).json(newEmployee);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar funcionário', error });
  }
};

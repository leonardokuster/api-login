const AppService = require('../services/appService');
const appService = new AppService();

class EmployeeController {
    static async cadastrarFuncionario(req, res) {
        const {
            nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
            nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
            complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
            estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
            carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
            funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
            periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
        } = req.body;

        if ( nome === "" || email === "" || telefone === "" || sexo === "" || cor_etnia === "" || data_nascimento === "" || local_nascimento === "" || nacionalidade === "" || cpf === "" || cep === "" || endereco === "" || numero_casa === "" || bairro === "" || cidade === "" || estado === "" || nome_mae === "" || escolaridade === "" || estado_civil === "" || serie === "" || data_pis === "" || numero_ct === "" || data_ct === "" || qnt_dependente === "" || funcao === "" || data_admissao === "" || salario === "" || horarios === "" ) {
            throw new Error('Não foi possível cadastrar funcionário, verifique os dados informados.');
        };

        try {
            const newEmployee = await appService.cadastrarFuncionario({nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento, nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa, complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade, estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct, carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes, funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade, periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales});

            res.status(201).json({
                newEmployee,
                message: 'Funcionário registrado com sucesso!'
            });
          } catch (error) {
            res.status(400).json({ message: 'Erro ao registrar funcionário', error });
          }
    };
}

module.exports = EmployeeController
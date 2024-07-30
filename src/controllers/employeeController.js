const AppService = require('../services/appService');
const appService = new AppService();
const moment = require('moment');

class EmployeeController {
    static async cadastrarFuncionario(req, res) {
        const {
            nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
            nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
            complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
            estado_civil, nome_conjuge, pis, numero_ct, serie, data_ct,
            carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
            funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
            periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
        } = req.body;

        const { empresa_id } = req.params;

        console.log('Dados recebidos:', req.body);
        console.log('Empresa ID:', empresa_id);

        if (!empresa_id) {
            return res.status(400).json({ message: 'ID da empresa não informado.' });
        }

        if (!nome || !email || !telefone || !sexo || !cor_etnia || !data_nascimento || !local_nascimento || !nacionalidade || !cpf || !cep || !endereco || !numero_casa || !bairro || !cidade || !estado || !nome_mae || !escolaridade || !estado_civil || !serie || !numero_ct || !data_ct || !funcao || !data_admissao || !salario || !horarios) {
            return res.status(400).json({ message: 'Não foi possível cadastrar funcionário, verifique os dados informados.' });
        }

        const formatDate = date => {
            return moment(date, 'DD/MM/YYYY').format('YYYY-MM-DD');
        };

        const formattedDataNascimento = formatDate(data_nascimento);
        const formattedDataRg = data_rg ? formatDate(data_rg) : null;
        const formattedDataCt = formatDate(data_ct);
        const formattedDataAdmissao = formatDate(data_admissao);

        if (dependentes) {
            if (!Array.isArray(dependentes)) {
                return res.status(400).json({ message: 'Dependentes devem ser um array.' });
            }
            for (const dependente of dependentes) {
                const { nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente } = dependente;
                if (!nomeDependente || !dataNascimentoDependente || !cpfDependente || !localNascimentoDependente) {
                    return res.status(400).json({ message: 'Dados dos dependentes estão incompletos.' });
                }
            }
        }

        try {
            const newEmployee = await appService.cadastrarFuncionario({
                nome, email, telefone, sexo, cor_etnia, data_nascimento: formattedDataNascimento, local_nascimento,
                nacionalidade, cpf, rg, orgao_expedidor, data_rg: formattedDataRg, cep, endereco, numero_casa,
                complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
                estado_civil, nome_conjuge, pis, numero_ct, serie, data_ct: formattedDataCt,
                carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
                funcao, data_admissao: formattedDataAdmissao, salario, contrato_experiencia, horarios, insalubridade,
                periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
            }, empresa_id);

            res.status(201).json({
                newEmployee,
                message: 'Funcionário registrado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error);
            res.status(400).json({ message: 'Erro ao registrar funcionário', error });
        }
    };

    static async editarFuncionario(req, res) {
        const { empresa_id } = req.params;

        const {
            nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
            nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
            complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
            estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
            carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
            funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
            periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
        } = req.body;

        try {
            const employee = await appService.editarFuncionario({
                nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
                nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
                complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
                estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
                carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
                funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
                periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
            }, empresa_id);

            res.status(200).json(employee);
        } catch (error) {
            console.log('Message error:', error.message);
            res.status(400).send({ message: error.message });
        }
    }
}

module.exports = EmployeeController;
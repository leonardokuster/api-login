const AppService = require('../services/appService');
const appService = new AppService();
const moment = require('moment');

class EmployeeController {
    static async cadastrarFuncionario(req, res) {
        const {
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento,
            nacionalidade, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
            complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
            estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt,
            carteiraDigital, tituloEleitoral, zona, secao, qntDependente, dependentes,
            funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
            periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales, empresa_id
        } = req.body;

        console.log('Dados recebidos:', req.body);

        if (!empresa_id) {
            return res.status(400).json({ message: 'ID da empresa não informado.' });
        }

        if (!nome || !email || !telefone || !sexo || !corEtnia || !dataNascimento || !localNascimento || !nacionalidade || !cpf || !cep || !endereco || !numeroCasa || !bairro || !cidade || !estado || !nomeMae || !escolaridade || !estadoCivil || !serie || !numeroCt || !dataCt || !funcao || !dataAdmissao || !salario || !horarios) {
            return res.status(400).json({ message: 'Não foi possível cadastrar funcionário, verifique os dados informados.' });
        };

        try {
            const newEmployee = await appService.cadastrarFuncionario({
                nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento,
                nacionalidade, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
                complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
                estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt,
                carteiraDigital, tituloEleitoral, zona, secao, qntDependente, dependentes,
                funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
                periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
            }, empresa_id);

            res.status(201).json({
                newEmployee,
                message: 'Funcionário registrado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao cadastrar funcionário no controller:', error);
            res.status(500).json({ message: 'Erro ao cadastrar funcionário', details: error.message });
        }
    };

    static async editarFuncionario(req, res) {
        const { empresa_id } = req.params;

        const {
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento,
            nacionalidade, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
            complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
            estadoCivil, nomeConjuge, pis, dataPis, numeroCt, serie, dataCt,
            carteiraDigital, tituloEleitoral, zona, secao, qntDependente, dependentes,
            funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
            periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
        } = req.body;

        try {
            const employee = await appService.editarFuncionario({
                nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento,
                nacionalidade, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
                complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
                estadoCivil, nomeConjuge, pis, dataPis, numeroCt, serie, dataCt,
                carteiraDigital, tituloEleitoral, zona, secao, qntDependente, dependentes,
                funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
                periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
            }, empresa_id);

            res.status(200).json(employee);
        } catch (error) {
            console.log('Message error:', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = EmployeeController;
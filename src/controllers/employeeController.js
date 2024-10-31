const AppService = require('../services/appService');
const appService = new AppService();

class EmployeeController {
    static async cadastrarFuncionario(req, res) {
        const {
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
            estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
            periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales, empresa_id
        } = req.body;

        console.log('Dados recebidos:', req.body);
        console.log('ID Empresa:', empresa_id);

        if (!empresa_id) {
            return res.status(400).json({ message: 'ID da empresa não informado.' });
        }

        if (!nome || !email || !telefone || !sexo || !corEtnia || !dataNascimento || !localNascimento || !cpf || !cep || !endereco || !numeroCasa || !bairro || !cidade || !estado || !nomeMae || !escolaridade || !estadoCivil || !serie || !numeroCt || !dataCt || !funcao || !dataAdmissao || !salario || !horarios) {
            return res.status(400).json({ message: 'Não foi possível cadastrar funcionário, verifique os dados informados.' });
        };

        try {
            const newEmployee = await appService.cadastrarFuncionario({
                nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade, periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
            }, empresa_id);

            res.status(201).json({
                success: true,
                newEmployee,
                message: 'Funcionário registrado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao cadastrar funcionário no controller:', error);
            res.status(500).json({ sucess: false, message: 'Erro ao cadastrar funcionário', details: error.message });
        }
    };

    static async editarFuncionario(req, res) {
        const { empresa_id } = req.params;

        const {
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade,
            estadoCivil, nomeConjuge, pis, dataPis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade, periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
        } = req.body;

        try {
            const employee = await appService.editarFuncionario({
                nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge, pis, dataPis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
                periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
            }, empresa_id);

            res.status(200).json(employee);
        } catch (error) {
            console.log('Message error:', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async buscarFuncionarios(req, res) {
        const empresa_id = req.params.empresa_id;
        
        try {
            console.log(`Iniciando busca de funcionários para a empresa: ${empresa_id}`);
        
            const funcionarios = await appService.buscarFuncionariosPorEmpresaId(empresa_id); 
        
            if (!funcionarios || funcionarios.length === 0) {
                console.log(`Nenhum funcionário encontrado para a empresa: ${empresa_id}`);
                return res.status(404).json({ message: 'Nenhum funcionário cadastrado' });
            }
    
            console.log(`Funcionários encontrados para a empresa: ${empresa_id}`);
            res.status(200).json(funcionarios);
        } catch (error) {
            console.error('Erro ao buscar funcionários:', error.stack);
    
            if (error.message.includes('Nenhum funcionário encontrado para a empresa associada')) {
                return res.status(404).json({ message: 'Nenhum funcionário cadastrado, volte para cadastrar.' });
            }
    
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };

    static async removerFuncionario(req, res) {
        const { funcionario_id } = req.params;

        if (!funcionario_id) {
            return res.status(400).json({ message: 'ID do funcionário não informado.' });
        }

        try {
            const result = await appService.removerFuncionario(funcionario_id);

            res.status(200).json({ message: result.message });
        } catch (error) {
            console.error('Erro ao remover funcionário no controller:', error);

            if (error.message.includes('Funcionário não encontrado')) {
                return res.status(404).json({ message: 'Funcionário não encontrado.' });
            }

            res.status(500).json({ message: 'Erro interno do servidor', details: error.message });
        }
    };
}

module.exports = EmployeeController;
const AppService = require('../services/appService');
const appService = new AppService();

class RelativeController {
    static async cadastrarDependente(req, res) {
        const {
            nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente, funcionario_id
        } = req.body;

        console.log('Dados recebidos:', req.body);
        console.log('ID Funcionário:', funcionario_id);

        if (!funcionario_id) {
            return res.status(400).json({ message: 'ID do funcionário não informado.' });
        }

        if (!nomeDependente || !dataNascimentoDependente || !cpfDependente || !localNascimentoDependente) {
            return res.status(400).json({ message: 'Não foi possível cadastrar dependente, verifique os dados informados.' });
        };

        try {
            const newRelative = await appService.adicionarDependente(funcionario_id, {
                nomeDependente,
                dataNascimentoDependente,
                cpfDependente,
                localNascimentoDependente
            });         

            res.status(201).json({
                newRelative,
                message: 'Dependente registrado com sucesso!'
            });
        } catch (error) {
            console.error('Erro ao cadastrar dependente no controller:', error);
            res.status(500).json({ message: 'Erro ao cadastrar dependente', details: error.message });
        }
    };

    static async editarDependente(req, res) {
        const { funcionario_id } = req.params;

        const {
            nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente
        } = req.body;

        try {
            const relative = await appService.editarDependente({
                nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente
            }, funcionario_id);

            res.status(200).json(relative);
        } catch (error) {
            console.log('Message error:', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async buscarDependentes(req, res) {
        const funcionario_id = req.params.funcionario_id;
        
        if (!funcionario_id) {
            return res.status(400).json({ message: 'ID do funcionário não informado.' });
        }
    
        try {
            const funcionarioIds = funcionario_id.split(',');
            const dependentes = await appService.buscarDependentesPorFuncionarioIds(funcionarioIds);
    
            if (!dependentes || dependentes.length === 0) {
                return res.status(404).json({ message: 'Nenhum dependente cadastrado' });
            }
    
            res.status(200).json(dependentes);
        } catch (error) {
            console.error('Erro ao buscar dependentes:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };    

    static async removerDependente(req, res) {
        const { dependente_id } = req.params;

        if (!dependente_id) {
            return res.status(400).json({ message: 'ID do dependente não informado.' });
        }

        try {
            const result = await appService.removerDependente(dependente_id);

            res.status(200).json({ message: result.message });
        } catch (error) {
            console.error('Erro ao remover dependente no controller:', error);

            if (error.message.includes('Dependente não encontrado')) {
                return res.status(404).json({ message: 'Dependente não encontrado.' });
            }

            res.status(500).json({ message: 'Erro interno do servidor', details: error.message });
        }
    };
}

module.exports = RelativeController;
const AppService = require('../services/appService');
const appService = new AppService();

class CompanyController {
    static async criarEmpresa(req, res) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = req.body;

        const usuario_id = req.user.id;

        if (!cnpj || !nome_fantasia || !razao_social || !atividades_exercidas || !capital_social || !endereco || !email || !telefone || !socios) {
            throw new Error('Dados incompletos para cadastro da empresa.');
        }

        try {
            const newCompany = await appService.criarEmpresa({
              cnpj,
              nome_fantasia,
              razao_social, 
              atividades_exercidas,
              capital_social,
              endereco,
              email,
              telefone,
              socios,
            }, usuario_id);
            res.status(201).json({
                newCompany,
                message: 'Os dados de sua empresa foram enviados para análise, em breve enviaremos um e-mail com maiores informações.'
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar empresa', error });
        }
    };

    static async buscarEmpresa(req, res) {
        const usuario_id = req.user.id;
        
        try {
            const company = await appService.buscarEmpresa(usuario_id);
            res.status(200).json(company);
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };

    static async editarEmpresa(req, res) {
        const usuario_id = req.user.id;
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = req.body;
        
        try {
            const company = await appService.editarEmpresa({ cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios}, usuario_id);
            
            res.status(200).json(company);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = CompanyController
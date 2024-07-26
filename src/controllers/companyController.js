const AppService = require('../services/appService');
const appService = new AppService();

class CompanyController {
    static async criarEmpresa(req, res) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = req.body;

        if ( cnpj === "" || nome_fantasia === "" || razao_social === "" || atividades_exercidas === "" || capital_social === "" || endereco === "" || email === "" || telefone === "" || socios === "" ) {
            throw new Error('Não foi possível realizar o cadastro de sua empresa, verifique os dados informados.');
        };

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
            });
            res.status(201).json({
                newCompany,
                message: 'Os dados de sua empresa foram enviados para análise, em breve enviaremos um e-mail com maiores informações.'
            });
          } catch (error) {
            res.status(500).json({ message: 'Erro ao criar empresa', error });
          }
    };
}

module.exports = CompanyController
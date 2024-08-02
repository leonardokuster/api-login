const AppService = require('../services/appService');
const appService = new AppService();

class CompanyController {
    static async criarEmpresa(req, res) {
        const { cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep, endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa, qntSocios, socios, usuario_id } = req.body;
    
        if (!cnpj || !nomeFantasia || !razaoSocial || !atividadesExercidas || !capitalSocial || !cep || !endereco || !numeroEmpresa || !complementoEmpresa || !emailEmpresa || !telefoneEmpresa || !nomeSocio || !usuario_id) {
            return res.status(400).json({ message: 'Dados incompletos para cadastro da empresa.' });
        }
    
        try {
            const newCompany = await appService.criarEmpresa({
                cnpj,
                nomeFantasia,
                razaoSocial,
                atividadesExercidas,
                capitalSocial,
                cep,
                endereco,
                numeroEmpresa,
                complementoEmpresa,
                emailEmpresa,
                telefoneEmpresa,
                qntSocios,
                socios,
            }, usuario_id);
    
            res.status(201).json({
                newCompany,
                message: 'Empresa criada e associada ao usuário com sucesso.'
            });
        } catch (error) {
            res.status(500).json({ message: 'Erro ao criar empresa', error });
        }
    };    

    static async buscarEmpresa(req, res) {
        const usuario_id = req.params.usuario_id;
    
        try {
            console.log(`Iniciando busca de empresa para o usuário: ${usuario_id}`);
            const empresa = await appService.buscarEmpresa(usuario_id);
    
            if (!empresa) {
                console.log(`Empresa não encontrada para o usuário: ${usuario_id}`);
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }
    
            console.log(`Empresa encontrada para o usuário: ${usuario_id}`);
            res.status(200).json(empresa);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };   

    static async editarEmpresa(req, res) {
        const empresa_id = req.params.id;
        const { cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep, endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa, qntSocios, socios: sociosData } = req.body;
        
        try {
            const company = await appService.editarEmpresa({
                id: empresa_id,
                cnpj,
                nomeFantasia,
                razaoSocial,
                atividadesExercidas,
                capitalSocial,
                cep,
                endereco,
                numeroEmpresa,
                complementoEmpresa,
                emailEmpresa,
                telefoneEmpresa,
                qntSocios,
                socios,
            });
            
            res.status(200).json(company);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = CompanyController
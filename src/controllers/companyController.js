const AppService = require('../services/appService');
const appService = new AppService();

class CompanyController {
    static async criarEmpresa(req, res) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, nome_socios, usuario_id } = req.body;
    
        if (!cnpj || !nome_fantasia || !razao_social || !atividades_exercidas || !capital_social || !endereco || !email || !telefone || !nome_socios || !usuario_id) {
            return res.status(400).json({ message: 'Dados incompletos para cadastro da empresa.' });
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
                nome_socios
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
            const usuario = await appService.buscarUsuario(usuario_id);
    
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
    
            if (!usuario.possuiEmpresa) {
                return res.status(404).json({ message: 'Usuário não possui uma empresa' });
            }
    
            const company = await appService.buscarEmpresa(usuario.empresa_id);
    
            if (!company) {
                return res.status(404).json({ message: 'Empresa não encontrada' });
            }
    
            res.status(200).json(company);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };
    

    static async editarEmpresa(req, res) {
        const empresa_id = req.params.id;
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, nome_socios } = req.body;
        
        try {
            const company = await appService.editarEmpresa({
                id: empresa_id,
                cnpj,
                nome_fantasia,
                razao_social,
                atividades_exercidas,
                capital_social,
                endereco,
                email,
                telefone,
                nome_socios
            });
            
            res.status(200).json(company);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = CompanyController
const AppService = require('../services/appService');
const appService = new AppService();

class CollaboratorController {
    static async buscarTodosUsuarios(req, res) {
        const usuarios = await appService.buscarTodosUsuarios();
        
        res.status(200).json(usuarios);
    };

    static async buscarUsuarioPorCpfCnpj(req, res) {
        const { cpfCnpj } = req.params;

        try {
            const usuario = await appService.buscarUsuarioPorCpfCnpj(cpfCnpj);
            
            res.status(200).json(usuario); 
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = CollaboratorController
const AppService = require('../services/appService');
const appService = new AppService();

class CollaboratorController {
    static async index(req, res) {
        return res.status(200).json({ok: 'Bem-vindo colaborador'});
    }

    static async buscarTodosUsuarios(req, res) {
        const usuarios = await appService.buscarTodosUsuarios();
        
        res.status(200).json(usuarios);
    };

    static async buscarUsuarioPorId(req, res) {
        const { id } = req.params;

        try {
            const usuario = await appService.buscarUsuarioPorId(id);
            
            res.status(200).json(usuario); 
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = CollaboratorController
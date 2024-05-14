const AppService = require('../services/appService');
const appService = new AppService();

class AdminController {
    static async index(req, res) {
        return res.status(200).json({ok: 'Bem-vindo administrador'});
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

    static async deletarUsuarioPorId(req, res) {
        const { id } = req.params;
        
        try {
            await appService.deletarUsuarioPorId(id);
            
            res.status(200).send({ message: 'Usuário deletado com sucesso!' });
            
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async editarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, senha, tipo } = req.body;
        
        try {
            const usuario = await appService.editarUsuario({ id, nome, email, senha, tipo });
            
            res.status(200).json(usuario);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = AdminController
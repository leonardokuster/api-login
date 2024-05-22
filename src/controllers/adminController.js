const AppService = require('../services/appService');
const appService = new AppService();

class AdminController {
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

    static async deletarUsuarioPorCpfCnpj(req, res) {
        const { cpfCnpj } = req.params;
        
        try {
            await appService.deletarUsuarioPorCpfCnpj(cpfCnpj);
            
            res.status(200).send({ message: 'Usuário deletado com sucesso!' });
            
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async editarUsuario(req, res) {
        const { id } = req.params;
        const { nome, email, telefone, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha, tipo } = req.body;
        
        try {
            const usuario = await appService.editarUsuario({ id, nome, email, telefone, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha, tipo });
            
            res.status(200).json(usuario);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = AdminController
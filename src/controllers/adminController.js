const AppService = require('../services/appService');
const appService = new AppService();

class AdminController {
    static async index(req, res) {
        return res.status(200).json({ok: 'Bem-vindo administrador'});
    }

    static async cadastrarUsuario(req, res) {
        const { nome, email, senha, confisenha } = req.body;

        if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "") {
            throw new Error('Não foi possível realizar seu cadastro, verifique os dados informados.');
        };

        try {
            const usuario = await appService.cadastrarUsuario({ nome, email, senha });
            
            res.status(201).json( {
                usuario,
                message: 'Conta criada com sucesso! Verifique seu e-mail com os dados de login.'
            });
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };

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
const UsuarioService = require('../services/usuarioService');
const usuarioService = new UsuarioService();

class UsuarioController {
    static async logarUsuario(req, res) {
        const { email, senha } = req.body;
    
        try {
            const usuario = await usuarioService.logarUsuario({ email, senha });
            
            if (usuario.tipo === 'admin') {
                res.send('Administrador!!!!');
            } else if (usuario.tipo === 'normal') {
                res.render('normal', { nome: usuario.nome });
            } else {
                return res.status(403).send({ message: 'Usuário inválido.' });
            }
        } catch (error) {
            console.error('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };    

    static async cadastrarUsuario(req, res) {
        const { nome, email, senha, confisenha } = req.body;

        if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "") {
            throw new Error('Não foi possível realizar seu cadastro, verifique os dados informados.');
        };

        try {
            const usuario = await usuarioService.cadastrarUsuario({ nome, email, senha });
            
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
        const usuarios = await usuarioService.buscarTodosUsuarios();
        
        res.status(200).json(usuarios);
    };

    static async buscarUsuarioPorId(req, res) {
        const { id } = req.params;

        try {
            const usuario = await usuarioService.buscarUsuarioPorId(id);
            
            res.status(200).json(usuario); 
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async deletarUsuarioPorId(req, res) {
        const { id } = req.params;
        
        try {
            await usuarioService.deletarUsuarioPorId(id);
            
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
            const usuario = await usuarioService.editarUsuario({ id, nome, email, senha, tipo });
            
            res.status(200).json(usuario);
        } catch (error) {
            console.log('Message error: ', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = UsuarioController
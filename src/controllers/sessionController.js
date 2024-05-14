const jwt = require('jsonwebtoken');
const { adminToken } = require("../config/adminToken");
const { collaboratorToken } = require("../config/collaboratorToken");
const { userToken } = require("../config/userToken");
const AppService = require('../services/appService');
const appService = new AppService();

class SessionController {
    static async index(req, res) {
        const { tipo } = req.body;
        let token;

        if (tipo === 'admin') {
            token = jwt.sign({ tipo: 'admin' }, adminToken.secret, { expiresIn: adminToken.expiresIn });
        } else if (tipo === 'collaborator') {
            token = jwt.sign({ tipo: 'collaborator' }, collaboratorToken.secret, { expiresIn: collaboratorToken.expiresIn });
        } else if (tipo === 'user') {
            token = jwt.sign({ tipo: 'user' }, userToken.secret, { expiresIn: userToken.expiresIn });
        } else {
            return res.status(401).json({ error: 'Não autorizado' });
        }

        return res.status(200).json({ token });
    };

    static async logarUsuario(req, res) {
        const { email, senha } = req.body;
        
        try {
            const { usuario, token } = await appService.logarUsuario({ email, senha });

            res.status(201).json({ usuario, token });
        } catch (error) {
            console.error('Erro ao fazer login:', error.message);
            res.status(400).send({ message: error.message });
        }
    };

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
}

module.exports = SessionController

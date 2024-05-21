const jwt = require('jsonwebtoken');
const adminToken = require("../config/adminToken");
const collaboratorToken = require("../config/collaboratorToken");
const userToken = require("../config/userToken");
const AppService = require('../services/appService');
const appService = new AppService();

console.log('adminToken:', adminToken);
console.log('collaboratorToken:', collaboratorToken);
console.log('userToken:', userToken);

class SessionController {
    static async logarUsuario(req, res) {
        const { email, senha } = req.body;
        
        try {
            const { usuario, tipo } = await appService.logarUsuario({ email, senha });

            let token;

            if (tipo === 'admin') {
                token = jwt.sign({ id: usuario._id, tipo: 'admin' }, adminToken.secret, { expiresIn: adminToken.expiresIn });
            } else if (tipo === 'collaborator') {
                token = jwt.sign({ id: usuario._id, tipo: 'collaborator' }, collaboratorToken.secret, { expiresIn: collaboratorToken.expiresIn });
            } else if (tipo === 'user') {
                token = jwt.sign({ id: usuario._id, tipo: 'user' }, userToken.secret, { expiresIn: userToken.expiresIn });
            } else {
                return res.status(401).json({ error: 'Não autorizado' });
            }

            res.status(201).json({ usuario, token });
        } catch (error) {
            console.error('Erro ao fazer login:', error.message);
            res.status(400).send({ message: error.message });
        }
    };

    static async cadastrarUsuario(req, res) {
        const { nome, email, telefone, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha, confisenha } = req.body;

        if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "" || telefone === "" || cpfCnpj === "" || cep === "" || endereco === "" || dataNascimento === "") {
            throw new Error('Não foi possível realizar seu cadastro, verifique os dados informados.');
        };

        try {
            const usuario = await appService.cadastrarUsuario({ nome, email, telefone, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha });
            
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

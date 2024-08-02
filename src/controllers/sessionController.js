const jwt = require('jsonwebtoken');
const adminToken = require("../config/adminToken");
const collaboratorToken = require("../config/collaboratorToken");
const userToken = require("../config/userToken");
const AppService = require('../services/appService');
const appService = new AppService();

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
        const {
            nome, emailPessoal, telefonePessoal, cpf, dataNascimento, possuiEmpresa,
            cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep,
            endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa,
            qntSocios, socios, senha, confisenha
        } = req.body;
    
        if (senha !== confisenha || !nome || !emailPessoal || !senha || !confisenha || !telefonePessoal || !cpf || !dataNascimento) {
            return res.status(400).send({ message: 'Não foi possível realizar seu cadastro, verifique os dados informados.' });
        }
    
        try {
            const usuario = await appService.cadastrarUsuario({
                nome, emailPessoal, telefonePessoal, cpf, dataNascimento, possuiEmpresa,
                cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep,
                endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa,
                qntSocios, socios, senha
            });
    
            res.status(201).json({
                usuario,
                message: 'Conta criada com sucesso! Verifique seu e-mail com os dados de login.'
            });
        } catch (error) {
            res.status(400).send({ message: error.message });
        }
    };    
}

module.exports = SessionController

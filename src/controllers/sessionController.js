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
            nome, emailPessoal, telefonePessoal, cpf, dataNascimento, possuiEmpresa, cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep,
            endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa,
            qntSocios, socios, senha, confisenha
        } = req.body;
    
        if (senha !== confisenha || !nome || !emailPessoal || !senha || !confisenha || !telefonePessoal || !cpf || !dataNascimento) {
            return res.status(400).send({ message: 'Não foi possível realizar seu cadastro, verifique os dados informados.' });
        }
    
        try {
            const usuario = await appService.cadastrarUsuario({
                nome, emailPessoal, telefonePessoal, cpf, dataNascimento, possuiEmpresa, qntEmpresas: possuiEmpresa ? 1 : 0,
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

    static async buscarUsuario(req, res) {
        const usuario_id = req.params.usuario_id;
    
        try {
            const usuario = await appService.buscarUsuario(usuario_id);
    
            if (!usuario) {
                return res.status(404).json({ message: 'Usuário não encontrada' });
            }
    
            res.status(200).json(usuario);
        } catch (error) {
            console.error('Erro ao buscar empresa:', error);
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };   

    static async listarUsuarios(req, res) {
        try {
            const usuarios = await appService.listarUsuarios();
    
            if (!usuarios || usuarios.length === 0) { return res.status(404).json({ message: 'Nenhum usuário encontrado.' });}
    
            res.status(200).json(usuarios);  
    
        } catch (error) {
            console.error('Erro ao listar usuários:', error); 
            res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
        }
    };    

    static async editarUsuario(req, res) {
        const { usuario_id } = req.params;

        const {
            nome, emailPessoal, telefonePessoal, cpf, dataNascimento, tipo
        } = req.body;

        try {
            if (tipo === 'admin') {
                const user = await appService.editarUsuario({
                    nome, emailPessoal, telefonePessoal, cpf, dataNascimento, tipo
                }, usuario_id);
                return res.status(200).json(user);
            } else if (tipo === 'collaborator') {
                const user = await appService.editarUsuario({
                    nome, emailPessoal, telefonePessoal, cpf, dataNascimento
                }, usuario_id);
                return res.status(200).json(user);
            } else {
                return res.status(401).json({ error: 'Não autorizado' });
            }
        } catch (error) {
            console.log('Message error:', error.message);
            res.status(400).send({ message: error.message });
        }
    };
}

module.exports = SessionController

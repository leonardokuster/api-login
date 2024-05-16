const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const database = require('../models');
const transporter = require('../controllers/nodemailerController');
require('dotenv').config();
const jwt = require('jsonwebtoken');

class AppService {
    async logarUsuario(dto) {
        const { email, senha } = dto;
    
        const usuario = await database.usuarios.findOne({ 
            where: { 
                email: email 
            } 
        });
    
        if (!usuario) {
            throw new Error('Credenciais inválidas');
        }
        
        if (!senha) {
            throw new Error('Senha não fornecida');
        }
    
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    
        if (!senhaCorreta) {
            throw new Error('Credenciais inválidas');
        }

        return { usuario, tipo: usuario.tipo };
    }

    async cadastrarUsuario(dto) {
        const { nome, telefone, email, dataNascimento, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, senha } = dto;

        const usuarioExistente = await database.usuarios.findOne({
            where: {
                [database.Sequelize.Op.or]: [{ cpfCnpj }, { email }]
            }
        });

        if (usuarioExistente) {
            throw new Error('Este CPF/CNPJ ou e-mail já está cadastrado. Faça login.');
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        
        try {
            const newUsuario = await database.usuarios.create({
                id: uuidv4(),
                nome: dto.nome,
                email: dto.email,
                telefone: dto.telefone,
                cpfCnpj: dto.cpfCnpj,
                cep: dto.cep,
                endereco: dto.endereco,
                numeroCasa: dto.numeroCasa,
                complementoCasa: dto.complementoCasa,
                dataNascimento: dto.dataNascimento,
                senha: hashedSenha
            });

            const firstName = nome.split(' ')[0];

            const info = await transporter.sendMail({
                from: "Escritório Kuster <l.kusterr@gmail.com>",
                to: email,
                subject: "Obrigado por realizar seu cadastro! - Escritório Küster",
                html: `
                <html>
                <body>
                    <h2>Olá <strong>${firstName}</strong>,</h2>
                    <p>Obrigado por se cadastrar em nosso serviço! Abaixo estão os detalhes da sua conta:</p>
    
                    <ul>
                        <li><strong>E-mail:</strong> ${email}</li>
                        <li><strong>Senha:</strong> ${senha}</li>
                    </ul>
    
                    <p>Para acessar sua conta, visite nosso site <a href='https://escritoriokuster.netlify.app/login'>aqui</a> e faça login usando as credenciais acima.</p>
    
                    <p>Lembre-se de manter suas credenciais seguras e não compartilhá-las com ninguém.</p>
    
                    <p>Se você tiver alguma dúvida ou precisar de assistência, não hesite em nos contatar.</p>
    
                    <p>Obrigado!</p>
                    <p>Escritório Küster</p>
                </body>
                </html>
                `,
            });

            return newUsuario;
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error)
            throw error
        };
    };

    async buscarTodosUsuarios() {
        const usuarios = await database.usuarios.findAll()

        return usuarios
    };

    async buscarUsuarioPorCpfCnpj(cpfCnpj) {
        const usuario = await database.usuarios.findOne({
            where: {
                cpfCnpj: cpfCnpj
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        return usuario;
    };

    async deletarUsuarioPorCpfCnpj(cpfCnpj) {
        const usuario = await database.usuarios.findOne({
            where: {
                cpfCnpj: cpfCnpj
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        try {
            await database.usuarios.destroy({
                where: {
                    cpfCnpj: cpfCnpj
                }
            });
        } catch (error) {
            console.error('Message error: ', error.message)
            throw error;
        };
    };

    async editarUsuario(dto) {
        const { id, nome, email, telefone, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha, tipo } = dto;

        const usuario = await database.usuarios.findOne({
            where: {
                cpfCnpj: cpfCnpj
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        try {
            if (nome) usuario.nome = nome;
            if (email) usuario.email = email;
            if (telefone) usuario.telefone = telefone;
            if (cpfCnpj) usuario.cpfCnpj = cpfCnpj;
            if (cep) usuario.cep = cep;
            if (endereco) usuario.endereco = endereco;
            if (numeroCasa) usuario.numeroCasa = numeroCasa;
            if (complementoCasa) usuario.complementoCasa = complementoCasa;
            if (dataNascimento) usuario.dataNascimento = dataNascimento;
            if (senha) usuario.senha = await bcrypt.hash(senha, 10);
            if (tipo) usuario.tipo = tipo;
    
            await usuario.save();
            return usuario;
        } catch (error) {
            console.error('Erro ao editar usuário:', error.message);
            throw error;
        }
    };
}

module.exports = AppService;
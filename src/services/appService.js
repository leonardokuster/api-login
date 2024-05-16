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
 
        const token = jwt.sign({ usuarioId: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { usuario, token };
    }

    async cadastrarUsuario(dto) {
        const { nome, telefone, email, dataNascimento, cpfCnpj, cep, endereco, numeroCasa, complementoCasa, senha } = dto;

        const cpfCnpjUsuario = await database.usuarios.findOne({
            where: {
                cpfCnpj: cpfCnpj
            }
        });

        const emailUsuario = await database.usuarios.findOne({
            where: {
                email: email
            }
        });

        if (cpfCnpjUsuario) {
            throw new Error('Este CPF/CNPJ já está cadastrado. Faça login.')
        };
        
        if (emailUsuario) {
            throw new Error('Este e-mail já está cadastrado. Faça login.')
        };

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
            usuario.nome = nome,
            usuario.email = email,
            usuario.telefone = telefone,
            usuario.cpfCnpj = cpfCnpj,
            usuario.cep = cep,
            usuario.endereco = endereco,
            usuario.numeroCasa = numeroCasa,
            usuario.complementoCasa = complementoCasa,
            usuario.dataNascimento = dataNascimento,
            usuario.senha = senha,
            usuario.tipo = tipo

            await usuario.save()

            return await usuario.reload()
        } catch (error) {
            console.error('Message error: ', error.message)
            throw error
        };
    };
}

module.exports = AppService;
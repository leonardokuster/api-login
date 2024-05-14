const { v4: uuidv4 } = require('uuid');const bcrypt = require('bcrypt');
const database = require('../models');
const transporter = require('../controllers/nodemailer');
require('dotenv').config();
const jwt = require('jsonwebtoken');

class UsuarioService {
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
        const { nome, email, senha } = dto;

        const nomeUsuario = await database.usuarios.findOne({
            where: {
                nome: nome
            }
        });

        const emailUsuario = await database.usuarios.findOne({
            where: {
                email: email
            }
        });

        if (nomeUsuario) {
            throw new Error('Este nome de usuário já está em uso. Tente outro.')
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
                senha: hashedSenha
            });

            const info = await transporter.sendMail({
                from: "Escritório Kuster <l.kusterr@gmail.com>",
                to: email,
                subject: "Obrigado por realizar seu cadastro! - Escritório Küster",
                html: `
                <html>
                <body>
                    <h2>Olá <strong>${nome}</strong>,</h2>
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

    async buscarUsuarioPorId(id) {
        const usuario = await database.usuarios.findOne({
            where: {
                id: id
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        return usuario;
    };

    async deletarUsuarioPorId(id) {
        const usuario = await database.usuarios.findOne({
            where: {
                id: id
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        try {
            await database.usuarios.destroy({
                where: {
                    id: id
                }
            });
        } catch (error) {
            console.error('Message error: ', error.message)
            throw error;
        };
    };

    async editarUsuario(dto) {
        const { id, nome, email, senha, tipo } = dto;

        const usuario = await database.usuarios.findOne({
            where: {
                id: id
            }
        });

        if (!usuario) {
            throw new Error('Usuário informado não cadastrado!')
        };

        try {
            usuario.nome = nome,
            usuario.email = email,
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

module.exports = UsuarioService
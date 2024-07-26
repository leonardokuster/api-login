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
        const { nome, email, telefone, cpf, possuiEmpresa, cnpj, nomeEmpresa, cep, endereco, numeroCasa, complementoCasa, dataNascimento, senha } = dto;

        const usuarioExistente = await database.usuarios.findOne({
            where: {
                [database.Sequelize.Op.or]: [{ cpf }, { email }]
            }
        });

        if (usuarioExistente) {
            throw new Error('Este CPF ou e-mail já está cadastrado. Faça login.');
        }

        const hashedSenha = await bcrypt.hash(senha, 10);
        
        try {
            const newUsuario = await database.usuarios.create({
                id: uuidv4(),
                nome: dto.nome,
                email: dto.email,
                telefone: dto.telefone,
                cpf: dto.cpf,
                possuiEmpresa: dto.possuiEmpresa,
                cnpj: dto.cnpj,
                nomeEmpresa: dto.nomeEmpresa,
                cep: dto.cep,
                endereco: dto.endereco,
                numeroCasa: dto.numeroCasa,
                complementoCasa: dto.complementoCasa,
                dataNascimento: dto.dataNascimento,
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

    async criarEmpresa(dto) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = dto;

        const empresaExistente = await database.empresas.findOne({
            where: {
                [database.Sequelize.Op.or]: [{ cnpj }]
            }
        });
        
        try {
            const newCompany = await database.empresas.create({
                id: uuidv4(),
                cnpj: dto.cnpj,
                nome_fantasia: dto.nome_fantasia,
                razao_social: dto.razao_social,
                atividades_exercidas: dto.atividades_exercidas,
                capital_social: dto.capital_social,
                endereco: dto.endereco,
                email: dto.email,
                telefone: dto.telefone,
                socios: dto.socios
            });

            return newCompany;
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error)
            throw error
        };
    };

    async cadastrarFuncionario(dto) {
        const {
            nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
            nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
            complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
            estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
            carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
            funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
            periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
        } = dto;

        const funcionarioExistente = await database.funcionarios.findOne({
            where: {
                [database.Sequelize.Op.or]: [{ cpf }]
            }
        });
        
        try {
            const newEmployee = await database.funcionarios.create({
                id: uuidv4(),
                nome: dto.nome,
                email: dto.email,
                telefone: dto.telefone,
                sexo: dto.sexo,
                cor_etnia: dto.cor_etnia,
                data_nascimento: dto.data_nascimento,
                local_nascimento: dto.local_nascimento,
                nacionalidade: dto.nacionalidade,
                cpf: dto.cpf,
                rg: dto.rg,
                orgao_expedidor: dto.orgao_expedidor,
                data_rg: dto.data_rg,
                cep: dto.cep,
                endereco: dto.endereco,
                numero_casa: dto.numero_casa,
                complemento_casa: dto.complemento_casa,
                bairro: dto.bairro,
                cidade: dto.cidade,
                estado: dto.estado,
                nome_mae: dto.nome_mae,
                nome_pai: dto.nome_pai,
                escolaridade: dto.escolaridade,
                estado_civil: dto.estado_civil,
                nome_conjuge: dto.nome_conjuge,
                pis: dto.pis,
                data_pis: dto.data_pis,
                numero_ct: dto.numero_ct,
                serie: dto.serie,
                data_ct: dto.data_ct,
                carteira_digital: dto.carteira_digital,
                titulo_eleitoral: dto.titulo_eleitoral,
                zona: dto.zona,
                secao: dto.secao,
                qnt_dependente: dto.qnt_dependente,
                dependentes: dtp.dependentes,
                funcao: dto.funcao,
                data_admissao: dto.data_admissao,
                salario: dto.salario,
                contrato_experiencia: dto.contrato_experiencia,
                horarios: dto.horarios,
                insalubridade: dto.insalubridade,
                periculosidade: dto.periculosidade,
                quebra_de_caixa: dto.quebra_de_caixa,
                vale_transporte: dto.vale_transporte,
                quantidade_vales: dto.quantidade_vales
            });

            return newEmployee;
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error)
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
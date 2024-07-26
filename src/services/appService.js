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

    async criarEmpresa(dto, usuario_id) {
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
                socios: dto.socios,
                usuario_id
            });

            await database.usuarios.update({ possuiEmpresa: true, empresa_id: newCompany.id }, { where: { id: usuario_id } });

            return newCompany;
        } catch (error) {
            console.error('Erro ao cadastrar empresa:', error)
            throw error
        };
    };

    async cadastrarFuncionario(dto, empresa_id) {
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

        if (funcionarioExistente) {
            throw new Error('Funcionário já cadastrado.')
        };
        
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
                quantidade_vales: dto.quantidade_vales,
                empresa_id
            });

            return newEmployee;
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error)
            throw error
        };
    };

    async buscarEmpresa(usuario_id) {
        const usuario = await database.usuarios.findByPk(usuario_id, { include: database.empresas });

        if (!usuario || !usuario.empresa_id) {
            throw new Error('Nenhuma empresa cadastrada');
        }

        return usuario.Empresa;
    };

    async editarEmpresa(dto) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = dto;

        const company = await database.empresas.findOne({where: { cnpj: cnpj }});

        if (!company) {
            throw new Error('Nenhuma empresa encontrada.')
        };

        try {
            if (cnpj) empresas.cnpj = cnpj;
            if (nome_fantasia) empresas.nome_fantasia = nome_fantasia;
            if (razao_social) empresas.razao_social = razao_social;
            if (atividades_exercidas) empresas.atividades_exercidas = atividades_exercidas;
            if (capital_social) empresas.capital_social = capital_social;
            if (endereco) empresas.endereco = endereco;
            if (email) empresas.email = email;
            if (telefone) empresas.telefone = telefone;
            if (socios) empresas.socios = socios;
    
            await empresas.save();
            return company;
        } catch (error) {
            console.error('Erro ao editar empresa:', error.message);
            throw error;
        }
    };

    async editarFuncionario(dto) {
        const {
            nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento,
            nacionalidade, cpf, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa,
            complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade,
            estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct,
            carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes,
            funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade,
            periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales
        } = dto;

        const employee = await database.funcionarios.findOne({where: { cpf: cpf }});

        if (!employee) {
            throw new Error('Funcionário não encontrado.')
        };

        try {
            if (nome) funcionarios.nome = nome;
            if (email) funcionarios.email = email;
            if (telefone) funcionarios.telefone = telefone;
            if (sexo) funcionarios.sexo = sexo;
            if (cor_etnia) funcionarios.cor_etnia = cor_etnia;
            if (data_nascimento) funcionarios.data_nascimento = data_nascimento;
            if (local_nascimento) funcionarios.local_nascimento = local_nascimento;
            if (nacionalidade) funcionarios.nacionalidade = nacionalidade;
            if (cpf) funcionarios.cpf = cpf;
            if (rg) funcionarios.rg = rg;
            if (orgao_expedidor) funcionarios.orgao_expedidor = orgao_expedidor;
            if (data_rg) funcionarios.data_rg = data_rg;
            if (cep) funcionarios.cep = cep;
            if (endereco) funcionarios.endereco = endereco;
            if (numero_casa) funcionarios.numero_casa = numero_casa;
            if (complemento_casa) funcionarios.complemento_casa = complemento_casa;
            if (bairro) funcionarios.bairro = bairro;
            if (cidade) funcionarios.cidade = cidade;
            if (estado) funcionarios.estado = estado;
            if (nome_mae) funcionarios.nome_mae = nome_mae;
            if (nome_pai) funcionarios.nome_pai = nome_pai;
            if (escolaridade) funcionarios.escolaridade = escolaridade;
            if (estado_civil) funcionarios.estado_civil = estado_civil;
            if (nome_conjuge) funcionarios.nome_conjuge = nome_conjuge;
            if (pis) funcionarios.pis = pis;
            if (data_pis) funcionarios.data_pis = data_pis;
            if (numero_ct) funcionarios.numero_ct = numero_ct;
            if (serie) funcionarios.serie = serie;
            if (data_ct) funcionarios.data_ct = data_ct;
            if (carteira_digital) funcionarios.carteira_digital = carteira_digital;
            if (titulo_eleitoral) funcionarios.titulo_eleitoral = titulo_eleitoral;
            if (zona) funcionarios.zona = zona;
            if (secao) funcionarios.secao = secao;
            if (qnt_dependente) funcionarios.qnt_dependente = qnt_dependente;
            if (dependentes) funcionarios.dependentes = dependentes;
            if (funcao) funcionarios.funcao = funcao;
            if (data_admissao) funcionarios.data_admissao = data_admissao;
            if (salario) funcionarios.salario = salario;
            if (contrato_experiencia) funcionarios.contrato_experiencia = contrato_experiencia;
            if (horarios) funcionarios.horarios = horarios;
            if (insalubridade) funcionarios.insalubridade = insalubridade;
            if (periculosidade) funcionarios.periculosidade = periculosidade;
            if (quebra_de_caixa) funcionarios.quebra_de_caixa = quebra_de_caixa;
            if (vale_transporte) funcionarios.vale_transporte = vale_transporte;
            if (quantidade_vales) funcionarios.quantidade_vales = quantidade_vales;

            await empresas.save();
            return company;
        } catch (error) {
            console.error('Erro ao editar empresa:', error.message);
            throw error;
        }
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

    
}

module.exports = AppService;
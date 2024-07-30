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
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, nome_socios } = dto;
    
        const empresaExistente = await database.empresas.findOne({
            where: { cnpj }
        });
    
        if (empresaExistente) {
            throw new Error('Empresa já cadastrada.');
        }
    
        try {
            const newCompany = await database.empresas.create({
                id: uuidv4(),
                cnpj,
                nome_fantasia,
                razao_social,
                atividades_exercidas,
                capital_social,
                endereco,
                email,
                telefone,
                nome_socios,
                usuario_id
            });
    
            await database.usuarios.update(
                { possuiEmpresa: true, empresa_id: newCompany.id, nomeEmpresa: newCompany.nome_fantasia, cnpj: newCompany.cnpj },
                { where: { id: usuario_id } }
            );
    
            return newCompany;
        } catch (error) {
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
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

        if (dependentes && !Array.isArray(dependentes)) {
            throw new Error('Dependentes devem ser um array.');
        }

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
                nome,
                email,
                telefone,
                sexo,
                cor_etnia,
                data_nascimento,
                local_nascimento,
                nacionalidade,
                cpf,
                rg,
                orgao_expedidor,
                data_rg,
                cep,
                endereco,
                numero_casa,
                complemento_casa,
                bairro,
                cidade,
                estado,
                nome_mae,
                nome_pai,
                escolaridade,
                estado_civil,
                nome_conjuge,
                pis,
                numero_ct,
                serie,
                data_ct,
                carteira_digital,
                titulo_eleitoral,
                zona,
                secao,
                qnt_dependente,
                dependentes,
                funcao,
                data_admissao,
                salario,
                contrato_experiencia,
                horarios,
                insalubridade,
                periculosidade,
                quebra_de_caixa,
                vale_transporte,
                quantidade_vales,
                empresa_id
            });

            return newEmployee;
        } catch (error) {
            console.error('Erro ao cadastrar funcionário:', error)
            throw error
        };
    };

    async buscarEmpresa(empresa_id) {
        return database.empresas.findOne({
            where: { id: empresa_id }
        });
    };
    

    async editarEmpresa(dto) {
        const { cnpj, nome_fantasia, razao_social, atividades_exercidas, capital_social, endereco, email, telefone, socios } = dto;
    
        const empresa = await database.empresas.findOne({ where: { cnpj } });
    
        if (!empresa) {
            throw new Error('Nenhuma empresa encontrada.');
        }
    
        try {
            if (nome_fantasia) empresa.nome_fantasia = nome_fantasia;
            if (razao_social) empresa.razao_social = razao_social;
            if (atividades_exercidas) empresa.atividades_exercidas = atividades_exercidas;
            if (capital_social) empresa.capital_social = capital_social;
            if (endereco) empresa.endereco = endereco;
            if (email) empresa.email = email;
            if (telefone) empresa.telefone = telefone;
            if (socios) empresa.socios = socios;
    
            await empresa.save();
            return empresa;
        } catch (error) {
            console.error('Erro ao editar empresa:', error.message);
            throw error;
        }
    };
    
    async editarFuncionario(dto) {
        const { cpf, nome, email, telefone, sexo, cor_etnia, data_nascimento, local_nascimento, nacionalidade, rg, orgao_expedidor, data_rg, cep, endereco, numero_casa, complemento_casa, bairro, cidade, estado, nome_mae, nome_pai, escolaridade, estado_civil, nome_conjuge, pis, data_pis, numero_ct, serie, data_ct, carteira_digital, titulo_eleitoral, zona, secao, qnt_dependente, dependentes, funcao, data_admissao, salario, contrato_experiencia, horarios, insalubridade, periculosidade, quebra_de_caixa, vale_transporte, quantidade_vales } = dto;
    
        const funcionario = await database.funcionarios.findOne({ where: { cpf } });
    
        if (!funcionario) {
            throw new Error('Funcionário não encontrado.');
        }
    
        try {
            if (nome) funcionario.nome = nome;
            if (email) funcionario.email = email;
            if (telefone) funcionario.telefone = telefone;
            if (sexo) funcionario.sexo = sexo;
            if (cor_etnia) funcionario.cor_etnia = cor_etnia;
            if (data_nascimento) funcionario.data_nascimento = data_nascimento;
            if (local_nascimento) funcionario.local_nascimento = local_nascimento;
            if (nacionalidade) funcionario.nacionalidade = nacionalidade;
            if (rg) funcionario.rg = rg;
            if (orgao_expedidor) funcionario.orgao_expedidor = orgao_expedidor;
            if (data_rg) funcionario.data_rg = data_rg;
            if (cep) funcionario.cep = cep;
            if (endereco) funcionario.endereco = endereco;
            if (numero_casa) funcionario.numero_casa = numero_casa;
            if (complemento_casa) funcionario.complemento_casa = complemento_casa;
            if (bairro) funcionario.bairro = bairro;
            if (cidade) funcionario.cidade = cidade;
            if (estado) funcionario.estado = estado;
            if (nome_mae) funcionario.nome_mae = nome_mae;
            if (nome_pai) funcionario.nome_pai = nome_pai;
            if (escolaridade) funcionario.escolaridade = escolaridade;
            if (estado_civil) funcionario.estado_civil = estado_civil;
            if (nome_conjuge) funcionario.nome_conjuge = nome_conjuge;
            if (pis) funcionario.pis = pis;
            if (data_pis) funcionario.data_pis = data_pis;
            if (numero_ct) funcionario.numero_ct = numero_ct;
            if (serie) funcionario.serie = serie;
            if (data_ct) funcionario.data_ct = data_ct;
            if (carteira_digital) funcionario.carteira_digital = carteira_digital;
            if (titulo_eleitoral) funcionario.titulo_eleitoral = titulo_eleitoral;
            if (zona) funcionario.zona = zona;
            if (secao) funcionario.secao = secao;
            if (qnt_dependente) funcionario.qnt_dependente = qnt_dependente;
            if (dependentes) funcionario.dependentes = dependentes;
            if (funcao) funcionario.funcao = funcao;
            if (data_admissao) funcionario.data_admissao = data_admissao;
            if (salario) funcionario.salario = salario;
            if (contrato_experiencia) funcionario.contrato_experiencia = contrato_experiencia;
            if (horarios) funcionario.horarios = horarios;
            if (insalubridade) funcionario.insalubridade = insalubridade;
            if (periculosidade) funcionario.periculosidade = periculosidade;
            if (quebra_de_caixa) funcionario.quebra_de_caixa = quebra_de_caixa;
            if (vale_transporte) funcionario.vale_transporte = vale_transporte;
            if (quantidade_vales) funcionario.quantidade_vales = quantidade_vales;
    
            await funcionario.save();
            return funcionario;
        } catch (error) {
            console.error('Erro ao editar funcionário:', error.message);
            throw error;
        }
    };

    async buscarUsuario(usuario_id) {
        const usuario = await database.usuarios.findByPk(usuario_id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    };
    

    
}

module.exports = AppService;
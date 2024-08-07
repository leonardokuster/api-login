const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const database = require('../models');
const transporter = require('../controllers/nodemailerController');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sequelize } = require('../models');
const moment = require('moment');

class AppService {
    async logarUsuario(dto) {
        const { email, senha } = dto;
    
        const usuario = await database.usuarios.findOne({ 
            where: { emailPessoal: email }
        });
    
        if (!usuario) {
            const empresa = await database.empresas.findOne({
                where: { emailEmpresa: email },
                include: {
                    model: database.usuarios, 
                    as: 'usuario' 
                }
            });
    
            if (!empresa) {
                throw new Error('Credenciais inválidas');
            }
    
            usuario = empresa.usuario;
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
        const {
            nome, emailPessoal, telefonePessoal, cpf, dataNascimento, possuiEmpresa, qntEmpresas,
            cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep,
            endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa,
            qntSocios, socios: sociosData, senha
        } = dto;
    
        const t = await sequelize.transaction();
    
        const usuarioExistente = await database.usuarios.findOne({
            where: {
                [database.Sequelize.Op.or]: [
                    { cpf },
                    { emailPessoal }
                ]
            }
        });
    
        const empresaExistente = possuiEmpresa ? await database.empresas.findOne({
            where: { cnpj }
        }) : null;
    
        if (usuarioExistente) {
            throw new Error('Usuário já cadastrado. Faça login.');
        }
    
        if (empresaExistente) {
            throw new Error('Empresa já cadastrada.');
        }
    
        const hashedSenha = await bcrypt.hash(senha, 10);
    
        try {
            const newUser = await database.usuarios.create({
                id: uuidv4(),
                nome,
                emailPessoal,
                telefonePessoal,
                cpf,
                dataNascimento,
                possuiEmpresa,
                qntEmpresas: possuiEmpresa ? qntEmpresas + 1 : qntEmpresas,
                senha: hashedSenha
            }, { transaction: t });
    
            let newCompany = null;
            if (possuiEmpresa) {
                newCompany = await database.empresas.create({
                    id: uuidv4(),
                    cnpj,
                    nomeFantasia,
                    razaoSocial,
                    atividadesExercidas,
                    capitalSocial,
                    cep,
                    endereco,
                    numeroEmpresa,
                    complementoEmpresa,
                    emailEmpresa,
                    telefoneEmpresa,
                    qntSocios,
                    usuario_id: newUser.id
                }, { transaction: t });
                newUser.empresa_id = newCompany.id;
                await newUser.save({ transaction: t });
    
                for (const socioData of sociosData) {
                    await database.socios.create({
                        id: uuidv4(),
                        nomeSocio: socioData.nomeSocio,
                        cpfSocio: socioData.cpfSocio,
                        emailSocio: socioData.emailSocio,
                        telefoneSocio: socioData.telefoneSocio,
                        empresa_id: newCompany.id
                    }, { transaction: t });
                }
            }
    
            await t.commit();

            const emailDestino = emailEmpresa ? emailEmpresa : emailPessoal;
            const info = await transporter.sendMail({
                from: "Escritório Kuster <l.kusterr@gmail.com>",
                to: emailDestino,
                subject: "Obrigado por realizar seu cadastro! - Escritório Küster",
                html: `
                <html>
                <body>
                    <h2>Olá <strong>${nome}</strong>,</h2>
                    <p>Obrigado por se cadastrar em nosso serviço! Abaixo estão os detalhes da sua conta:</p>
    
                    <ul>
                        <li><strong>E-mail:</strong> ${emailDestino}</li>
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

            return newUser;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao cadastrar usuário:', error);
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

    async criarEmpresa(dto, usuario_id) {
        const { cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep, endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa, qntSocios, socios: sociosData } = dto;
    
        const t = await sequelize.transaction();
    
        const empresaExistente = await database.empresas.findOne({
            where: { cnpj }
        });
    
        if (empresaExistente) {
            throw new Error('Empresa já cadastrada.');
        }
    
        try {
            const usuario = await database.usuarios.findByPk(usuario_id);
            if (!usuario) {
                throw new Error('Usuário não encontrado');
            }

            const newCompany = await database.empresas.create({
                id: uuidv4(),
                cnpj,
                nomeFantasia,
                razaoSocial,
                atividadesExercidas,
                capitalSocial,
                cep,
                endereco,
                numeroEmpresa,
                complementoEmpresa,
                emailEmpresa,
                telefoneEmpresa,
                qntSocios,
                usuario_id
            }, { transaction: t });
    
            await database.usuarios.update(
                { possuiEmpresa: true, qntEmpresas: usuario.qntEmpresas + 1, empresa_id: newCompany.id },
                { where: { id: usuario_id }, transaction: t } 
            );
    
            for (const socioData of sociosData) {
                await database.socios.create({
                    id: uuidv4(),
                    nomeSocio: socioData.nomeSocio,
                    cpfSocio: socioData.cpfSocio,
                    emailSocio: socioData.emailSocio,
                    telefoneSocio: socioData.telefoneSocio,
                    empresa_id: newCompany.id
                }, { transaction: t });
            }
    
            await t.commit();
    
            return newCompany;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao criar empresa:', error);
            throw error;
        }
    };

    async buscarEmpresa(usuario_id) {
        const usuario = await database.usuarios.findOne({
            where: { id: usuario_id },
            include: [{
                model: database.empresas,
                as: 'empresa'
            }]
        });
    
        if (!usuario || !usuario.empresa) {
            return null;
        }
    
        return usuario.empresa;
    };
    
    async editarEmpresa(dto) {
        const { cnpj, nomeFantasia, razaoSocial, atividadesExercidas, capitalSocial, cep, endereco, numeroEmpresa, complementoEmpresa, emailEmpresa, telefoneEmpresa, qntSocios, socios: sociosData } = dto;
    
        const empresa = await database.empresas.findOne({ where: { cnpj } });
    
        if (!empresa) {
            throw new Error('Nenhuma empresa encontrada.');
        };
    
        const t = await sequelize.transaction();

        try {
            const updates = {};
            if (nomeFantasia) updates.nomeFantasia = nomeFantasia;
            if (razaoSocial) updates.razaoSocial = razaoSocial;
            if (atividadesExercidas) updates.atividadesExercidas = atividadesExercidas;
            if (capitalSocial) updates.capitalSocial = capitalSocial;
            if (cep) updates.cep = cep;
            if (endereco) updates.endereco = endereco;
            if (numeroEmpresa) updates.numeroEmpresa = numeroEmpresa;
            if (complementoEmpresa) updates.complementoEmpresa = complementoEmpresa;
            if (emailEmpresa) updates.emailEmpresa = emailEmpresa;
            if (telefoneEmpresa) updates.telefoneEmpresa = telefoneEmpresa;
            if (qntSocios !== undefined) updates.qntSocios = qntSocios;
    
            await empresa.update(updates, { transaction: t });
    
            if (Array.isArray(sociosData)) {
                for (const socioData of sociosData) {
                    const { id, nomeSocio, cpfSocio, emailSocio, telefoneSocio } = socioData;
    
                    if (id) {
                        await database.socios.update({
                            nomeSocio,
                            cpfSocio,
                            emailSocio,
                            telefoneSocio
                        }, {
                            where: { id },
                            transaction: t
                        });
                    } else {
                        await database.socios.create({
                            id: uuidv4(),
                            nomeSocio,
                            cpfSocio,
                            emailSocio,
                            telefoneSocio,
                            empresa_id: empresa.id
                        }, { transaction: t });
                    }
                }
            }
    
            await t.commit();
            return empresa;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao editar empresa:', error.message);
            throw error;
        }
    };

    async cadastrarFuncionario(dto, empresa_id) {
        const {
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, nacionalidade, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
            complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, qntDependente, dependentes: dependentesData, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
            periculosidade, quebraDeCaixa, valeTransporte, quantidadeVales
        } = dto;
    
        const t = await sequelize.transaction();
    
        const funcionarioExistente = await database.funcionarios.findOne({
            where: { cpf }
        });
    
        if (funcionarioExistente) {
            throw new Error('Funcionário já cadastrado.');
        }

        const formatSalario = salario => salario.replace(/[^\d,]/g, '').replace(',', '.');

        const formattedSalario = formatSalario(salario);

        const formatDate = (date) => {
            const formats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
        
            let formattedDate = moment(date, formats, true);
            
            if (!formattedDate.isValid()) {
                formattedDate = moment(date);  
            }
            
            return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : '';
        };

        const formattedDataNascimento = formatDate(dataNascimento);
        const formattedDataCt = formatDate(dataCt);
        const formattedDataRg = formatDate(dataRg);
        const formattedDataAdmissao = formatDate(dataAdmissao);
    
        try {
            const newEmployee = await database.funcionarios.create({
                id: uuidv4(),
                nome,
                email,
                telefone,
                sexo,
                corEtnia,
                dataNascimento: formattedDataNascimento,
                localNascimento,
                nacionalidade,
                cpf,
                rg,
                orgaoExpedidor,
                dataRg: formattedDataRg,
                cep,
                endereco,
                numeroCasa,
                complementoCasa,
                bairro,
                cidade,
                estado,
                nomeMae,
                nomePai,
                escolaridade,
                estadoCivil,
                nomeConjuge,
                pis,
                numeroCt,
                serie,
                dataCt: formattedDataCt,
                carteiraDigital,
                tituloEleitoral,
                zona,
                secao,
                qntDependente,
                funcao,
                dataAdmissao: formattedDataAdmissao,
                salario: formattedSalario,
                contratoExperiencia,
                horarios,
                insalubridade,
                periculosidade,
                quebraDeCaixa,
                valeTransporte,
                quantidadeVales,
                empresa_id
            }, { transaction: t });

            for (const dependenteData of dependentesData) {
                await database.dependentes.create({
                    id: uuidv4(),
                    nomeDependente: dependenteData.nomeDependente,
                    dataNascimentoDependente: dependenteData.dataNascimentoDependente,
                    cpfDependente: dependenteData.cpfDependente,
                    localNascimentoDependente: dependenteData.localNascimentoDependente,
                    funcionario_id: newEmployee.id
                }, { transaction: t });
            }
    
            await t.commit();
    
            return newEmployee;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao cadastrar funcionário:', error);
            throw error;
        }
    };   
    
    async editarFuncionario(dto) {
        const {
            cpf, nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento,
            nacionalidade, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa,
            bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge,
            pis, dataPis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona,
            secao, qntDependente, dependentes: dependentesData, funcao, dataAdmissao, salario,
            contratoExperiencia, horarios, insalubridade, periculosidade, quebraDeCaixa,
            valeTransporte, quantidadeVales
        } = dto;
    
        const funcionario = await database.funcionarios.findOne({ where: { cpf } });
    
        if (!funcionario) {
            throw new Error('Funcionário não encontrado.');
        }
    
        const t = await sequelize.transaction();
    
        try {
            if (nome) funcionario.nome = nome;
            if (email) funcionario.email = email;
            if (telefone) funcionario.telefone = telefone;
            if (sexo) funcionario.sexo = sexo;
            if (corEtnia) funcionario.corEtnia = corEtnia;
            if (dataNascimento) funcionario.dataNascimento = dataNascimento;
            if (localNascimento) funcionario.localNascimento = localNascimento;
            if (nacionalidade) funcionario.nacionalidade = nacionalidade;
            if (rg) funcionario.rg = rg;
            if (orgaoExpedidor) funcionario.orgaoExpedidor = orgaoExpedidor;
            if (dataRg) funcionario.dataRg = dataRg;
            if (cep) funcionario.cep = cep;
            if (endereco) funcionario.endereco = endereco;
            if (numeroCasa) funcionario.numeroCasa = numeroCasa;
            if (complementoCasa) funcionario.complementoCasa = complementoCasa;
            if (bairro) funcionario.bairro = bairro;
            if (cidade) funcionario.cidade = cidade;
            if (estado) funcionario.estado = estado;
            if (nomeMae) funcionario.nomeMae = nomeMae;
            if (nomePai) funcionario.nomePai = nomePai;
            if (escolaridade) funcionario.escolaridade = escolaridade;
            if (estadoCivil) funcionario.estadoCivil = estadoCivil;
            if (nomeConjuge) funcionario.nomeConjuge = nomeConjuge;
            if (pis) funcionario.pis = pis;
            if (dataPis) funcionario.dataPis = dataPis;
            if (numeroCt) funcionario.numeroCt = numeroCt;
            if (serie) funcionario.serie = serie;
            if (dataCt) funcionario.dataCt = dataCt;
            if (carteiraDigital) funcionario.carteiraDigital = carteiraDigital;
            if (tituloEleitoral) funcionario.tituloEleitoral = tituloEleitoral;
            if (zona) funcionario.zona = zona;
            if (secao) funcionario.secao = secao;
            if (qntDependente) funcionario.qntDependente = qntDependente;
            if (funcao) funcionario.funcao = funcao;
            if (dataAdmissao) funcionario.dataAdmissao = dataAdmissao;
            if (salario) funcionario.salario = salario;
            if (contratoExperiencia) funcionario.contratoExperiencia = contratoExperiencia;
            if (horarios) funcionario.horarios = horarios;
            if (insalubridade) funcionario.insalubridade = insalubridade;
            if (periculosidade) funcionario.periculosidade = periculosidade;
            if (quebraDeCaixa) funcionario.quebraDeCaixa = quebraDeCaixa;
            if (valeTransporte) funcionario.valeTransporte = valeTransporte;
            if (quantidadeVales) funcionario.quantidadeVales = quantidadeVales;
    
            await funcionario.save({ transaction: t });
    
            if (Array.isArray(dependentesData)) {
                const dependentesExistentes = await database.dependentes.findAll({ where: { funcionario_id: funcionario.id } });
    
                const dependentesIdsExistentes = dependentesExistentes.map(dep => dep.id);
                const dependentesIdsNovos = dependentesData.map(dep => dep.id).filter(id => id);
    
                for (const dependente of dependentesExistentes) {
                    if (!dependentesIdsNovos.includes(dependente.id)) {
                        await dependente.destroy({ transaction: t });
                    }
                }
    
                for (const dependenteData of dependentesData) {
                    if (dependentesIdsExistentes.includes(dependenteData.id)) {
                        const dependente = dependentesExistentes.find(dep => dep.id === dependenteData.id);
                        if (dependenteData.nomeDependente) dependente.nomeDependente = dependenteData.nomeDependente;
                        if (dependenteData.nascimentoDependente) dependente.nascimentoDependente = dependenteData.nascimentoDependente;
                        if (dependenteData.cpfDependente) dependente.cpfDependente = dependenteData.cpfDependente;
                        if (dependenteData.localNascimentoDependente) dependente.localNascimentoDependente = dependenteData.localNascimentoDependente;
                        await dependente.save({ transaction: t });
                    } else {
                        await database.dependentes.create({
                            id: uuidv4(),
                            nomeDependente: dependenteData.nomeDependente,
                            nascimentoDependente: dependenteData.nascimentoDependente,
                            cpfDependente: dependenteData.cpfDependente,
                            localNascimentoDependente: dependenteData.localNascimentoDependente,
                            funcionario_id: funcionario.id
                        }, { transaction: t });
                    }
                }
            }
    
            await t.commit();
    
            return funcionario;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao editar funcionário:', error.message);
            throw error;
        }
    };    
}

module.exports = AppService;
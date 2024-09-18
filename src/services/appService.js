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

        let usuario = await database.usuarios.findOne({
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
            qntSocios, socios, senha
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
            let qntEmpresas = 0;
            
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
                
                newUser.empresa_id = [newCompany.id];
                await newUser.save({ transaction: t });
   
                for (const socio of socios) {
                    await database.socios.create({
                        id: uuidv4(),
                        nomeSocio: socio.nomeSocio,
                        cpfSocio: socio.cpfSocio,
                        emailSocio: socio.emailSocio,
                        telefoneSocio: socio.telefoneSocio,
                        empresa_id: newCompany.id
                    }, { transaction: t });
                }
            };
    
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
                    <p>Obrigado por se cadastrar em nosso serviço!</p>
                    
                    <p>Para acessar sua conta, visite nosso site <a href='https://escritoriokuster.netlify.app/login'>aqui</a> e faça login usando o e-mail cadastrado em nosso sistema.</p>
    
                    <ul>
                        <li><strong>E-mail:</strong> ${emailDestino}</li>
                    </ul>
    
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

    async listarUsuarios() {
        try {
            const usuarios = await database.usuarios.findAll();
            return usuarios;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };

    async editarUsuario(dto) {
        const {
            nome, emailPessoal, telefonePessoal, cpf, dataNascimento, tipo
        } = dto;
    
        const usuario = await database.usuarios.findOne({ where: { cpf } });
    
        if (!usuario) {
            throw new Error('Usuário não encontrado.');
        }
    
        const t = await sequelize.transaction();
    
        try {
            if (nome) usuario.nome = nome;
            if (emailPessoal) usuario.emailPessoal = emailPessoal;
            if (telefonePessoal) usuario.telefonePessoal = telefonePessoal;
            if (cpf) usuario.cpf = cpf;
            if (dataNascimento) usuario.dataNascimento = dataNascimento;
            if (tipo) usuario.tipo = tipo;
                
            await usuario.save({ transaction: t });    
            await t.commit();
    
            return usuario;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao editar usuário:', error.message);
            throw error;
        }
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
    
            usuario.empresa_id = [...(usuario.empresa_id || []), newCompany.id];
            await usuario.save({ transaction: t });
    
            await database.usuarios.update(
                { possuiEmpresa: true, qntEmpresas: usuario.qntEmpresas + 1 },
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
                as: 'empresas'
            }]
        });
    
        if (!usuario || !usuario.empresas) {
            return [];  
        }
    
        return usuario.empresas;  
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
            nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, cpf, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa,
            complementoCasa, bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge, pis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona, secao, funcao, dataAdmissao, salario, contratoExperiencia, horarios, insalubridade,
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
            cpf, nome, email, telefone, sexo, corEtnia, dataNascimento, localNascimento, rg, orgaoExpedidor, dataRg, cep, endereco, numeroCasa, complementoCasa,
            bairro, cidade, estado, nomeMae, nomePai, escolaridade, estadoCivil, nomeConjuge,
            pis, dataPis, numeroCt, serie, dataCt, carteiraDigital, tituloEleitoral, zona,
            secao, funcao, dataAdmissao, salario,
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
            await t.commit();
    
            return funcionario;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao editar funcionário:', error.message);
            throw error;
        }
    };    

    async buscarFuncionariosPorEmpresaIds(empresa_ids) {
        const funcionarios = await database.funcionarios.findAll({
            where: {
                empresa_id: {
                    [database.Sequelize.Op.in]: empresa_ids
                }
            }
        });

        if (empresa_ids.length === 0) {
            throw new Error('Nenhuma empresa associada.');
        }       
    
        if (funcionarios.length === 0) {
            throw new Error('Nenhum funcionário encontrado para as empresas associadas.');
        }
    
        return funcionarios;
    };    

    async buscarDependentesPorFuncionarioIds(funcionario_ids) {
        const dependentes = await database.dependentes.findAll({
            where: {
                funcionario_id: {
                    [database.Sequelize.Op.in]: funcionario_ids
                }
            }
        });

        if (dependentes.length === 0) {
            throw new Error('Nenhum dependente encontrado.');
        }        

        return dependentes;
    };

    async adicionarDependente(funcionario_id, dependenteDto) {
        const { nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente } = dependenteDto;
        const funcionario = await database.funcionarios.findByPk(funcionario_id);
        
        if (!funcionario) {
            throw new Error('Funcionário não encontrado.');
        }

        const formatDate = (date) => {
            const formats = ['YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'];
        
            let formattedDate = moment(date, formats, true);
            
            if (!formattedDate.isValid()) {
                formattedDate = moment(date);  
            }
            
            return formattedDate.isValid() ? formattedDate.format('YYYY-MM-DD') : '';
        };

        const formattedDataNascimentoDependente = formatDate(dataNascimentoDependente);

        try {
            const novoDependente = await database.dependentes.create({
                id: uuidv4(),
                nomeDependente,
                dataNascimentoDependente: formattedDataNascimentoDependente,
                cpfDependente,
                localNascimentoDependente,
                funcionario_id
            });

            return novoDependente;
        } catch (error) {
            console.error('Erro ao adicionar dependente:', error);
            throw error;
        }
    };

    async removerDependente(dependente_id) {
        const dependente = await database.dependentes.findByPk(dependente_id);

        if (!dependente) {
            throw new Error('Dependente não encontrado.');
        }

        try {
            await dependente.destroy();
            return { message: 'Dependente removido com sucesso.' };
        } catch (error) {
            console.error('Erro ao remover dependente:', error);
            throw error;
        }
    };

    async editarDependente(dto) {
        const {
            nomeDependente, dataNascimentoDependente, cpfDependente, localNascimentoDependente
        } = dto;
    
        const dependente = await database.dependentes.findOne({ where: { cpfDependente } });
    
        if (!dependente) {
            throw new Error('Dependente não encontrado.');
        }
    
        const t = await sequelize.transaction();
    
        try {
            if (nomeDependente) dependente.nomeDependente = nomeDependente;
            if (dataNascimentoDependente) dependente.dataNascimentoDependente = dataNascimentoDependente;
            if (cpfDependente) dependente.cpfDependente = cpfDependente;
            if (localNascimentoDependente) dependente.localNascimentoDependente = localNascimentoDependente;
        
            await dependente.save({ transaction: t });
    
            await t.commit();  
            return dependente;
        } catch (error) {
            await t.rollback();
            console.error('Erro ao editar dependente:', error.message);
            throw error;
        }
    };    

    async adicionarEnderecoEmpresa(empresa_id, enderecoDto) {
        const { cep, endereco, numero, complemento, bairro, cidade, estado } = enderecoDto;

        const empresa = await database.empresas.findByPk(empresa_id);

        if (!empresa) {
            throw new Error('Empresa não encontrada.');
        }

        try {
            empresa.cep = cep;
            empresa.endereco = endereco;
            empresa.numero = numero;
            empresa.complemento = complemento;
            empresa.bairro = bairro;
            empresa.cidade = cidade;
            empresa.estado = estado;

            await empresa.save();

            return empresa;
        } catch (error) {
            console.error('Erro ao adicionar endereço à empresa:', error);
            throw error;
        }
    };

    async listarEmpresas() {
        try {
            const empresas = await database.empresas.findAll();
            return empresas;
        } catch (error) {
            console.error('Erro ao listar empresas:', error);
            throw error;
        }
    };

    async listarUsuarios() {
        try {
            const usuarios = await database.usuarios.findAll();
            return usuarios;
        } catch (error) {
            console.error('Erro ao listar usuários:', error);
            throw error;
        }
    };

    async listarFuncionarios() {
        try {
            const funcionarios = await database.funcionarios.findAll();
            return funcionarios;
        } catch (error) {
            console.error('Erro ao listar funcionários:', error);
            throw error;
        }
    };    
}

module.exports = AppService;
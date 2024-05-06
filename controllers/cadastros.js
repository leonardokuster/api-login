const express = require("express");
const db = require("../db/models");
const router = express.Router();
const transporter = require("./nodemailer");
const bcrypt = require('bcrypt'); 

router.get("/", (req, res) => {
    db.cadastros.findAll()
      .then((cadastro) => {
        res.render("index", { cadastro: cadastro });
      })
      .catch((error) => {
        console.error("Erro ao buscar cadastros:", error);
        res.status(500).send("Erro interno do servidor");
      });
});

router.post("/login", async (req, res) => {
    const { email, senha } = req.body;
  
    try {
        const cadastro = await db.cadastros.findOne({ where: { email: email } });
        if (!cadastro) {
            return res.json({
                error: true,
                message: "Usuário não encontrado."
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, cadastro.senha);
        if (!senhaCorreta) {
            return res.json({
                error: true,
                message: "Senha inválida."
            });
        }

        if (cadastro.tipo === 'admin') {
            return res.redirect("../views/admin.ejs");
        } else {
            return res.redirect("../views/normal.ejs");
        }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({
          error: true,
          message: "Erro interno do servidor"
      });
    }
});
    
router.post("/salvarcadastro", async (req, res) => {
    const { nome, email, senha, confisenha } = req.body;
  
    if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "") {
        return res.status(400).json({ message: "Não foi possível realizar seu cadastro, verifique os dados informados." });
    }
  
    try {
        const nomeExistente = await db.cadastros.findOne({ where: { nome: nome } });
        if (nomeExistente) {
            return res.status(400).json({ error: true, message: "Nome de usuário já está em uso." });
        }
        
        const emailExistente = await db.cadastros.findOne({ where: { email: email } });
        if (emailExistente) {
            return res.status(400).json({ error: true, message: "E-mail já está em uso." });
        }
  
        const hashedSenha = await bcrypt.hash(senha, 10);
        await db.cadastros.create({ nome, email, senha: hashedSenha });

        res.status(201).json({
            error: false,
            message: "Conta criada com sucesso! Verifique seu e-mail com os dados de login."
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
        console.log("Email enviado:", info.response);
        } catch (error) {
        console.error("Erro ao salvar cadastro:", error);
        res.status(500).json({
            error: true,
            message: "Erro ao salvar cadastro"
        });
    }
});


module.exports = router;
  
  
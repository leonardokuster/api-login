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
        return res.redirect("/admin");
      } else {
        return res.redirect("/normal");
      }
  
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      res.status(500).json({
          error: true,
          message: "Erro interno do servidor"
      });
    }
});
      
router.get("/cadastrar", (req, res) => {
    res.render("cadastro");
});
  
router.post("/salvarcadastro", async (req, res) => {
    const { nome, email, senha, confisenha } = req.body;
  
    if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "") {
      return res.redirect("/cadastrar");
    }
  
    try {
      const hashedSenha = await bcrypt.hash(senha, 10);
      await db.cadastros.create({ nome, email, senha: hashedSenha });
  
      res.json({
        error: false,
        message: "Conta criada com sucesso! Verifique seu e-mail com os dados de login."
      });
  
      const info = await transporter.sendMail({
        from: "Escritório Kuster <l.kusterr@gmail.com>",
        to: email,
        subject: "Obrigado por realizar seu cadastro!",
        html: `
          <html>
          <body>
            <p>Olá <strong>${nome}</strong>, seu cadastro no Escritório Kuster foi feito com sucesso!</p>
            <p>Para acessar sua conta <a href='https://escritoriokuster.netlify.app/login'><strong>clique aqui<strong></a>, ou acesse https://escritoriokuster.netlify.app/login</p>
            <br></br>
            <p>Login: ${email}</p>
            <p>Senha: ${senha}</p>
            <br></br>
            <p>Para mais informações entre em contato através do email: escritoriokuster@gmail.com</p>
          </body>
          </html>
        `,
      });
      console.log("Email enviado:", info.response);
    } catch (error) {
      console.error("Erro ao salvar cadastro:", error);
      res.status(500).json({
        error: true,
        message: "Erro interno do servidor"
      });
    }
});

router.post("/verificarNome", async (req, res) => {
    const { nome } = req.body;
  
    try {
      const cadastro = await db.cadastros.findOne({ where: { nome: nome } });
      if (cadastro) {
        return res.json({ error: true });
      }
    } catch (error) {
      console.error("Erro ao verificar nome:", error);
      res.status(500).json({
        error: true,
        message: "Erro interno do servidor"
      });
    }
});

router.post("/verificarEmail", async (req, res) => {
    const { email } = req.body;
  
    try {
      const cadastro = await db.cadastros.findOne({ where: { email: email } });
      if (cadastro) {
        return res.json({ error: true });
      } 
    } catch (error) {
      console.error("Erro ao verificar email:", error);
      res.status(500).json({
        error: true,
        message: "Erro interno do servidor"
      });
    }
});
  
module.exports = router;
  
  
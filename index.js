const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Cadastro = require("./database/Cadastro");
const transporter = require("./database/nodemailer");
const bcrypt = require('bcrypt'); 

connection.authenticate()
  .then(() => {
    console.log("Conexão feita com o banco de dados!");
  })
  .catch((erro) => {
    console.error("Erro ao conectar ao banco de dados:", erro);
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type"); 
    next();
});

app.use(cors());

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Cadastro.findAll()
    .then((cadastro) => {
      res.render("index", { cadastro: cadastro });
    })
    .catch((error) => {
      console.error("Erro ao buscar cadastros:", error);
      res.status(500).send("Erro interno do servidor");
    });
});
  
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const cadastro = await Cadastro.findOne({ where: { email: email } });
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

    res.render("portal");
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    res.status(500).json({
        error: true,
        message: "Erro interno do servidor"
    });
  }
});

app.get("/cadastrar", (req, res) => {
  res.render("cadastro");
});

app.post("/salvarcadastro", async (req, res) => {
  const { nome, email, senha, confisenha } = req.body;

  if (senha !== confisenha || nome === "" || email === "" || senha === "" || confisenha === "") {
    return res.redirect("/cadastrar");
  }

  try {
    const hashedSenha = await bcrypt.hash(senha, 10);
    await Cadastro.create({ nome, email, senha: hashedSenha });

    res.json({
      error: false,
      message: "Conta criada com sucesso! Verifique seu email com os dados de login."
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

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});


const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");

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


const cadastros = require("../controllers/cadastros");
app.use('/escritoriokuster', cadastros);


const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});
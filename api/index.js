const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require("body-parser");
const NodeCache = require("node-cache");

const cache = new NodeCache();

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

app.use('/escritoriokuster', async (req, res, next) => {
  const cacheKey = req.originalUrl;
  const cachedData = cache.get(cacheKey);
  
  if (cachedData) {
      return res.json(cachedData);
  } else {
      try {
          const data = await cadastros(req, res);
          cache.set(cacheKey, data, 60000); 
          return res.json(data);
      } catch (error) {
          return res.status(500).json({ error: true, message: "Erro interno do servidor" });
      }
  }
});

const PORT = process.env.PORT || 5656;
app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});


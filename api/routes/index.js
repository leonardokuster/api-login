const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const usuario = require('./usuarioRoute');

module.exports = app => {

  app.use(bodyParser.urlencoded({extended: false}));
  app.use(bodyParser.json());

  app.use(cors());

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type"); 
    next();
  });

  app.use(usuario);

  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

};
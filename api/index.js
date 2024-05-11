const express = require("express");
const routes = require('./routes');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(expressLayouts);
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));

routes(app);

app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});

module.exports = app
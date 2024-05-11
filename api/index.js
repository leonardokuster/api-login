const express = require("express");
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


routes(app);

app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});

module.exports = app
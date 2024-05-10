const express = require("express");
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 8080;

routes(app);

app.listen(PORT, () => {
  console.log(`A aplicação está funcionando na porta ${PORT}!`);
});

module.exports = app
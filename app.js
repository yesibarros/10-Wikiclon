const express = require('express');
const app = express();
const volleyball = require('volleyball');
const nunjucks = require('nunjucks');
const path = require('path');
const bodyParser = require('body-parser');

const routes = require('./routes');
const db = require('./db');

// templating boilerplate setup
app.engine('html', nunjucks.render); // como renderear templates html
app.set('view engine', 'html'); // que extensiones de archivo tienen los templates
var env = nunjucks.configure('views', {noCache: true}); // donde encontrar las views
var AutoEscapeExtension = require("nunjucks-autoescape")(nunjucks);
env.addExtension('AutoEscapeExtension', new AutoEscapeExtension(env));

// logging middleware
app.use(volleyball);

// body parsing middleware
app.use(bodyParser.urlencoded({ extended: true })); // para HTML form submits
app.use(bodyParser.json()); // seria para AJAX requests

//https://expressjs.com/es/starter/static-files.html
app.use(express.static(path.join(__dirname, '/public')));

// rutas modulares
app.use('/', routes);

// error middleware -> https://expressjs.com/es/guide/error-handling.html
app.use((err, req, res, next) => {
  //res.status(404).send(err);
  res.sendStatus(404).send(err)
})

//connecting vía sequelize to postgres and sync
db.sync()
  .then(() => {
    console.log('Conectado a la base de datos');
    app.listen(3000);
    console.log('Servidor escuchando en el puerto 3000');
  })
  .catch(console.error);

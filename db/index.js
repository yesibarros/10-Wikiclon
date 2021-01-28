const Sequelize = require("sequelize");

const db = new Sequelize("postgres://postgres@localhost:5432/wiki", {
  //already existing database
  logging: false, // Debugging queries https://stackoverflow.com/questions/33232147/sequelize-query-returns-same-result-twice
});

module.exports = db;

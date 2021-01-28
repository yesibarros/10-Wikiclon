const Page = require("./Page");
const User = require("./User");

Page.belongsTo(User, { as: "author" }); //http://docs.sequelizejs.com/manual/associations.html

module.exports = { User, Page };

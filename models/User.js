const S = require('sequelize');
const db = require('../db');

class User extends S.Model {}

User.init({
  name: {
    type: S.STRING,
    allowNull: false,
  },
  email: {
    type: S.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
}, { sequelize : db, modelName: 'user' });

module.exports = User;

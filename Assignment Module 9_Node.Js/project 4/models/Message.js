const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Message = sequelize.define('Message', {
  title:    { type: DataTypes.STRING, allowNull: false },
  text:     { type: DataTypes.TEXT, allowNull: false },
});

module.exports = Message;
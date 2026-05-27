const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    port: 3000,
    dialect: 'postgres',
    logging: false,
  }
);

module.exports = sequelize;
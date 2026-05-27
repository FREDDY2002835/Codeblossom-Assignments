const sequelize = require('../config/database');
const User = require('./User');
const Message = require('./Message');

User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

const syncDB = async () => {
  await sequelize.sync({ alter: true });
  console.log('Database synced');
};

module.exports = { sequelize, User, Message, syncDB };
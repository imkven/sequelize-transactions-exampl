const config = require('config');
const path = require('path');
const fs = require('fs');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const db = {};
const names = [];

const { database, username, password } = config.db;
const dbConfigs = Object.assign({}, config.db);
delete dbConfigs.database;
delete dbConfigs.username;
delete dbConfigs.password;

const sequelize = new Sequelize(database, username, password, {
  ...dbConfigs
});

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    /* eslint-disable-next-line global-require, import/no-dynamic-require */
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
    names.push(model.name);
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

function init() {
  // no more init required as we are using migration now
}

async function terminate() {
  return sequelize.close();
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.init = init;
db.terminate = terminate;
db.names = names;

module.exports = db;

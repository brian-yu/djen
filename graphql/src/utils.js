const SQL = require('sequelize');

module.exports.createStore = () => {
  const Op = SQL.Op;
  const operatorsAliases = {
    $in: Op.in,
  };

  const db = new SQL("database", "username", "password", {
    dialect: "postgres",
    host: process.env.DB_HOTS,
  });

  const users = db.define("user", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    github: SQL.STRING,
    token: SQL.STRING,
  });

  const submissions = db.define("submission", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    html: SQL.STRING,
    css: SQL.STRING,
    js: SQL.STRING,
    user_id: {
      type: DB.INTEGER,
      references: {
        model: users,
      }
    },
    flagged: SQL.BOOLEAN,
  });

  const comments = db.define("comment", {
    id: {
      type: SQL.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    createdAt: SQL.DATE,
    updatedAt: SQL.DATE,
    launchId: SQL.INTEGER,
    html: SQL.STRING,
    css: SQL.STRING,
    js: SQL.STRING,
    userId: SQL.INTEGER,
    flagged: SQL.BOOLEAN,
  });

  return { users, submissions };
};

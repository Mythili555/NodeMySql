const Sequelize = require('sequelize');
const env = require('dotenv');

env.config();

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;


const sequelize = new Sequelize("ahp", "root", "Covaijobportal", {
  dialect: 'mysql',
  host: "127.0.0.1",
  port: "3306",
  logging: true
});

module.exports = sequelize;

// host: "127.0.0.1",
//   user: "root",
//   password: "Covaijobportal"
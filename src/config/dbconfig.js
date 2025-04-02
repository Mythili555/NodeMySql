const Sequelize = require('sequelize');
const env = require('dotenv');

env.config();

const { DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;


const sequelize = new Sequelize("myappdb", "admin", "admin1234", {
  dialect: 'mysql',
  host: "myappdb.cw3oq84aures.us-east-1.rds.amazonaws.com",
  port: "3306",
  logging: true
});

module.exports = sequelize;

// host: "127.0.0.1",
//   user: "root",
//   password: "Covaijobportal"

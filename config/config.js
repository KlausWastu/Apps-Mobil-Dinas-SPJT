const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const { DB_DATABASE, DB_USERNAME, DB_PASSWORD, DB_HOST } = process.env;

module.exports = {
  serviceName: process.env.SERVICE_NAME,
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "mysql",
    timezone: "+07:00",
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "mysql",
    timezone: "+07:00",
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    host: DB_HOST,
    dialect: "mysql",
    timezone: "+07:00",
  },
  rootPath: path.resolve(__dirname, ".."),
};

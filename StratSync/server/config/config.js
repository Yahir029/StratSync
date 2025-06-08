// server/config/config.js
/*
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  }
};
*/
const config = {
  development: {
   username: 'stratsync_user',
    password: 'stratDBconect01$',
    database: 'stratsync',
    host: 'localhost',
    dialect: 'postgres',
    // otros campos opcionales como logging, port, etc.
  },
  // otros entornos si los necesitas
};

export default config;

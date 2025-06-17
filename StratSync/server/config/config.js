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
//const config = {
  //development: {
   //username: 'stratsync_user',
    //password: 'stratDBconect01$',
    //database: 'stratsync',
    //host: 'localhost',
    //dialect: 'postgres',
    // otros campos opcionales como logging, port, etc.
  //},
  // otros entornos si los necesitas
//};


require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'stratsync_user',
    password: process.env.DB_PASSWORD || 'stratDBconect01$',
    database: process.env.DB_NAME || 'stratsync',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};


export default config;

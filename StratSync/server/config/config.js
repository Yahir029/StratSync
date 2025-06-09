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
 // development: {
 //  username: 'stratsync_user',
   // password: 'stratDBconect01$',
    //database: 'stratsync',
    //host: 'localhost',
    //dialect: 'postgres',
    // otros campos opcionales como logging, port, etc.
  //},
  // otros entornos si los necesitas
//};



// config.js
//import app from '../app.js';
//import sequelize from './db.js'; // Ajusta la ruta si es necesario

//async function startServer() {
  //try {
    //await sequelize.authenticate();
    //console.log('✅ Conectado correctamente a la base de datos Render');

    //app.listen(5000, '0.0.0.0', () => {
      //console.log('🚀 Servidor escuchando en el puerto 5000');
    //});
  //} catch (error) {
    //console.error('❌ Error al conectar con la base de datos:', error);
    //process.exit(1);
  //}
//}

//startServer();

const config = {
  development: {
    username: 'stratsync_user',
    password: 'stratDBconect01$',
    database: 'stratsync',
    host: 'localhost',
    dialect: 'postgres',
    use_env_variable: 'DATABASE_URL', // 👈 Agregado aquí
  },
};

export default config;
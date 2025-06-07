// server/scripts/testConnection.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('stratsync', 'stratsync_user', 'stratDBconect01$', {
  host: 'localhost',
  dialect: 'postgres',
  port: 5432,
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa a la base de datos');
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  } finally {
    await sequelize.close();
  }
})();

import app from './app.js';
import sequelize from './config/db.js'; // Asegúrate de que esta ruta sea correcta

// Probar conexión a la base de datos
async function startServer() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado correctamente a la base de datos Render');

    app.listen(5000, '0.0.0.0', () => {
      console.log('🚀 Servidor escuchando en el puerto 5000');
    }); 
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1); // Detener ejecución si falla la conexión
  }
}

startServer();

import app from './app.js';
import sequelize from './config/db.js';

const PORT = process.env.PORT || 4000;

(async () => {
  try {
    await sequelize.sync({ alter: true });   // ← crea/actualiza tablas
    console.log('🔄 Tablas sincronizadas');
    app.listen(PORT, () => console.log(`🚀 Server en ${PORT}`));
  } catch (e) {
    console.error('Error DB:', e);
  }
})();

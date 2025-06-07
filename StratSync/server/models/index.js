// models/index.js
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import configFile from '../config/config.js';
import { fileURLToPath, pathToFileURL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env];

const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Filtrar archivos modelo válidos (.js que no sean index.js)
const files = fs.readdirSync(__dirname).filter(
  (file) =>
    file.indexOf('.') !== 0 &&
    file !== basename &&
    file.slice(-3) === '.js'
);

for (const file of files) {
  const filePath = path.join(__dirname, file);
  const fileUrl = pathToFileURL(filePath).href;

  try {
    const { default: modelFunc } = await import(fileUrl);

    if (typeof modelFunc !== 'function') {
      console.error(`❌ El archivo "${file}" no exporta una función por defecto.`);
      continue;
    }

    const model = modelFunc(sequelize, DataTypes);

    if (!model || !model.name) {
      console.error(`❌ El archivo "${file}" no retornó un modelo válido.`);
      continue;
    }

    db[model.name] = model;
    console.log(`✅ Modelo cargado: ${model.name}`);
  } catch (err) {
    console.error(`❌ Error al importar modelo "${file}":`, err);
  }
}

// Ejecutar las asociaciones si existen
Object.keys(db).forEach((modelName) => {
  if (typeof db[modelName].associate === 'function') {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

console.log(`✅ ${Object.keys(db).length} modelos cargados exitosamente.`);

export default db;

// Exportar algunos modelos específicos para acceso directo
export const { Materia, Categoria, Profesor, Horario } = db;

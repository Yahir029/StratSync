// server/models/administrador.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Administrador = sequelize.define('Administrador', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  usuario: {            // Cambia "usuario" al nombre real de la columna de usuario en la tabla
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  contraseña_hash: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  tableName: 'administradores',  // Nombre real de la tabla en la BD
  timestamps: false,
});

// Función para obtener administrador por usuario
async function getAdminByUsuario(usuario) {
  try {
    const admin = await Administrador.findOne({ where: { usuario } });
    return admin;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  Administrador,
  getAdminByUsuario,
};

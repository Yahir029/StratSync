'use strict';

module.exports = (sequelize, DataTypes) => {
  const Administrador = sequelize.define('Administrador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contraseña_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ultimo_acceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    tableName: 'administradores', // 👈 Asegura que apunte a la tabla real
    timestamps: false, // 👈 Si tu tabla no tiene createdAt/updatedAt
  });

  return Administrador;
};

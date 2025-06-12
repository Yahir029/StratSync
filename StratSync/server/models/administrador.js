// server/models/administrador.js

export default (sequelize, DataTypes) => {
  const Administrador = sequelize.define('Administrador', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    contraseña_hash: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'administradores',
    timestamps: false
  });

  return Administrador;
};

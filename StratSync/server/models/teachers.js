// server/models/teacher.js

export default (sequelize, DataTypes) => {
  const Teacher = sequelize.define('Teacher', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    telefono: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    biografia: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    categoria_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    foto_perfil: {
      type: DataTypes.BLOB,
      allowNull: true
    },
    codigo_acceso_maestro: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fecha_creacion: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    creado_por: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'profesores',
    timestamps: false
  });

  return Teacher;
};

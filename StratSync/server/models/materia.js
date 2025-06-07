// models/materia.js
export default (sequelize, DataTypes) => {
  const Materia = sequelize.define('Materia', {
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
    },
    categoria_id: {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'materias',
    timestamps: false,
  });

 Materia.associate = (models) => {
  Materia.belongsTo(models.Categoria, {
    foreignKey: 'categoria_id',
    as: 'categoria',
    onDelete: 'SET NULL' // Añade esto para consistencia
  });
};

  return Materia;
};

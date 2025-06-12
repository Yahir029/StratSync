// models/categoria.js
export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
  }, {
    tableName: 'categorias',
    timestamps: false,
    underscored: true // Añade esto para compatibilidad con snake_case
  });

  Categoria.associate = (models) => {
    Categoria.hasMany(models.Materia, {
      foreignKey: 'categoria_id',
      as: 'materias' // Nombre de la relación (plural)
    });

    Categoria.hasMany(models.Teacher, {
      foreignKey: 'categoria_id',
      as: 'teachers', // Nombre de la relación (plural)
      onDelete: 'SET NULL'
    });
  };

  return Categoria;
};

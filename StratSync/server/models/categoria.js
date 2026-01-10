// models/categoria.js
export default (sequelize, DataTypes) => {
  const Categoria = sequelize.define('Categoria', {
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  }, {
    tableName: 'categorias',
    timestamps: false,
  });

  Categoria.associate = models => {
    Categoria.hasMany(models.Materia, {
      foreignKey: 'categoria_id',
      onDelete: 'SET NULL',
    });
    Categoria.hasMany(models.Teacher, {
      foreignKey: 'categoria_id',
      onDelete: 'SET NULL',
    });
  };

  return Categoria;
};

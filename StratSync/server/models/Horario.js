// models/horario.js
export default (sequelize, DataTypes) => {
  const Horario = sequelize.define('Horario', {
    dia_semana: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    hora_inicio: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    hora_fin: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    profesor_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    materia_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    tableName: 'horarios',
    timestamps: false,
  });

  Horario.associate = (models) => {
    Horario.belongsTo(models.Teacher, {
      foreignKey: 'profesor_id',
      as: 'profesor',
    });

    Horario.belongsTo(models.Materia, {
      foreignKey: 'materia_id',
      as: 'materia',
    });
  };

  return Horario;
};

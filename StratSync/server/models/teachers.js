// server/models/teacher.js

export default (sequelize, DataTypes) => {
  const Teacher = sequelize.define('profesores', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    photoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Sin asignar'
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'teachers',
    timestamps: false
  });

  return Teacher;
};

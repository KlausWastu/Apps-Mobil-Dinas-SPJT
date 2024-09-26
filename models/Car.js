const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Car = sequelize.define(
    "Car",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      number_plate: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      information: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      createdAt: {
        field: "created_at",
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        field: "updated_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
      deletedAt: {
        field: "deleted_at",
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    { tableName: "cars", paranoid: true, timestamps: true }
  );
  Car.associate = (models) => {
    Car.hasMany(models.CarsUsage, {
      foreignKey: "car_id",
      as: "cars",
    });
  };
  return Car;
};

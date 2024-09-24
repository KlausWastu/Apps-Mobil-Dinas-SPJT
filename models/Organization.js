const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define(
    "Organization",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      kode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    { tableName: "organizations", paranoid: true, timestamps: true }
  );
  return Organization;
};

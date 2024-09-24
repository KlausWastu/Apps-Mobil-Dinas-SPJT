module.exports = (sequelize, DataTypes) => {
  const Log = sequelize.define(
    "Log",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM,
        values: ["create", "update", "delete"],
        default: "create",
        allowNull: false,
      },
      data_prev: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      data_current: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATE,
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
    { timestamps: true, tableName: "logs", paranoid: true }
  );
  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: "user_id",
      as: "users",
    });
  };
  return Log;
};

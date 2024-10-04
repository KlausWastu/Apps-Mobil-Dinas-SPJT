module.exports = (sequelize, DataTypes) => {
  const CarUsage = sequelize.define(
    "CarUsage",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      car_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date_departure: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      date_back: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      needs: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      location_destination: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      passenger: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      user_organization: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      km_last: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      km_trip: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tol_rates: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      parking_rates: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      fuel_rates: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      photos: {
        type: DataTypes.TEXT,
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
    { timestamps: true, tableName: "cars-usage", paranoid: true }
  );
  CarUsage.associate = (models) => {
    CarUsage.belongsTo(models.Driver, {
      foreignKey: "driver_id",
      as: "driver",
    });
    CarUsage.belongsTo(models.Car, {
      foreignKey: "car_id",
      as: "car",
    });
  };
  return CarUsage;
};

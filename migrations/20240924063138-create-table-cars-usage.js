"use strict";

const { query } = require("express");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("cars-usage", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      car_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date_departure: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      date_back: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      location_destination: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      passenger: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      user_organization: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      km_last: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      km_trip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      tol_rates: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      parking_rates: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      fuel_rates: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      note: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.addConstraint("cars-usage", {
      type: "foreign key",
      name: "cars_usage_driver_id",
      fields: ["driver_id"],
      references: {
        table: "drivers",
        field: "id",
      },
    });
    await queryInterface.addConstraint("cars-usage", {
      type: "foreign key",
      name: "cars_usage_car_id",
      fields: ["car_id"],
      references: {
        table: "cars",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("cars-usage");
  },
};

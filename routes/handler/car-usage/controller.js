const { Model } = require("sequelize");
const {
  CarUsage,
  Car,
  Driver,
  Organization,
  User,
  Log,
} = require("../../../models");
const judul = "Car Usage";
const moment = require("moment");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: [
          "id",
          "date_departure",
          "date_back",
          "location_destination",
          "passenger",
          "user_organization",
          "km_last",
          "km_trip",
          "fuel_rates",
          "tol_rates",
          "parking_rates",
          "note",
        ],
        include: [
          {
            model: Driver,
            as: "driver",
            attributes: ["name"],
          },
          {
            model: Car,
            as: "car",
            attributes: ["number_plate"],
          },
        ],
        where: { deleted_at: null },
      };
      const CarsUsage = await CarUsage.findAll(sqlOptions);
      const carsUsage = CarsUsage.map((usage) => {
        return {
          ...usage.dataValues,
          date_departure: moment(usage.date_departure).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
          date_back: moment(usage.date_back).format("DD/MM/YYYY HH:mm:ss"),
        };
      });
      res.render("pages/car-usage/view_car_usage", {
        alert,
        title: judul,
        carsUsage,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
  viewCreate: async (req, res) => {
    try {
      const sqlOptions1 = {
        attributes: ["id", "number_plate"],
        where: { deleted_at: null },
      };
      const sqlOptions2 = {
        attributes: ["id", "name"],
        where: { deleted_at: null },
      };
      const sqlOptions3 = {
        attributes: ["id", "code", "name"],
        where: { deleted_at: null },
      };
      const cars = await Car.findAll(sqlOptions1);
      const drivers = await Driver.findAll(sqlOptions2);
      const organizations = await Organization.findAll(sqlOptions3);
      res.render("pages/car-usage/create", {
        title: judul,
        cars,
        drivers,
        organizations,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
  actionCreate: async (req, res) => {
    try {
      // Handle CarUsage
      const data = {
        driver_id: req.body.driver_id,
        car_id: req.body.car_id,
        date_departure: req.body.date_departure,
        date_back: req.body.date_back,
        location_destination: req.body.location_destination,
        passenger: req.body.passenger,
        user_organization: Array.isArray(req.body.user_organization)
          ? JSON.stringify(req.body.user_organization) // Handle multiple choice (array)
          : req.body.user_organization, // Handle single choice (string)
        km_last: req.body.km_last,
        km_trip: req.body.km_trip,
        tol_rates: req.body.tol_rates === "" ? null : req.body.tol_rates,
        parking_rates:
          req.body.parking_rates === "" ? null : req.body.parking_rates,
        fuel_rates: req.body.fuel_rates === "" ? null : req.body.fuel_rates,
        note: req.body.note === "" ? null : req.body.note,
      };

      const carUsage = await CarUsage.create(data);

      //   Handle Log
      const dateNow = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      const dataLog = {
        user_id: req.session.user.id,
        type: "create",
        data_current: JSON.stringify(carUsage),
        date: dateNow,
      };
      await Log.create(dataLog);
      req.flash("alertMessage", `Penggunaan Mobil berhasil ditambahkan.`);
      req.flash("alertStatus", "success");
      res.redirect("/cars-usage");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const Usage = await CarUsage.findByPk(req.params.id);

      const sqlOptions1 = {
        attributes: ["id", "number_plate"],
        where: { deleted_at: null },
      };
      const sqlOptions2 = {
        attributes: ["id", "name"],
        where: { deleted_at: null },
      };
      const sqlOptions3 = {
        attributes: ["id", "code", "name"],
        where: { deleted_at: null },
      };
      const cars = await Car.findAll(sqlOptions1);
      const drivers = await Driver.findAll(sqlOptions2);
      const organizations = await Organization.findAll(sqlOptions3);

      const carsUsage = {
        ...Usage.dataValues,
        date_departure: moment(Usage.date_departure).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        date_back: moment(Usage.date_back).format("DD/MM/YYYY HH:mm:ss"),
      };
      let userOrganizationParsed = null;
      try {
        userOrganizationParsed = JSON.parse(carsUsage.user_organization);
      } catch (e) {
        userOrganizationParsed = carsUsage.user_organization;
      }
      res.render("pages/car-usage/edit", {
        title: judul,
        carsUsage,
        cars,
        drivers,
        organizations,
        userOrganizationParsed,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const carUsage = await CarUsage.findByPk(req.params.id);
      const dataPrev = JSON.parse(JSON.stringify(carUsage.dataValues));

      //   Handle Car Usage
      const data = {
        driver_id: req.body.driver_id,
        car_id: req.body.car_id,
        date_departure: req.body.date_departure,
        date_back: req.body.date_back,
        location_destination: req.body.location_destination,
        passenger: req.body.passenger,
        user_organization: Array.isArray(req.body.user_organization)
          ? JSON.stringify(req.body.user_organization) // Handle multiple choice (array)
          : req.body.user_organization, // Handle single choice (string)
        km_last: req.body.km_last,
        km_trip: req.body.km_trip,
        tol_rates: req.body.tol_rates === "" ? null : req.body.tol_rates,
        parking_rates:
          req.body.parking_rates === "" ? null : req.body.parking_rates,
        fuel_rates: req.body.fuel_rates === "" ? null : req.body.fuel_rates,
        note: req.body.note === "" ? null : req.body.note,
      };
      const updateData = await carUsage.update(data);

      //   Handle Log
      const dateNow = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      const dataLog = {
        user_id: req.session.user.id,
        type: "update",
        data_prev: JSON.stringify(dataPrev),
        data_current: JSON.stringify(updateData),
        date: dateNow,
      };
      await Log.create(dataLog);

      req.flash("alertMessage", `Penggunaan Mobil berhasil ditambahkan.`);
      req.flash("alertStatus", "success");
      res.redirect("/cars-usage");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
  viewDetail: async (req, res) => {
    try {
      const carsUsage = await CarUsage.findByPk(req.params.id);
      const sqlOptions1 = {
        attributes: ["id", "number_plate"],
        where: { deleted_at: null },
      };
      const sqlOptions2 = {
        attributes: ["id", "name"],
        where: { deleted_at: null },
      };
      const sqlOptions3 = {
        attributes: ["id", "code", "name"],
        where: { deleted_at: null },
      };

      let userOrganizationParsed = null;
      try {
        userOrganizationParsed = JSON.parse(carsUsage.user_organization);
        if (typeof userOrganizationParsed === "number") {
          userOrganizationParsed = [userOrganizationParsed];
        }
      } catch (e) {
        userOrganizationParsed = carsUsage.user_organization;
      }

      const detailCarUsage = {
        ...carsUsage.dataValues,
        date_departure: moment(carsUsage.date_departure).format(
          "DD/MM/YYYY HH:mm:ss"
        ),
        date_back: moment(carsUsage.date_back).format("DD/MM/YYYY HH:mm:ss"),
      };
      const cars = await Car.findAll(sqlOptions1);
      const drivers = await Driver.findAll(sqlOptions2);
      const organizations = await Organization.findAll(sqlOptions3);
      res.render("pages/car-usage/detail", {
        title: judul,
        userOrganizationParsed,
        detailCarUsage,
        cars,
        organizations,
        drivers,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const carUsage = await CarUsage.findByPk(req.params.id);
      const dataCurrent = JSON.parse(JSON.stringify(carUsage.dataValues));
      // Handle Car Usage
      await carUsage.destroy();

      //   Handle Log
      const dateNow = new Date().toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
      });
      const dataLog = {
        user_id: req.session.user.id,
        type: "delete",
        data_current: JSON.stringify(carUsage),
        date: dateNow,
      };

      await Log.create(dataLog);
      req.flash("alertMessage", `Penggunaan Mobil berhasil dihapus.`);
      req.flash("alertStatus", "success");
      res.redirect("/cars-usage");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars-usage");
    }
  },
};

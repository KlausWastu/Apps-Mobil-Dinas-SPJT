const { Car } = require("../../../models");
const judul = "Car";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: ["id", "number_plate", "information"],
        where: { deleted_at: null },
      };

      const cars = await Car.findAll(sqlOptions);

      res.render("pages/car/view_car", {
        title: judul,
        alert,
        cars,
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
      res.render("pages/car/create", {
        title: judul,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const data = {
        number_plate: req.body.number_plate,
        information: req.body.information === "" ? null : req.body.information,
      };

      await Car.create(data);
      req.flash(
        "alertMessage",
        `Mobil ${data.number_plate} berhasil ditambahkan.`
      );
      req.flash("alertStatus", "success");
      res.redirect("/cars");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const car = await Car.findByPk(req.params.id);
      res.render("pages/car/edit", {
        title: judul,
        car,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const car = await Car.findByPk(req.params.id);
      const data = {
        number_plate: req.body.number_plate,
        information: req.body.information === "" ? null : req.body.information,
      };

      await car.update(data);
      req.flash("alertMessage", `Mobil ${car.number_plate} berhasil diupdate.`);
      req.flash("alertStatus", "success");
      res.redirect("/cars");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const car = await Car.findByPk(req.params.id);
      await car.destroy();
      req.flash("alertMessage", `Mobil ${car.number_plate} berhasil dihapus.`);
      req.flash("alertStatus", "success");
      res.redirect("/cars");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/cars");
    }
  },
};

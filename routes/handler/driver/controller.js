const { Driver } = require("../../../models");

const judul = "Drivers";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: ["id", "name"],
        where: { deleted_at: null },
      };

      const drivers = await Driver.findAll(sqlOptions);
      res.render("pages/driver/view_driver", {
        alert,
        title: judul,
        drivers,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("pages/driver/create", {
        title: judul,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const data = {
        name: req.body.nameDriver,
      };
      await Driver.create(data);

      req.flash("alertMessage", `Driver ${data.name} berhasil ditambahkan.`);
      req.flash("alertStatus", "success");
      res.redirect("/drivers");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);

      res.render("pages/driver/edit", {
        title: judul,
        driver,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
  actionEdit: async (req, res) => {
    try {
      let data = {
        name: req.body.nameDriver,
      };

      let driver = await Driver.findByPk(req.params.id);

      await Driver.update(data, {
        where: { id: req.params.id },
      });

      req.flash("alertMessage", `Driver ${driver.name} berhasil diupdate.`);
      req.flash("alertStatus", "success");
      res.redirect("/drivers");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const driver = await Driver.findByPk(req.params.id);
      await driver.destroy();
      req.flash("alertMessage", `Driver ${driver.name} berhasil dihapus.`);
      req.flash("alertStatus", "success");
      res.redirect("/drivers");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/drivers");
    }
  },
};

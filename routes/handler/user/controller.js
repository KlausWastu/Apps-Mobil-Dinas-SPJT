const { Op } = require("sequelize");
const { User } = require("../../../models");
const bcrypt = require("bcrypt");
const judul = "User";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: ["id", "name", "email"],
        where: { deleted_at: null },
      };

      const users = await User.findAll(sqlOptions);
      res.render("pages/user/view_user", {
        alert,
        title: judul,
        users,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("pages/user/create", {
        title: judul,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (error) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const password = await bcrypt.hash(req.body.password, 12);
      let data = {
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role,
      };
      const emailAlreadyExist = await User.findOne({
        where: {
          email: data.email,
        },
      });
      if (emailAlreadyExist) {
        req.flash(
          "alertMessage",
          `Email ${emailAlreadyExist.email} Sudah Ada, Silahkan Masukan Email Lain`
        );
        req.flash("alertStatus", "danger");
        res.redirect("/users");
      } else {
        await User.create(data);
        req.flash("alertMessage", `User ${data.name} baru ditambahkan`);
        req.flash("alertStatus", "success");
        res.redirect("/users");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      res.render("pages/user/edit", {
        user,
        title: judul,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);

      const password = await bcrypt.hash(req.body.password, 12);
      let data = {
        name: req.body.name,
        email: req.body.email,
        password: password,
        role: req.body.role,
      };

      if (user.email !== data.email) {
        const emailAlreadyExist = await User.findOne({
          where: {
            email: data.email,
            id: { [Op.ne]: req.params.id },
          },
        });

        if (emailAlreadyExist) {
          req.flash(
            "alertMessage",
            `Email ${emailAlreadyExist.email} Sudah Ada, Silahkan Masukan Email Lain`
          );
          req.flash("alertStatus", "danger");
          res.redirect("/users");
        }
      }
      await user.update(data);
      req.flash("alertMessage", `User ${user.name} baru ditambahkan`);
      req.flash("alertStatus", "success");
      res.redirect("/users");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      await user.destroy();
      req.flash("alertMessage", `User ${user.name} berhasil dihapus`);
      req.flash("alertStatus", "success");
      res.redirect("/users");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/users");
    }
  },
};

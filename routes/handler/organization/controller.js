const { Organization } = require("../../../models");
const judul = "Organization";

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: ["id", "code", "name"],
        where: { deleted_at: null },
      };

      const organizations = await Organization.findAll(sqlOptions);

      res.render("pages/organization/view_organization", {
        title: judul,
        alert,
        organizations,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
  viewCreate: async (req, res) => {
    try {
      res.render("pages/organization/create", {
        title: judul,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
  actionCreate: async (req, res) => {
    try {
      const data = {
        code: req.body.code,
        name: req.body.name,
      };

      await Organization.create(data);
      req.flash(
        "alertMessage",
        `Organisasi ${data.name} berhasil ditambahkan.`
      );
      req.flash("alertStatus", "success");
      res.redirect("/organizations");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
  viewEdit: async (req, res) => {
    try {
      const organisasi = await Organization.findByPk(req.params.id);

      res.render("pages/organization/edit", {
        title: judul,
        organisasi,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
  actionEdit: async (req, res) => {
    try {
      const organisasi = await Organization.findByPk(req.params.id);
      const data = {
        code: req.body.code,
        name: req.body.name,
      };

      await organisasi.update(data);
      req.flash("alertMessage", `Organisasi ${data.name} berhasil diupdate.`);
      req.flash("alertStatus", "success");
      res.redirect("/organizations");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
  actionDelete: async (req, res) => {
    try {
      const organisasi = await Organization.findByPk(req.params.id);
      await organisasi.destroy();
      req.flash(
        "alertMessage",
        `Organisasi ${organisasi.name} berhasil dihapus.`
      );
      req.flash("alertStatus", "success");
      res.redirect("/organizations");
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/organizations");
    }
  },
};

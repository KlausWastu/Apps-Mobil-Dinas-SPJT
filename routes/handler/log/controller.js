const { Log, User, Car, Driver, Organization } = require("../../../models");
const judul = "Log";
const moment = require("moment");

module.exports = {
  index: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      const sqlOptions = {
        attributes: ["id", "type", "data_prev", "data_current", "date"],
        include: [
          {
            model: User,
            as: "users",
            attributes: ["name"],
          },
        ],
        where: { deleted_at: null },
      };

      const formatLogs = await Log.findAll(sqlOptions);
      const logs = formatLogs.map((log) => {
        return {
          ...log.dataValues,
          date: moment(log.date).format("DD/MM/YYYY HH:mm:ss"),
        };
      });

      res.render("pages/log/view_log", {
        title: judul,
        alert,
        logs,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/logs");
    }
  },
  viewDetail: async (req, res) => {
    //   Membuat function untuk format tanggal
    const formatDate = (date) => moment(date).format("DD/MM/YYYY HH:mm:ss");

    // Membuat fungsi untuk pasring organisasi
    const parseUserOrganization = (organization) => {
      let userOrganizationParsed = null;
      try {
        userOrganizationParsed = JSON.parse(organization);
        if (typeof userOrganizationParsed === "number") {
          userOrganizationParsed = [userOrganizationParsed];
        }
      } catch (e) {
        userOrganizationParsed = organization;
      }

      return userOrganizationParsed;
    };

    // Membuat fungsi untuk data current dan prev
    const formatData = (data) => ({
      ...data,
      date_departure: formatDate(data.date_departure),
      date_back: formatDate(data.date_back),
    });

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
      const log = await Log.findByPk(req.params.id);

      const datacurrent = JSON.parse(log.dataValues.data_current);
      const dataprev = log.dataValues.data_prev
        ? JSON.parse(log.dataValues.data_prev)
        : null;

      const dataCurrent = formatData(datacurrent);
      const dataPrev = dataprev ? formatData(dataprev) : null;

      //   Parse user_organization
      const userOrganizationParsedCurrent = parseUserOrganization(
        dataCurrent.user_organization
      );

      const userOrganizationParsedPrev = dataPrev
        ? parseUserOrganization(dataPrev.user_organization)
        : null;

      res.render("pages/log/detail", {
        title: judul,
        log,
        cars,
        drivers,
        organizations,
        dataCurrent,
        dataPrev,
        userOrganizationParsedCurrent,
        userOrganizationParsedPrev,
        name: req.session.user.name,
        role: req.session.user.role,
      });
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/logs");
    }
  },
};

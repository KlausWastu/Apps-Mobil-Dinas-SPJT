const bcrypt = require("bcrypt");
const { User } = require("../../../models");

module.exports = {
  viewSignIn: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      if (req.session.user === null || req.session.user === undefined) {
        res.render("pages/login/signin", {
          alert,
          title: "Sign In",
        });
      } else if (req.session.user.role === "superadmin") {
        res.redirect("/dashboard");
      } else {
        res.redirect("/sign-in");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sign-in");
    }
  },
  actionSignIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      const check = await User.findOne({
        where: { email: email },
      });
      if (check) {
        if (check.deletedAt === null) {
          const checkPass = await bcrypt.compare(password, check.password);
          if (checkPass) {
            req.session.user = {
              id: check.id,
              email: check.email,
              role: check.role,
              name: check.name,
            };
            if (check.role === "superadmin") {
              res.redirect("/dashboard");
            } else {
              res.redirect("/sign-in");
              // Ini masih perlu diperbaiki
            }
          } else {
            req.flash("alertMessage", `Kata Sandi yang anda masukan salah`);
            req.flash("alertStatus", "danger");
            res.redirect("/sign-in");
          }
        } else {
          req.flash(
            "alertMessage",
            `Akun anda sudah dihapus, silahkan hubungi admin `
          );
          req.flash("alertStatus", "danger");
          res.redirect("/sign-in");
        }
      } else {
        req.flash("alertMessage", `Email yang dimasukan salah `);
        req.flash("alertStatus", "danger");
        res.redirect("/sign-in");
      }
    } catch (err) {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/sign-in");
    }
  },
};

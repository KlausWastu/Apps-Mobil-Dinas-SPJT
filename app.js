var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");
const { isLogin } = require("./routes/middleware/auth");

// var indexRouter = require("./routes/index");
const signInRouter = require("./routes/signin");
const usersRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");
const driverRouter = require("./routes/driver");
const carRouter = require("./routes/car");
const organizationRouter = require("./routes/organization");
const carUsageRouter = require("./routes/carUsage");
const logRouter = require("./routes/log");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {},
  })
);
app.use(flash());
app.use(methodOverride("_method"));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(
  "/adminlte",
  express.static(path.join(__dirname, "/node_modules/admin-lte"))
);

app.get("/", (req, res) => {
  res.redirect("/sign-in");
});
app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/sign-in");
});
app.get("/change-password", isLogin, async (req, res) => {
  const { User } = require("./models");
  const user = await User.findByPk(req.session.user.id);
  try {
    const alertMessage = req.flash("alertMessage");
    const alertStatus = req.flash("alertStatus");
    const alert = { message: alertMessage, status: alertStatus };
    // console.log("USER: ", user);

    res.render("pages/login/change_password", {
      alert,
      user,
      title: "Ubah Password",
    });
  } catch (err) {
    if (user.role === "superadmin") {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    } else {
      req.flash("alertMessage", `${err.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/");
    }
  }
});
app.put("/change-password/:id", isLogin, async (req, res) => {
  const { User } = require("./models");
  const bcrypt = require("bcrypt");
  try {
    const { currPass, newPass } = req.body;
    const user = await User.findByPk(req.session.user.id);
    const hashpass = await bcrypt.hash(newPass, 12);
    const checkPass = await bcrypt.compare(currPass, user.password);
    if (!checkPass) {
      req.flash("alertMessage", "Gagal update password");
      req.flash("alertStatus", "danger");
      res.redirect("/change-password");
    }
    await user.update({
      password: hashpass,
    });
    req.flash("alertMessage", `Berhasil update password`);
    req.flash("alertStatus", "success");
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    req.flash("alertMessage", `${err.message}`);
    req.flash("alertStatus", "danger");
    res.redirect("/");
  }
});
app.use("/sign-in", signInRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/drivers", driverRouter);
app.use("/cars", carRouter);
app.use("/organizations", organizationRouter);
app.use("/cars-usage", carUsageRouter);
app.use("/logs", logRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

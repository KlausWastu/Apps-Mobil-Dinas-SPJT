var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const flash = require("connect-flash");
const methodOverride = require("method-override");
const session = require("express-session");

// var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const signInRouter = require("./routes/signin");
const dashboardRouter = require("./routes/dashboard");
const driverRouter = require("./routes/driver");

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

app.use("/sign-in", signInRouter);
app.use("/users", usersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/drivers", driverRouter);

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

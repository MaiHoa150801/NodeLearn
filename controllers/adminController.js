var app = require("express")();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());

exports.dashboard_get = function (req, res) {
  if (req.cookies.check) {
    res.render("dashboard");
  } else {
    res.redirect("/login-admin");
  }
};

exports.logout_admin = function (req, res) {
  res.clearCookie("check");
  res.redirect("/login-admin");
};

exports.admin_login = function (req, res) {
  res.render("admin_login");
};

exports.admin_login_post = function (req, res) {
  var body = req.body;
  var email = body.email;
  var password = body.password;
  if (email === "coolteamadmin@gmail.com" && password === "123456") {
    res.cookie("check", true);
    res.redirect("/admin");
  } else {
    res.redirect("/login-admin");
  }
};

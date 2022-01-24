var app = require("express")();
var bodyParser = require("body-parser");
const Swal = require("sweetalert2");
app.use(bodyParser.json());

exports.dashboard_get = function (req, res) {
  res.render("dashboard");
};

exports.logout_admin = function (req, res) {
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
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });

    Toast.fire({
      icon: "success",
      title: "Signed in successfully",
    });
    res.render("dashboard");
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: '<a href="">Why do I have this issue?</a>',
    });
    res.redirect("/login-admin");
  }
};

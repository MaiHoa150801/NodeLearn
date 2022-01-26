var app = require("express")();
var bodyParser = require("body-parser");
app.use(bodyParser.json());
var cookieParser = require("cookie-parser");
app.use(cookieParser());

var Book = require("../models/book");
var Author = require("../models/author");
var Genre = require("../models/genre");
var BookInstance = require("../models/bookinstance");
const { body, validationResult } = require("express-validator");

var async = require("async");

exports.dashboard_get = function (req, res) {
  async.parallel(
    {
      book_count: function (callback) {
        Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
      },
      book_instance_count: function (callback) {
        BookInstance.countDocuments({}, callback);
      },
      book_instance_available_count: function (callback) {
        BookInstance.countDocuments({ status: "Available" }, callback);
      },
      author_count: function (callback) {
        Author.countDocuments({}, callback);
      },
      genre_count: function (callback) {
        Genre.countDocuments({}, callback);
      },
    },
    function (err, results) {
      if (req.cookies.check) {
        res.render("dashboard", {
          title: "Local Library Home",
          error: err,
          data: results,
        });
      } else {
        res.redirect("/login-admin");
      }
    }
  );
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

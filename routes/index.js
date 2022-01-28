var express = require("express");
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var book_controller = require('../controllers/bookController');
var chatController = require('../controllers/chatController');
var nodemailer = require('nodemailer');
var Admin = require("../controllers/adminController");
var Book = require('../models/book');

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "hoa.le22@student.passerellesnumeriques.org",
    pass: "znngacrsnkkwbqxc",
  },
});

/* GET home page. */
router.get('/', function (req, res, next) {
  if (!req.user) {
    Book.find({}, 'title author')
      .populate('author')
      .populate('summary')
      .populate('isbn')
      .populate('genre')
      .exec(function (err, list_books) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { title: 'Book List', book_list: list_books });
      });
  };
  if (req.user) {
    Book.find({}, 'title author')
      .populate('author')
      .populate('summary')
      .populate('isbn')
      .populate('genre')
      .exec(function (err, list_books) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('index', { user: req.user, title: 'Book List', book_list: list_books });
      });
  }
});

//Admin
router.get("/admin", Admin.dashboard_get);
router.get("/logout-admin", Admin.logout_admin);
router.get("/login-admin", Admin.admin_login);
router.post("/login-admin-post", Admin.admin_login_post);

router.get("/register", function (req, res) {
  res.render("register", {});
});

router.post("/register", function (req, res) {
  Account.register(
    new Account({ email: req.body.email, name: req.body.name }),
    req.body.password,
    function (err, account) {
      if (err) {
        return res.render("register", {
          info: "Sorry. That username already exists. Try again.",
        });
      }

      //send email verification
      var authenticationURL =
        "http://localhost:3000/verify?authToken=" + account.authToken;

      //the code for affirmation
      var mailOptions = {
        from: "myemail@gmail.com",
        to: account.email,
        subject: "PNV Local Library - Confirm Email",
        html:
          '<a target=_blank href="' +
          authenticationURL +
          '">Confirm your email</a>',
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          //Handle error here
          res.send("Please try again!");
        } else {
          console.log("Email sent: " + info.response);
          res.send(
            "Thanks for registering! Please confirm your email! We have sent a link!"
          );
        }
      });
    }
  );
});

router.get("/email-verification", function (req, res) {
  res.render("email-verification", { title: "Email verification sent!" });
});

router.get("/verify", function (req, res) {
  Account.verifyEmail(req.query.authToken, function (err, existingAuthToken) {
    if (err) console.log("err:", err);

    res.render("email-verification", { title: "Email verified succesfully!" });
  });
});

router.get("/login", function (req, res) {
  res.render("login", { user: req.user });
});

router.get("/unauthorized", function (req, res) {
  Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .populate('summary')
    .populate('isbn')
    .populate('genre')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('index', { title: 'Book List', book_list: list_books, info: "Unauthorized" });
    });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/unauthorized",
  })
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

router.get("/chat", chatController.mes_list);
//post chat
router.post("/chat", chatController.mes_post);

router.get('/dashboard', book_controller.index);

module.exports = router;

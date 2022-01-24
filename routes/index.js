var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
var book_controller = require('../controllers/bookController'); 

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'hoa.le22@student.passerellesnumeriques.org',
    pass: 'znngacrsnkkwbqxc'
  }
});

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log(req.user);
  if (!req.user) {
    res.render('index');
  };
  if (req.user) {
    res.render('index', { user: req.user });
  }
});

/* GET home page. */
router.get('/homepage', function (req, res, next) {
  console.log(req.user);
  res.render('index', { user: req.user });
});

router.get('/register', function (req, res) {
  res.render('register', {});
});

router.post('/register', function (req, res) {
  Account.register(new Account({ email: req.body.email }), req.body.password, function (err, account) {
    if (err) {
      return res.render("register", { info: "Sorry. That username already exists. Try again." });
    }

    //send email verification
    var authenticationURL = 'http://localhost:3000/verify?authToken=' + account.authToken;

    //the code for affirmation
    var mailOptions = {
      from: 'myemail@gmail.com',
      to: account.email,
      subject: 'Sending Email using Node.js',
      html: '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        //Handle error here
        res.send('Please try again!');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('Thanks for registering! Please confirm your email! We have sent a link!');
      }
    });
  });
});

router.get('/email-verification', function (req, res) {
  res.render('email-verification', { title: 'Email verification sent!' })
});

router.get('/verify', function (req, res) {
  Account.verifyEmail(req.query.authToken, function (err, existingAuthToken) {
    if (err) console.log('err:', err);

    res.render('email-verification', { title: 'Email verified succesfully!' });
  });
});

router.get('/login', function (req, res) {
  res.render('login', { user: req.user });
});

router.get('/unauthorized', function (req, res) {
  res.render('index', { info: "Unauthorized" });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/unauthorized'
}));

router.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/loginadmin', function (req, res) {
  res.render('loginadmin', { user: req.user });
});

router.post('/loginadmin', function (req, res) {
  if (req.body.email == 'hoa' && req.body.password == 'admin12345') {
    res.redirect('/dashboard');
  };
});

router.get('/dashboard', book_controller.index);

router.get('/ping', function (req, res) {
  res.status(200).send("pong!");
});

module.exports = router;

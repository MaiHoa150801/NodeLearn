var express = require('express');
var router = express.Router();
var passport = require('passport');
var Account = require('../models/account');
// var sendgrid = require('sendgrid')(hoa.le22, znngacrsnkkwbqxc);

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
  // res.redirect('/catalog');
  res.render('index', { user: req.user });
});

router.get('/register', function (req, res) {
  res.render('register', {});
});

router.post('/register', function (req, res) {
  Account.register(new Account({ email: req.body.email }), req.body.password, function (err, account) {
    // if (err) {
    //   return res.render("register", { info: "Sorry. That username already exists. Try again." });
    // }

    //send email verification
    // var authenticationURL = 'http://localhost:3000/verify?authToken=' + account.authToken;
    // sendgrid.send({
    //   to: account.email,
    //   from: 'hoa.le22@student.passerellesnumeriques.org',
    //   subject: 'Confirm your email',
    //   html: '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
    // }, function (err, json) {
    //   if (err) { return console.error(err); }

    //   res.redirect('/email-verification');
    // });
    //the code for affirmation
    var mailOptions = {
      from: 'myemail@gmail.com',
      to: 'hoa.le22@student.passerellesnumeriques.org',
      subject: 'Sending Email using Node.js',
      // html: '<a target=_blank href=\"' + authenticationURL + '\">Confirm your email</a>'
      html: '<a target=_blank href=\"' + 'helo' + '\">Confirm your email</a>'

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

router.get('/ping', function (req, res) {
  res.status(200).send("pong!");
});

module.exports = router;

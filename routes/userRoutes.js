const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/Users');

// import user controller
const userController = require("../controllers/userControllers");

// show register form
router.get('/register', function(req, res) {
    res.render("register")
});

// handle signup logic
router.post('/register', userController.signup);

// route for email confirmation
router.get('/verify-email', userController.verifyEmail)

// show login form
router.get('/login', function(req, res) {
    res.render("login")
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    }) (req, res, next);
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "You are logged out");
    res.redirect('/');
})


module.exports = router;
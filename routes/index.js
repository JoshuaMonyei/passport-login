const express = require('express');
const router = express.Router();
const {isLoggedIn} = require('../config/auth')

// root route
router.get('/', function(req, res) {
    res.render("landing")
});

// dashboard view
router.get('/dashboard', isLoggedIn, (req, res) => 
    res.render("dashboard", {
        user: req.user
    }));


 module.exports = router;
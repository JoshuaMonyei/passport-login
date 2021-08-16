const User = require('../models/Users');
const nodemailer = require('nodemailer');
const crypto = require('crypto')
const  bcrypt = require('bcrypt');
const {SECRET} = process.env;
const expiry = 84600;

// user signup
exports.signup = async (req, res) => {
    // destructuring user details from req body
    const {name, email, password} = req.body;
    let errors = [];
    // check required fields
    if (!name || !email || !password) {
        errors.push({msg: "Please fill all required fields"})
    }
    if(password.length < 6) {
        errors.push({msg: "Password should be at least 6 characters"});
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password
        });
    } else {
        User.findOne({email}, (err, existingUser) => {
            if(existingUser) {
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                  errors,
                  name,
                  email,
                  password
                }); 
            } else {
                var user = new User({
                    name,
                    email,  
                    password,
                    emailToken: crypto.randomBytes(64).toString("hex"),
                    isVerified: false,
                });
                // SMTP transporter for nodemailer 
                const transporter = nodemailer.createTransport({
                    service: "hotmail",
                    // created this outlook acct for project
                    auth: {
                        user: process.env.USER,
                        pass: process.env.PASSWORD
                    },
                })
                // Mail structure and contents.
                const mailOptions = {
                    from: process.env.USER,
                    to: email,
                    subject: "Flash Reciepts - verify your email",
                    text: `
                    Hello, thanks for registering on our site.
                    Please copy and paste the address below to verify your account.
                    http://${req.headers.host}/verify-email?token=${user.emailToken}`,
                    html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on our site.</p>
                    <P>Please click the link below to verify your account</p>
                    <a href= "http://${req.headers.host}/verify-email?token=${user.emailToken}">Verify your account</a>`
                }
                // Send confirmation mail to user after successful registration
                transporter.sendMail(mailOptions, function (err, info) {
                    if (err) {
                        errors.push({ msg: 'Error with mail verification please contact us for assistance' });
                        res.render('register', {
                          errors,
                          name,
                          email,
                          password
                        });
                    } 
                // hash users password
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hash) => {
                        if (err) throw err;
                        // set password to hash
                        user.password = hash
                        user.save()
                        req.flash('success_msg', "Thanks for registering. please check your email to activate your account.")
                        return res.redirect('/');
                    })
                })
                
                    
                })
            }
            
        })
    }
    
    
}


exports.verifyEmail = async (req, res, next) => {
    try{
        const user = await User.findOne({emailToken: req.query.token});
        if(!user) {
            req.flash('error', "Token is invalid. Please contact us for assistance")
            return res.redirect('/');z
        }
        // deleting verified user emailToken in the DB
        user.emailToken = null;
        // change user .isVerified value to true
        user.isVerified = true;
        await user.save();
        req.flash("success_msg", `Hello ${user.name}, welcome to Flash Receipts`)
        return res.redirect('/login');
    } catch(error) {
        req.flash('error_msg', "Something went wrong. Please contact us for assistance.");
        res.redirect('/');
    }
}
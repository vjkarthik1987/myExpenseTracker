const express       = require('express');
const router        = express.Router();
const catchAsync    = require('../utils/catchAsync');
const User          = require('../models/User');
const passport      = require('passport');

router.get('/register', (req, res) => {
    res.render('./users/register')
});

router.post('/register', catchAsync(async (req, res, next) => {
    try{
        const {username, email, password } = req.body;
        const user = new User({email: email, username: username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {
                next(err)
            }
            req.flash('success', 'Successfully registered and logged in');
            res.redirect('./index')
        })  
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    } 
}))

router.get('/login', (req, res) => {
    res.render('./users/login')
});

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), (req, res) => {
    req.flash('success', "Successfully logged in")
    res.redirect('/expenses/home')
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/');
    });
}); 

module.exports = router;
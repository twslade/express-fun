const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in',
});

exports.logout =  (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/');
};

exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        next();
        return;
    } else {
        req.flash('error', 'You must be logged in to do that!');
        res.redirect('/login');
    }
};

exports.forgot = async (req, res) => {
    // 1.) See if email address exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'No account with that email!');
        return res.redirect('/login');
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000;

    await user.save();
    
    // 2.) Set reset tokens with expiry
    // 3.) Send an email with toke
    // 4.) Redirect to login page
};
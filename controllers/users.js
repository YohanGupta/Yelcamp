const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = catchAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        //req.login method is used to automatically login the user when user register itself on website
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
})

module.exports.renderLogin =  (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', `Welcome ${req.user.username}!`)
    res.redirect('/campgrounds')
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/campgrounds');
}
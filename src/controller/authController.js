const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const errorFormater = require('../utils/validationErrorformater');
const User = require('../model/user');

const Flash = require('../utils/Flash');

// signup controller
const signupGetController = (req, res, next) => {
    res.render('signup', { error: {}, value: {}, flashMessage: Flash.getMessage(req) });
};
const signupPostController = async (req, res, next) => {
    const { username, email, password, confromPassword } = req.body;
    const errors = validationResult(req).formatWith(errorFormater);
    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check you from');
        res.render('signup', {
            error: errors.mapped(),
            value: {
                username,
                email
            },
            flashMessage: Flash.getMessage(req)
        });
    }

    try {
        const checkPassword = password === confromPassword ? password : false;

        if (username.length > 0 && email.length > 0 && checkPassword) {
            const hashPassword = await bcrypt.hash(password, 10);
            const users = new User({ username, email, password: hashPassword });

            await users.save();

            req.flash('success', 'User Created Successfully');
            res.redirect('auth/signin');
        }
    } catch (err) {
        next(err);
    }
};

// signin controller
const signinGetController = (req, res, next) => {
    res.render('signin', { error: {}, value: {}, flashMessage: Flash.getMessage(req) });
};
const signinPostController = async (req, res, next) => {
    const { email, password } = req.body;
    const errors = validationResult(req).formatWith(errorFormater);

    if (!errors.isEmpty()) {
        req.flash('fail', 'Please Check you from');
        res.render('signin', {
            error: errors.mapped(),
            value: {
                email,
                password
            },
            flashMessage: Flash.getMessage(req)
        });
    }
    try {
        if (email.length > 0 && password.length > 0) {
            const user = await User.findOne({ email });
            if (!user) {
                req.flash('fail', 'Please Provide Valid Credentials');
                res.render('signin', {
                    error: {},
                    flashMessage: Flash.getMessage(req)
                });
            } else {
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    req.flash('fail', 'Please Provide Valid Credentials');
                    res.render('signin', {
                        error: {},
                        flashMessage: Flash.getMessage(req)
                    });
                } else {
                    // token and cookie
                    const token = user.generatAuthToken();
                    res.cookie('auth', token, {
                        httpOnly: true,
                        sameSite: true,
                        signed: true,
                        maxAge: 1000 * 60 * 60 * 24
                    });
                    req.flash('success', ' Successfully Signin');
                    res.redirect('/dashbord/create-profile');
                }
            }
        }
    } catch (err) {
        next(err);
    }
};
const changePasswordGetController = (req, res, next) => {
    res.render('dashbord/chang-password', {
        flashMessage: Flash.getMessage(req)
    });
};

const changePasswordPostController = async (req, res, next) => {
    const { oldpassword, newpassword, confirmpassword } = req.body;

    if (newpassword !== confirmpassword) {
        req.flash('fail', 'Password Does Not Match');
        res.redirect('/auth/change-password');
    }
    try {
        const match = await bcrypt.compare(oldpassword, req.user.password);

        if (!match) {
            req.flash('fail', 'Invalid Old Passowrd');
            res.redirect('/auth/change-password');
        }

        const hash = await bcrypt.hash(newpassword, 10);

        await User.findOneAndUpdate({ _id: req.user.id }, { $set: { password: hash } });

        req.flash('success', 'Password Update Successfully');

        res.render('dashbord/chang-password', {
            flashMessage: Flash.getMessage(req)
        });
    } catch (err) {
        
        next(err);
    }
};

// signout controller
const logoutController = (req, res, next) => {
    res.clearCookie('auth');
    req.flash('success', ' Successfully signout');
    res.redirect('signin');
};

module.exports = {
    signupGetController,
    signupPostController,
    signinGetController,
    signinPostController,
    changePasswordGetController,
    changePasswordPostController,
    logoutController
};

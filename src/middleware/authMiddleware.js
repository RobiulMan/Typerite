require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../model/user');

const bindUserWithRequrest = () => async (req, res, next) => {
    const authToken = req.signedCookies.auth;
    if (!authToken) {
        next();
    } else {
        try {
            // varify token
            const decoded = await jwt.verify(authToken, process.env.KEY);

            // getting User
            const user = await User.findById(decoded.id);

            req.user = user;
            next();
        } catch (err) {
            console.log(err);
        }
    }
};

const isAuthenticated = (req, res, next) => {
    if (!req.signedCookies.auth) {
        res.redirect('/auth/signin');
    }
    next();
};

const isUnAuthenticated = (req, res, next) => {
    if (req.signedCookies.auth) {
        res.redirect('/dashbord');
    }
    next();
};
module.exports = {
    bindUserWithRequrest,
    isAuthenticated,
    isUnAuthenticated
};

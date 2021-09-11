require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const falsh = require('connect-flash');
const isLoggedIn = require('./setLocal');
const { bindUserWithRequrest } = require('./authMiddleware');

const middlewares = [
    express.urlencoded({ extended: true }),
    express.json(),
    cookieParser(process.env.KEY),
    session({
        secret: 'mysecret',
        saveUninitialized: false,
        resave: false,
        cookie: { maxAge: 1000 * 60 * 60 * 24 }
    }),
    bindUserWithRequrest(),
    isLoggedIn,
    falsh()
];

const setMiddlewares = (app) => {
    middlewares.forEach((item) => {
        app.use(item);
    });
};

module.exports = setMiddlewares;

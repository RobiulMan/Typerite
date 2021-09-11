const { body } = require('express-validator');

const signinValidator = [
    body('email').not().isEmpty().withMessage('Email can not be empty'),
    body('password').not().isEmpty().withMessage('password can not be empty')
];
module.exports = {
    signinValidator
};

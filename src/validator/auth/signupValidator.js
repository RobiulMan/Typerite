const { body } = require('express-validator');
const User = require('../../model/user');

// validation for signup
const singupValidator = [
    body('username')
        .isLength({ min: 2, max: 15 })
        .withMessage('Username Must Be 2 to 15 Chars')
        .custom(async (username) => {
            try {
                const user = await User.findOne({ username });
                if (user) {
                    return Promise.reject(new Error('Username Already Used'));
                }
                return true;
            } catch (err) {
                console.log(err);
            }
        }),
    body('email')
        .isEmail()
        .withMessage('Please Provide A Valide Email')
        .custom(async (email) => {
            try {
                const userEmail = await User.findOne({ email });
                if (userEmail) {
                    return Promise.reject(new Error('Email Already Used'));
                }
                return true;
            } catch (err) {
                console.log(err);
            }

            // new Error('Email Already Used')
        })
        .normalizeEmail(),
    body('password').isLength({ min: 5 }).withMessage('Your Password Must Be Greater Than 5 chars'),
    body('confromPassword')
        .isLength({ min: 5 })
        .withMessage('Your Password Must Be Greater Than 5 chars')
        .custom((confromPassword, { req }) => {
            if (confromPassword !== req.body.password) {
                throw new Error('Password Does Not Match');
            } else {
                return true;
            }
        })
];
module.exports = {
    singupValidator
};

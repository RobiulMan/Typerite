const { body } = require('express-validator');
const validator = require('validator');

const linkValidator = (value) => {
    if (value !== '') {
        if (!validator.isURL(value)) {
            throw new Error('Please Provid Valid URL');
        }
    }

    return true;
};

const Profilevalidator = [
    body('name')
        .not()
        .isEmpty()
        .withMessage('Name Can Not Be Empty')
        .isLength({ max: 50 })
        .withMessage('Name Can Not Be More Then 50 Chars')
        .trim(),
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title Can Not Be Empty')
        .isLength({ max: 100 })
        .withMessage('Name Can Not Be less Then 100 Chars')
        .trim(),
    body('bio')
        .not()
        .isEmpty()
        .withMessage('Bio Can Not Be Empty')
        .isLength({ max: 500 })
        .withMessage('Name Can Not Be More Then 500 Chars')
        .trim(),
    body('website').custom(linkValidator),
    body('facebook').custom(linkValidator),
    body('twitter').custom(linkValidator),
    body('github').custom(linkValidator)
];

module.exports = Profilevalidator;

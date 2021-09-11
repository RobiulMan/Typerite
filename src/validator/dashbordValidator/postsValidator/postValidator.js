const { body } = require('express-validator');
const cheerio = require('cheerio');

const postValidator = [
    body('title')
        .not()
        .isEmpty()
        .withMessage('Title Can Not Be Empty')
        .isLength({ max: 100 })
        .withMessage('Title Can Not Be Greater Then 100 Chars')
        .trim(),
    body('body')
        .not()
        .isEmpty()
        .withMessage('Body Can Not Be Empty')
        .custom((value) => {
            const node = cheerio.load(value);
            
            const text = node.text();
            console.log(text)
            if (text.length > 5000) {
                throw new Error('Body Can Not Be greater the 5000 char');
            }
            return true;
        })
];

module.exports = postValidator;

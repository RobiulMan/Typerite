const cheerio = require('cheerio');
const moment = require('moment');

const locals = (req, res, next) => {
    res.locals.user = req.user;
    res.locals.isLoggedIn = !!req.signedCookies.auth;
    res.locals.truncate = (html) => {
        const node = cheerio.load(html);
        let text;
        text = node.text();

        text = text.replace(/(\r\r|\n|\r)/gm, '');

        if (text.length <= 100) return text;

        return text.substr(0, 100);
    };

    res.locals.moment = (time) => moment(time).fromNow();
    next();
};

module.exports = locals;

const moment = require('moment');
const mongoose = require('mongoose');
const Flash = require('../utils/Flash');
const Post = require('../model/post');
const Profile = require('../model/profile');

function genDate(days) {
    const date = moment().subtract(days, 'days');
    return date.toDate();
}

function generateFilterObject(filter) {
    let filterObj = {};
    let order = 1;

    // eslint-disable-next-line default-case
    switch (filter) {
        case 'week': {
            filterObj = {
                createdAt: {
                    $gt: genDate(7)
                }
            };
            order = -1;
            break;
        }
        case 'month': {
            filterObj = {
                createdAt: {
                    $gt: genDate(30)
                }
            };
            order = -1;
            break;
        }
        case 'all': {
            order = -1;
            break;
        }
    }
    return {
        filterObj,
        order
    };
}

const filterGetController = async (req, res, next) => {
    const filter = req.query.filter || 'latest';
    // eslint-disable-next-line radix
    const currentPage = parseInt(req.query.page) || 1;
    const itemPerPage = 10;

    const { order, filterObj } = generateFilterObject(filter.toLowerCase());

    try {
        console.log(filterObj);
        const posts = await Post.find(filterObj)
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        const totalPost = await Post.countDocuments();
        const totalPage = totalPost / itemPerPage;

        let bookmarks = [];
        // const { user } = req;
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                bookmarks = profile.bookmarks;
            }
        }
        res.render('index', {
            flashMessage: Flash.getMessage(req),
            posts,
            itemPerPage,
            currentPage,
            totalPage,
            bookmarks,
            filter
        });
    } catch (err) {
        next(err);
    }
};

const getSearchsResultsController = async (req, res, next) => {
    const { term } = req.query;
    const filter = req.query.filter || 'latest';
    const currentPage = parseInt(req.query.page) || 1;
    const itemPerPage = 10;
    // const { order, filterObj } = generateFilterObject(filter.toLowerCase());

    try {
        const posts = await Post.find({ $text: { $search: term } })
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);
        const totalPost = await Post.countDocuments({ $text: { $search: term } });
        const totalPage = totalPost / itemPerPage;

        let bookmarks = [];
        // const { user } = req;
        if (req.user) {
            const profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                bookmarks = profile.bookmarks;
            }
        }
        res.render('search/searchs', {
            flashMessage: Flash.getMessage(req),
            searchTerm: term,
            itemPerPage,
            currentPage,
            totalPage,
            posts,
            bookmarks,
            filter
        });
    } catch (err) {
        next();
    }
};

module.exports = {
    getSearchsResultsController,
    filterGetController
};

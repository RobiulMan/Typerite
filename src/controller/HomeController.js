/* eslint-disable default-case */
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

const HomeGetController = async (req, res, next) => {
    const filter = req.query.filter || 'latest';
    // eslint-disable-next-line radix
    const currentPage = parseInt(req.query.page) || 1;
    const itemPerPage = 10;

    const { order, filterObj } = generateFilterObject(filter.toLowerCase());

    try {
        const posts = await Post.find(filterObj)
            .sort(order === 1 ? '-createdAt' : 'createdAt')
            .skip(itemPerPage * currentPage - itemPerPage)
            .limit(itemPerPage);

        const totalPost = await Post.countDocuments();
        const totalPage = totalPost / itemPerPage;

        let bookmarks = [];

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
            bookmarks
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    HomeGetController
};

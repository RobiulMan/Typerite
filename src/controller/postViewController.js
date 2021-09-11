/* eslint-disable default-case */
const moment = require('moment');
const mongoose = require('mongoose');
const Flash = require('../utils/Flash');
const Post = require('../model/post');
const Profile = require('../model/profile');

// function genDate(days) {
//     const date = moment().subtract(days, 'days');
//     return date.toDate();
// }

// function generateFilterObject(filter) {
//     let filterObj = {};
//     let order = 1;

//     switch (filter) {
//         case 'week': {
//             filterObj = {
//                 createdAt: {
//                     $gt: genDate(7)
//                 }
//             };
//             order = -1;
//             break;
//         }
//         case 'month': {
//             filterObj = {
//                 createdAt: {
//                     $gt: genDate(30)
//                 }
//             };
//             order = -1;
//             break;
//         }
//         case 'all': {
//             order = -1;
//             break;
//         }
//     }
//     return {
//         filterObj,
//         order
//     };
// }

const postViewGetController = (req, res, next) => {
    res.redirect('/home');
};
const singlePageGetController = async (req, res, next) => {
    const { postId } = req.params;
    const isMongooesId = mongoose.Types.ObjectId.isValid(postId); // this validation for mongoses if we can't validat it shows error

    if (isMongooesId) {
        try {
            const post = await Post.findById(postId)
                .populate('author', 'username profilePics')
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'user',
                        select: 'username profilePics'
                    }
                })
                .populate({
                    path: 'comments',
                    populate: {
                        path: 'replies.user',
                        select: 'username profilePics'
                    }
                });
            if (!post) {
                const error = new Error('404 Page Not Found');
                error.status = 404;
                throw error;
            } else {
                let bookmarks = [];

                if (req.user) {
                    const profile = await Profile.findOne({ user: req.user.id });

                    if (profile) {
                        bookmarks = profile.bookmarks;
                    }
                }

                res.render('singlepages/single-pages', {
                    flashMessage: Flash.getMessage(req),
                    post,
                    bookmarks
                });
            }
        } catch (err) {
            //
            next(err);
        }
    }
};
module.exports = {
    postViewGetController,
    singlePageGetController
};

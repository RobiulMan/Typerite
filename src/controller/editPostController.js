const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
// const readingTime = require('reading-time');

const errorFormater = require('../utils/validationErrorformater');
const Flash = require('../utils/Flash');
const Profile = require('../model/profile');
const Post = require('../model/post');

const editPostsGetController = async (req, res, next) => {
    const { postId } = req.params;
    const isMongooesId = mongoose.Types.ObjectId.isValid(postId);
    if (isMongooesId) {
        try {
            const profile = await Profile.findOne({ user: req.user.id });
            const post = await Post.findOne({ author: req.user.id, _id: postId });

            if (!post) {
                const error = new Error();
                error.status = 404;
                throw error;
            } else {
                res.render('dashbord/posts/edit-post', {
                    error: {},
                    flashMessage: Flash.getMessage(req),
                    post,
                    profile
                });
            }
        } catch (err) {
            next(err);
        }
    }
};
const editPostsPostController = async (req, res, next) => {
    const { title, body, tags } = req.body;
    const { postId } = req.params;
    const isMongooesId = mongoose.Types.ObjectId.isValid(postId);
    const errors = validationResult(req).formatWith(errorFormater);

    if (isMongooesId) {
        try {
            const post = await Post.findOne({ author: req.user.id, _id: postId });
            if (!post) {
                const error = new Error();
                error.status = 404;
                throw error;
            } else if (!errors.isEmpty()) {
                res.render('dashbord/posts/add-post', {
                    flashMessage: Flash.getMessage(req),
                    error: errors.mapped(),
                    post
                });
            } else {
                let thumbnail;
                thumbnail = post.thumbnail;
                if (req.file) {
                    thumbnail = `/upload/${req.file.filename}`;
                }
                await Post.findOneAndUpdate(
                    { _id: post._id },
                    { $set: { title, body, tags, thumbnail } },
                    { new: true }
                );

                req.flash('success', 'Post Updated Sucessfully');
                res.redirect('/posts');
            }
        } catch (err) {
            // so
            return next(err);
        }
    }
};

const deletePostGetController = async (req, res, next) => {
    const { postId } = req.params;
    const isMongooesId = mongoose.Types.ObjectId.isValid(postId);
    if (isMongooesId) {
        try {
            const post = await Post.findOne({ author: req.user.id, _id: postId });
            if (!post) {
                const error = new Error();
                error.status = 404;
                throw error;
            }

            await Post.findOneAndDelete({ _id: postId });
            await Profile.findOneAndUpdate({ user: req.user.id }, { $pull: { posts: postId } });
            req.flash('success', 'Post Delete Sucessfully');
            res.redirect('/posts');
        } catch (err) {
            next(err);
        }
    }
};
module.exports = {
    editPostsGetController,
    editPostsPostController,
    deletePostGetController
};

const { validationResult } = require('express-validator');
const readingTime = require('reading-time');

const errorFormater = require('../utils/validationErrorformater');
const Flash = require('../utils/Flash');
const Profile = require('../model/profile');
const Post = require('../model/post');

const addPostsGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user');
        res.render('dashbord/posts/add-post', {
            error: {},
            flashMessage: Flash.getMessage(req),
            profile,
            value: {}
        });
    } catch (err) {
        next(err);
    }
};

const addPostsPostController = async (req, res, next) => {
    const { title, body, tags } = req.body;
    const errors = validationResult(req).formatWith(errorFormater);
    const profile = await Profile.findOne({ user: req.user.id });
    if (!errors.isEmpty()) {
        res.render('dashbord/posts/add-post', {
            flashMessage: Flash.getMessage(req),
            error: errors.mapped(),
            profile,
            value: {
                title,
                body
            }
        });
    } else {
        const readTime = readingTime(body).text;
        const post = new Post({
            title,
            body,
            tags,
            author: req.user.id,
            thumbnail: '',
            readTime,
            links: [],
            dislikes: [],
            comments: []
        });

        if (req.file) {
            post.thumbnail = `/upload/${req.file.filename}`;
        }
        try {
            const addNewPost = await post.save();
            await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $push: { posts: addNewPost._id } }
            );

            req.flash('success', 'Post Created Sucessfully');
            res.redirect('/posts');
        } catch (err) {
            next(err);
        }
    }
};
module.exports = {
    addPostsGetController,
    addPostsPostController
};

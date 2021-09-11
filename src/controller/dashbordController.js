const { validationResult } = require('express-validator');

const Flash = require('../utils/Flash');
const User = require('../model/user');
const Profile = require('../model/profile');
const Post = require('../model/post');
const Comments = require('../model/comment');
const errorFormater = require('../utils/validationErrorformater');

const dashbordGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user ');
        const posts = await Post.find({ author: req.user.id });
        const comments = await Comments.find({ post: { $in: profile.posts } });

        if (profile) {
            res.render('dashbord/dashbord', {
                flashMessage: Flash.getMessage(req),
                profile,
                posts,
                comments
            });
        } else {
            res.redirect('dashbord/create-profile');
        }
    } catch (err) {
        next(err);
    }
};

const createProfileGetController = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const profile = await Profile.findOne({ user: req.user.id });
        if (profile) {
            res.redirect('/dashbord');
        } else {
            res.render('dashbord/create-profile', {
                user,
                flashMessage: Flash.getMessage(req),
                error: {}
            });
        }
    } catch (err) {
        
        next(err);
    }
};

const createProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormater);
    const { name, title, bio, website, facebook, twitter, github } = req.body;

    if (!errors.isEmpty()) {
        res.render('dashbord/create-profile', {
            flashMessage: Flash.getMessage(req),
            error: errors.mapped()
        });
    } else {
        try {
            const profile = new Profile({
                user: req.user.id,
                name,
                title,
                bio,
                profilePics: req.user.profilePics,
                links: {
                    website: website || '',
                    facebook: facebook || '',
                    twitter: twitter || '',
                    github: github || ''
                },
                posts: [],
                bookmarks: []
            });

            const createProfile = await profile.save();
            await User.findOneAndUpdate(
                {
                    _id: req.user.id
                },
                { $set: { profile: createProfile._id } }
            );
            req.flash('sucess', 'Profile Created Successfully');
            res.redirect('/dashbord');
        } catch (err) {
            next(err);
        }
    }
};

const editProfileGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });
        if (!profile) {
            res.redirect('dashbord/create-profile');
        }

        res.render('dashbord/edit-profile', {
            error: {},
            flashMessage: Flash.getMessage(req),
            profile
        });
    } catch (err) {
        next(err);
    }
};

const editProfilePostController = async (req, res, next) => {
    const errors = validationResult(req).formatWith(errorFormater);
    const { name, title, bio, website, facebook, twitter, github } = req.body;
    if (!errors.isEmpty()) {
        res.render('dashbord/edit-profile', {
            error: errors.mapped(),
            flashMessage: Flash.getMessage(req),
            profile: {
                name,
                title,
                bio,
                links: {
                    website,
                    facebook,
                    twitter,
                    github
                }
            }
        });
    }
    try {
        const profile = {
            name,
            title,
            bio,
            links: {
                website: website || '',
                facebook: facebook || '',
                twitter: twitter || '',
                github: github || ''
            }
        };
        const updateProfile = await Profile.findOneAndUpdate(
            { user: req.user.id },
            { $set: profile },
            { new: true }
        );
        req.flash('success', 'Profile Update Successfully');
        res.render('dashbord/edit-profile', {
            error: {},
            flashMessage: Flash.getMessage(req),
            profile: updateProfile
        });
    } catch (err) {
        next(err);
    }
};
const bookmarksGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user').populate({
            path: 'bookmarks',
            model: 'Post',
            select: 'title thumbnail'
        });
        
        res.render('dashbord/bookmarks', {
            flashMessage: Flash.getMessage(req),
            posts: profile.bookmarks,
            profile
        });
    } catch (err) {
        next(err);
    }
};
const commentsGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user');
        const comments = await Comments.find({ post: { $in: profile.posts } })
            .populate({
                path: 'post',
                select: 'title'
            })
            .populate({
                path: 'user',
                select: 'username profilePics'
            })
            .populate({
                path: 'replies.user',
                select: 'username profilePics'
            });
        res.render('dashbord/comments', {
            flashMessage: Flash.getMessage(req),
            comments,
            profile
        });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    dashbordGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarksGetController,
    commentsGetController
};

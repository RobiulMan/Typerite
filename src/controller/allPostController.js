const Profile = require('../model/profile');
const Flash = require('../utils/Flash');
const Post = require('../model/post');

const allPostsGetController = async (req, res, next) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user');
        const posts = await Post.find({ author: req.user.id });

        if (profile) {
            res.render('dashbord/posts/all-posts', {
                flashMessage: Flash.getMessage(req),
                profile,
                posts
            });
        }
    } catch (err) {
        next(err);
    }
};
const allPostsPostController = (req, res, next) => {};

module.exports = {
    allPostsGetController,
    allPostsPostController
};

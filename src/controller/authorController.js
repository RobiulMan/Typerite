const mongoose = require('mongoose');
const Flash = require('../utils/Flash');
const User = require('../model/user');

const authorProfileGetController = async (req, res, next) => {
    const { userId } = req.params;
    const isMongooesId = mongoose.Types.ObjectId.isValid(userId);

    if (isMongooesId) {
        try {
            const author = await User.findById(userId).populate({
                path: 'profile',
                populate: {
                    path: 'posts'
                }
            });

            res.render('pages/author', {
                flashMessage: Flash.getMessage(req),
                author
            });
        } catch (err) {
            next(err);
        }
    }
};

module.exports = {
    authorProfileGetController
};

const Profile = require('../../model/profile');

const bookmarksGetController = async (req, res, next) => {
    const { postId } = req.params;

    if (!req.user) {
        res.status(403).json({
            error: 'Your are not an authentacated user'
        });
    } else {
        const userId = req.user.id;

        let bookmarks;

        try {
            const profile = await Profile.findOne({ user: req.user.id });
            if (profile.bookmarks.includes(postId)) {
                await Profile.findOneAndUpdate({ user: userId }, { $pull: { bookmarks: postId } });
                bookmarks = false;
            } else {
                await Profile.findOneAndUpdate({ user: userId }, { $push: { bookmarks: postId } });
                bookmarks = true;
            }

            res.status(200).json({
                bookmarks
            });
        } catch (err) {
            
            res.status(500).json({
                error: 'SErver Error Occcured'
            });
        }
    }
};

module.exports = {
    bookmarksGetController
};

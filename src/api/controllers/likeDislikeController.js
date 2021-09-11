const Post = require('../../model/post');

const likesGetController = async (req, res, next) => {
    const { postId } = req.params;
    let liked;
    liked = null;

    if (!req.user) {
        res.status(403).json({
            error: 'Your are not an authentacated user'
        });
    } else {
        const userId = req.user.id;
        try {
            const post = await Post.findById(postId);

            if (post.dislikes.includes(userId)) {
                await Post.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: userId } });
            }
            if (post.likes.includes(userId)) {
                await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } });
                liked = false;
            } else {
                await Post.findOneAndUpdate({ _id: postId }, { $push: { likes: userId } });
                liked = true;
            }

            const updatedPost = await Post.findById(postId);

            res.status(200).json({
                liked,
                totalLikes: updatedPost.likes.length,
                totaldislikes: updatedPost.dislikes.length
            });
        } catch (err) {
            res.status(500).json({
                error: 'Server Error Occcured'
            });
        }
    }
};

const dislikeGetController = async (req, res, next) => {
    const { postId } = req.params;
    let disliked;
    disliked = null;

    if (!req.user) {
        res.status(403).json({
            error: 'Your are not an authentacated user'
        });
    } else {
        const userId = req.user.id;
        try {
            const post = await Post.findById(postId);

            if (post.likes.includes(userId)) {
                await Post.findOneAndUpdate({ _id: postId }, { $pull: { likes: userId } });
            }
            if (post.dislikes.includes(userId)) {
                await Post.findOneAndUpdate({ _id: postId }, { $pull: { dislikes: userId } });
                disliked = false;
            } else {
                await Post.findOneAndUpdate({ _id: postId }, { $push: { dislikes: userId } });
                disliked = true;
            }

            const updatedPost = await Post.findById(postId);

            res.status(200).json({
                disliked,
                totalLikes: updatedPost.likes.length,
                totaldislikes: updatedPost.dislikes.length
            });
        } catch (err) {
            res.status(500).json({
                error: 'Server Error Occcured'
            });
        }
    }
};
module.exports = {
    likesGetController,
    dislikeGetController
};

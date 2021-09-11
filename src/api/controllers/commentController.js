const mongoose = require('mongoose');
const Post = require('../../model/post');
const Comment = require('../../model/comment');

const commentPostController = async (req, res, next) => {
    const { postId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        res.status(403).json({
            error: 'Your are not an authentacated user'
        });
    } else {
        const mongooseId = mongoose.Types.ObjectId.isValid(postId);
        if (mongooseId) {
            const comment = new Comment({
                post: postId,
                user: req.user.id,
                body,
                replies: []
            });

            try {
                const createdComment = await comment.save();

                await Post.findOneAndUpdate(
                    { _id: postId },
                    { $push: { comments: createdComment._id } }
                );

                const commentJSON = await Comment.findById(createdComment._id).populate({
                    path: 'user',
                    select: 'profilePics username'
                });

                res.status(201).json(commentJSON);
            } catch (err) {
                res.status(500).json({
                    error: 'Server Error Occcured'
                });
            }
        }
    }
};

const replyCommentPostController = async (req, res, next) => {
    const { commentId } = req.params;
    const { body } = req.body;

    if (!req.user) {
        res.status(403).json({
            error: 'Your are not an authentacated user'
        });
    }
    const mongooseId = mongoose.Types.ObjectId.isValid(commentId);
    if (mongooseId) {
        const reply = {
            body,
            user: req.user.id
        };

        try {
            await Comment.findOneAndUpdate({ _id: commentId }, { $push: { replies: reply } });

            res.status(201).json({
                username: req.user.username,
                ...reply,
                profilePics: req.user.profilePics
            });
        } catch (err) {
            res.status(500).json({
                error: 'Server Error Occcured'
            });
        }
    }
};
module.exports = {
    commentPostController,
    replyCommentPostController
};

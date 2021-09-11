// title, body, authore, tags, thumbnal, readTimes, comment, liks, deslike

const { Schema, model } = require('mongoose');

const postSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },
        body: {
            type: String,
            required: true
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        tags: {
            type: [String],
            required: true
        },
        thumbnail: {
            type: String
        },
        readTime: {
            type: String
        },
        likes: [
            {
                type: Schema.Types.ObjectId
            }
        ],
        dislikes: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ],
        comments: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Comment'
            }
        ]
    },
    {
        timestamps: true
    }
);

postSchema.index(
    {
        title: 'text',
        body: 'text',
        tags: 'text'
    },
    {
        weight: {
            title: 5,
            tags: 5,
            body: 2
        }
    }
);

const Post = model('Post', postSchema);
module.exports = Post;

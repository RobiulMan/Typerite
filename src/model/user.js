if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config({
        path: '.env'
    });
}
require('dotenv').config();

// name, email, password and profile
const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');

const userSchema = new Schema(
    {
        username: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profile: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Profile'
            }
        ],
        profilePics: {
            type: String,
            default: '/upload/default.png'
        }
    },
    {
        timestamps: true
    }
);
userSchema.methods.generatAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.KEY, { expiresIn: '24h' });
    return token;
};
const User = model('User', userSchema);
module.exports = User;

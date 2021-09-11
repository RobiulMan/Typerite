const fs = require('fs');
const path = require('path');
const User = require('../model/user');
const Profile = require('../model/profile');

const uploadProfilePicsController = async (req, res, next) => {
    if (req.file) {
        try {
            const profilePicdir = `${path.join(__dirname, '..')}`;
            const oldProfilePics = req.user.profilePics;
            const profilePics = `/upload/${req.file.filename}`;

            const profile = await Profile.findOne({ user: req.user.id });

            if (profile) {
                const prof = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: { profilePics } }
                );
            }
            await User.findOneAndUpdate({ _id: req.user.id }, { $set: { profilePics } });

            if (oldProfilePics !== '/upload/default.png') {
                fs.unlink(`${profilePicdir}/public${oldProfilePics}`, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
            res.status(200).json({
                profilePics
            });
        } catch (err) {
            res.status(500).json({
                profilePics: req.file.profilePics
            });
        }
    }
    //   else {
    //     res.status(500).json({
    //       profilePics: req.file.profilePics
    //     });
    //   }
};
const removeProfilePicsController = (req, res, next) => {
    try {
        const profilePicdir = `${path.join(__dirname, '..')}`;
        const defualtProfilePics = '/upload/default.png';
        const currentProfilePics = req.user.profilePics;

        fs.unlink(`${profilePicdir}/public${currentProfilePics}`, async (err) => {
            if (err) {
                console.log(err);
            }
            const profile = await Profile.findOne({ user: req.user.id });
            if (profile) {
                await profile.findOneAndUpdate(
                    { _id: req.user.id },
                    { $set: { profilePics: defualtProfilePics } }
                );
            }
            await User.findOneAndUpdate(
                { _id: req.user.id },
                { $set: { profilePics: defualtProfilePics } }
            );
            res.status(200).json({
                profilePics: defualtProfilePics
            });
        });
    } catch (err) {
        res.status(500).json({
            massage: 'Can not Remove Profile'
        });
    }
};
const postImagesUploadController = (req, res, next) => {
    if (req.file) {
        res.status(200).json({
            imgeurl: `/upload/${req.file.filename}`
        });
    } else {
        res.status(500).json({
            message: 'Server Error'
        });
    }
};
module.exports = {
    uploadProfilePicsController,
    removeProfilePicsController,
    postImagesUploadController
};

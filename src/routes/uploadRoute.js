const router = require('express').Router();
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    uploadProfilePicsController,
    removeProfilePicsController,
    postImagesUploadController
} = require('../controller/uploadController');

router.post(
    '/profilePics',
    isAuthenticated,
    upload.single('profilePics'),
    uploadProfilePicsController
);

router.delete('/profilePics', isAuthenticated, removeProfilePicsController);
router.post(
    '/postimages',
    isAuthenticated,
    upload.single('post-image'),
    postImagesUploadController
);

module.exports = router;

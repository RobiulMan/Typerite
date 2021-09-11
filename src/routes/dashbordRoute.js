const express = require('express');
const { isAuthenticated } = require('../middleware/authMiddleware');
// const upload = require('../middleware/uploadMiddleware');

const router = express.Router();
const {
    dashbordGetController,
    createProfileGetController,
    createProfilePostController,
    editProfileGetController,
    editProfilePostController,
    bookmarksGetController,
    commentsGetController
} = require('../controller/dashbordController');
const Profilevalidator = require('../validator/dashbordValidator/profileValidator');

router.get('/bookmarks', isAuthenticated,bookmarksGetController)

router.get('/comments', isAuthenticated,commentsGetController)

router.get('/create-profile', isAuthenticated, createProfileGetController);
router.post('/create-profile', isAuthenticated, Profilevalidator, createProfilePostController);

router.get('/edit-profile', isAuthenticated, editProfileGetController);
router.post('/edit-profile', isAuthenticated, Profilevalidator, editProfilePostController);

router.get('/', isAuthenticated, dashbordGetController);
module.exports = router;

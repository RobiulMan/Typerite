const router = require('express').Router();

const upload = require('../middleware/uploadMiddleware');
const { addPostsGetController, addPostsPostController } = require('../controller/postController');
const postValidator = require('../validator/dashbordValidator/postsValidator/postValidator');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', addPostsGetController);
router.post(
    '/',
    isAuthenticated,
    upload.single('post-thumbnail'),
    postValidator,
    addPostsPostController
);
module.exports = router;

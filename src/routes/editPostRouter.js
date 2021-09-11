const router = require('express').Router();

const postValidator = require('../validator/dashbordValidator/postsValidator/postValidator');

const upload = require('../middleware/uploadMiddleware');
const { isAuthenticated } = require('../middleware/authMiddleware');
const {
    editPostsGetController,
    editPostsPostController,
    deletePostGetController
} = require('../controller/editPostController');

router.get('/edit-post/:postId', isAuthenticated, editPostsGetController);
router.post(
    '/edit-post/:postId',
    isAuthenticated,
    upload.single('post-thumbnail'),
    postValidator,
    editPostsPostController
);
router.get('/delete/:postId', isAuthenticated, deletePostGetController);
module.exports = router;

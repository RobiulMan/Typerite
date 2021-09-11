const router = require('express').Router();

const {
    allPostsGetController,
    allPostsPostController
} = require('../controller/allPostController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/', isAuthenticated, allPostsGetController);
router.post('/', isAuthenticated, allPostsPostController);
module.exports = router;

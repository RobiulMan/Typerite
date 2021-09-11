const router = require('express').Router();

const {
    postViewGetController,
    singlePageGetController
} = require('../controller/postViewController');

router.get('/', postViewGetController);
router.get('/:postId', singlePageGetController);

module.exports = router;

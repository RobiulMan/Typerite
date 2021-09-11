const router = require('express').Router();
// const { body } = require('express-validator');
const { singupValidator } = require('../validator/auth/signupValidator');
const { signinValidator } = require('../validator/auth/signinValidator');
// const { auths } = require('../middleware/authMiddleware');

const {
    signupGetController,
    signupPostController,
    signinGetController,
    signinPostController,
    changePasswordGetController,
    changePasswordPostController,
    logoutController
} = require('../controller/authController');

const { isUnAuthenticated,isAuthenticated } = require('../middleware/authMiddleware');

router.get('/signup', isUnAuthenticated, signupGetController);
router.post('/signup', isUnAuthenticated, singupValidator, signupPostController);

router.get('/signin', isUnAuthenticated, signinGetController);
router.post('/signin', isUnAuthenticated, signinValidator, signinPostController);

router.get('/change-password', isAuthenticated, changePasswordGetController);
router.post('/change-password', isAuthenticated, changePasswordPostController);

router.get('/signout', logoutController);

module.exports = router;

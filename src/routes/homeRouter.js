const router = require('express').Router();
const { HomeGetController } = require('../controller/HomeController');

router.get('/', HomeGetController);
module.exports = router;

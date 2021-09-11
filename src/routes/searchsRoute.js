const router = require('express').Router();

const { getSearchsResultsController } = require('../controller/searchsController');

router.get('/', getSearchsResultsController);
module.exports = router;

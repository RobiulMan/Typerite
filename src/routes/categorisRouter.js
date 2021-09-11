const router = require('express').Router();
const {
    lifestyleGetController,
    healthGetController,
    familyGetController,
    managementGetController,
    travelGetController,
    workGetController
} = require('../controller/categoriesController');

router.get('/lifestyle', lifestyleGetController);
router.get('/health', healthGetController);
router.get('/family', familyGetController);
router.get('/management', managementGetController);
router.get('/travel', travelGetController);
router.get('/work', workGetController);

module.exports = router;

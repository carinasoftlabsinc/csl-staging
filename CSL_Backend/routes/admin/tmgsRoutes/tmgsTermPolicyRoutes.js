const express = require('express');
const router = express.Router();
const tmgsTermPolicyController = require('../../../controller/tmgsControllers/tmgsTermPolicyController');
const authController = require('../../../controller/AuthController');

router.post('/createOrUpdateTmgsTermPolicy', authController.protect, tmgsTermPolicyController.createOrUpdateTmgsTermPolicy);

router.get('/getTmgsTermsPolicy', tmgsTermPolicyController.getTmgsTermsPolicy);

module.exports = router;

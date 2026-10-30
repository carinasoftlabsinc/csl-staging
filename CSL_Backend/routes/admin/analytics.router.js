const express = require('express');
const authController = require('../../controller/AuthController');
const analyticsController = require('../../controller/analyticsController');

const router = express.Router();

router.get('/analytics', authController.protect, analyticsController.getAnalyticsCounts);

router.get('/tmgsAnalytics',authController.protect, analyticsController.getTmgsAnalyticsCounts);

module.exports = router;

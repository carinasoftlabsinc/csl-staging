const express = require('express');
const router = express.Router();
const tmgsContactUsController = require('../../../controller/tmgsControllers/tmgsContactUsController');
const authController = require('../../../controller/AuthController');

router.post('/createTmgsContactUs', tmgsContactUsController.createTmgsContactUs);

// Admin
router.get('/getAllTmgsContactUsPagination', authController.protect, tmgsContactUsController.getAllTmgsContactUsPagination);

router.get("/getTmgsContactUs/:id", tmgsContactUsController.getTmgsContactUs);

router.delete("/deleteTmgsContactUs/:id", authController.protect, tmgsContactUsController.deleteTmgsContactUs);

module.exports = router;

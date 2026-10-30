const express = require('express');
const router = express.Router();
const tmgsJobApplicationController = require('../../../controller/tmgsControllers/tmgsJobApplicationController');
const authController = require('../../../controller/AuthController');
const helper = require('../../../controller/handlerFactory');
const { uploadResumeMiddleware } = require('../../../utills/resumeUpload');

router.post(
  '/applyJob',
  uploadResumeMiddleware,
  tmgsJobApplicationController.applyForJob
);

router.get(
  '/getTmgsJobApplicationsPagination',
  authController.protect,
  tmgsJobApplicationController.getTmgsJobApplicationsPagination
);

router.put(
  '/updateTmgsJobApplicationStatus/:id',
  authController.protect,
  tmgsJobApplicationController.updateTmgsJobApplicationStatus
);

router.get("/getTmgsJobApplication/:id", tmgsJobApplicationController.getTmgsJobApplication);

router.delete("/deleteTmgsJobApplication/:id", authController.protect, tmgsJobApplicationController.deleteTmgsJobApplication);
 

module.exports = router;

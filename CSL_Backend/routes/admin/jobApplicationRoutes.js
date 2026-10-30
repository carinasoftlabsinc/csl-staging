const express = require('express');
const router = express.Router();
const JobApplicationController = require('../../controller/jobApplicationController');
const authController = require('../../controller/AuthController');
const helper = require('../../controller/handlerFactory');
const { uploadResumeMiddleware } = require('../../utills/resumeUpload');

router.post(
  '/applyJobcsl',
  uploadResumeMiddleware,
  JobApplicationController.applyForJob
);

router.get(
  '/getJobApplicationsPagination',
  authController.protect,
  JobApplicationController.getJobApplicationsPagination
);

router.put(
  '/updateJobApplicationStatus/:id',
  authController.protect,
  JobApplicationController.updateJobApplicationStatus
);

router.get("/getJobApplication/:id", JobApplicationController.getJobApplication);

router.delete("/deleteJobApplication/:id", authController.protect, JobApplicationController.deleteJobApplication);
 

module.exports = router;

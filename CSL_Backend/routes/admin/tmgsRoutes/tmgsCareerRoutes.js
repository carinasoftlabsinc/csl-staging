const express = require("express");
const tmgsCareerController = require("../../../controller/tmgsControllers/tmgsCareerController");
const authController = require("../../../controller/AuthController");
const helper = require('../../../controller/handlerFactory');

const router = express.Router();

router.post(
  '/createTmgsJobPost',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'tmgsJobPost'),
  tmgsCareerController.createTmgsJobPost
);

router.put(
    '/updateTmgsJobPost/:id',
    authController.protect,
    helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'tmgsJobPost'),
    tmgsCareerController.updateTmgsJobPost
);

router.get("/getTmgsJobPost/:id", tmgsCareerController.getTmgsJobPostId);

router.get("/getTmgsJobPostPagination", tmgsCareerController.getTmgsJobPostPagination);

router.get("/getAllTmgsJobPost", tmgsCareerController.getAllTmgsJobPost);

router.delete("/deleteTmgsJobPost/:id", authController.protect, tmgsCareerController.deleteTmgsJobPost);

module.exports = router;

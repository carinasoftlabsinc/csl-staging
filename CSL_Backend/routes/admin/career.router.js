const express = require("express");
const CareerController = require("../../controller/careerController");
const authController = require("../../controller/AuthController");
const helper = require('../../controller/handlerFactory');

const router = express.Router();

router.post(
  '/createCareerJobPost',
  authController.protect,
  helper.uploadAndResizeImages([
    { name: 'image', maxCount: 1 },
    { name: 'skillImage', maxCount: 10 }
  ], 'career'),
  CareerController.createCareerJobPost
);

router.put(
  '/updateCareerJobPost/:id',
  authController.protect,
  helper.uploadAndResizeImages([
    { name: 'image', maxCount: 1 },
    { name: 'skillImage', maxCount: 10 }
  ], 'career'),
  CareerController.updateCareerJobPost
);

router.get("/getCareerJobPost/:id", CareerController.getCareerJobPostId);

router.get("/getCareerJobPostPagination", CareerController.getCareerJobPostPagination);

router.get("/getAllCareerJobPost", CareerController.getAllCareerJobPost);

router.delete(
  "/deleteCareerJobPost/:id",
  authController.protect,
  CareerController.deleteCareerJobPost
);

module.exports = router;

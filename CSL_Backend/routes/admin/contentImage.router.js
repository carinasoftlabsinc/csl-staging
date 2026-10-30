const express = require('express');
const authController = require('../../controller/AuthController');
const contentImageController = require('../../controller/contentImageController');

const router = express.Router();

// Images inside post text (blog sections, FAQs, news, careers, projects).
router.post(
  '/upload_content_image',
  authController.protect,
  contentImageController.readImage,
  contentImageController.uploadContentImage
);

module.exports = router;

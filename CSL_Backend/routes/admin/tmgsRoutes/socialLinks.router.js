const express = require('express');
const socialLinkController = require('../../../controller/tmgsControllers/socialLinksController');
const authController = require('../../../controller/AuthController');

const router = express.Router();

router.post(
  '/sociallinks',
  authController.protect,
  socialLinkController.createSocialLink
);

module.exports = router;

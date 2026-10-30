const express = require('express');
const platformController = require('../../../controller/tmgsControllers/platformController');
const authController = require('../../../controller/AuthController');

const router = express.Router();

router.post(
  '/platforms',
  authController.protect,
  platformController.createPlatform
);
router.get('/platforms', platformController.getAllPlatforms);

router.get(
  '/platforms-with-games',
  platformController.getPlatformsWithGames
);

module.exports = router;

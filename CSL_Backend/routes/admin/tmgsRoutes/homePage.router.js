const express = require('express');
const authController = require('../../../controller/AuthController');
const homePageController = require('../../../controller/tmgsControllers/homePageController');
const helper = require('../../../controller/handlerFactory');

const router = express.Router();

// Routes
router.post(
  '/home',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      // { name: 'ourPartners.logo', maxCount: 10 },
      { name: 'aboutCardBackgroundImage', maxCount: 1 },
      { name: 'eventImages', maxCount: 5 },
      { name: 'ctaImage', maxCount: 1 },
    ],
    'home'
  ),
  homePageController.createHomePage
);

// Update HomePage Data
router.put(
  '/home',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'aboutCardBackgroundImage', maxCount: 1 },
      { name: 'eventImages', maxCount: 5 },
      { name: 'ctaImage', maxCount: 1 },
    ],
    'home'
  ),
  homePageController.updateHomePage
);

// Delete HomePage Data
router.delete(
  '/home',
  authController.protect,
  homePageController.deleteHomePage
);

router.get('/home', homePageController.getPaginatedHome);

// router.get(
//   '/home',
//   homePageController.getHomePage
// );

module.exports = router;
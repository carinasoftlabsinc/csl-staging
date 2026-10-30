const express = require('express');
const router = express.Router();
const adController = require('../../../controller/tmgsControllers/adController');
const authController = require('../../../controller/AuthController');
const helper = require('../../../controller/handlerFactory');


// Create Ad
router.post(
  '/createAd',
  authController.protect,
  helper.uploadMediaFiles(
    [
      { name: 'image', maxCount: 1 },
      { name: 'videoFile', maxCount: 1 }
    ],
    'ads'
  ),
  adController.createAd
);

// Get All Ads
router.get('/getAllAds', adController.getAllAds);

// Get Paginated Ads
router.get('/getPaginatedAds', adController.getPaginatedAds);

router.get('/activeAds', adController.getActiveAds);

// Get One Ad
router.get('/getAnAd/:id', adController.getAd);

// Update Ad
router.patch(
  '/updateAd/:id',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'image', maxCount: 1 },
      { name: 'videoFile', maxCount: 1 }
    ],
    'ads'
  ),
  adController.updateAd
);

// Delete Ad
router.delete('/deleteAd/:id', authController.protect, adController.deleteAd);

// Track Play Count
router.get('/trackPlay/:id/play', adController.playAd);

// Track Click on a Platform Link
// router.post('/trackPlatformPlay/:adId/platforms/:platformIndex/click', adController.trackPlatformClick);

router.post('/trackPlatformPlay/:adId/platforms/:platformId/click', adController.trackPlatformClick);


// Check if Ad Should Play (based on game play count)
router.get('/shouldPlay/:id/should-play', adController.shouldPlayAd);

// update ad status (active/inactive)
router.patch(
  '/updateAdStatus/:id',
  authController.protect,
  adController.updateAdStatus
);


router.get('/adsAnalytics', adController.getAdsAnalytics);


module.exports = router;

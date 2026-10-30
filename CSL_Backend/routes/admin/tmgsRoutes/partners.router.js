const express = require('express');
const authController = require('../../../controller/AuthController');
const partnerController = require('../../../controller/tmgsControllers/partnersController');
const helper = require('../../../controller/handlerFactory');
const router = express.Router();

// Routes
router.post(
  '/partners',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'logo', maxCount: 1 }], 'partners'),
  partnerController.createPartner
);

router.put(
  '/partners/:id',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'logo', maxCount: 1 }], 'partners'),
  partnerController.updatePartner
);

router.delete(
  '/partners/:id',
  authController.protect,
  partnerController.deletePartner
);

router.get('/partners', partnerController.getPaginatedPartners);

module.exports = router;

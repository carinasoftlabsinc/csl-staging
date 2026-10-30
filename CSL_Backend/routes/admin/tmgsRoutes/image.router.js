const express = require('express');
const authController = require('../../../controller/AuthController');
const helper = require('../../../controller/handlerFactory');
const imageController = require('../../../controller/tmgsControllers/imageController');

const router = express.Router();


router.post(
  '/uploadImage/:folder',
  authController.protect,
  (req, res, next) =>
    helper.uploadAndResizeImagesWithPath([{ name: 'image', maxCount: 10 }], req.params.folder)(req, res, next),
  imageController.uploadImage
);

router.post(
  '/uploadImageEditor/:folder',
  authController.protect,
  (req, res, next) =>
    helper.uploadAndResizeImagesWithPath([{ name: 'image', maxCount: 10 }], req.params.folder)(req, res, next),
  imageController.uploadImageEditor
);

// router.get('/getImages/:folder?', imageController.getImages);
// router.get('/getImages/:folder?', imageController.getImages);

router.get('/getImages/:folder?', imageController.paginatedImages);


router.get(
  '/available-folders',
  imageController.getAvailableFolders
);


module.exports = router;
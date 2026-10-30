const express = require('express');
const Controller = require('../../controller/newsRoomController');
const helper = require('../../controller/handlerFactory');
const authController = require('../../controller/AuthController');

const router = express.Router();

router.post(
  '/create_news',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 }
    ],
    'news'
  ),
  Controller.create
);

router.post(
  '/update_news/:id',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 }
    ],
    'news'
  ),
  Controller.update
);

router.post(
  '/delete_news/:id',
  authController.protect,
  Controller.delete
);

router.get('/get_news/:id', Controller.getOne);
router.get('/getAll_news', Controller.getAll);
router.get(
  '/news_pagination',
  authController.protect,
  Controller.pagination
);

module.exports = router;

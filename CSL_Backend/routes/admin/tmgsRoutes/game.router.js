const express = require('express');
const authController = require('../../../controller/AuthController');
const gameController = require('../../../controller/tmgsControllers/gameController');
const helper = require('../../../controller/handlerFactory');

const router = express.Router();

// Routes
router.post(
  '/games',
  authController.protect,
  helper.uploadAndResizeImagesGames(
    [
      { name: 'iconImage', maxCount: 1 },
      { name: 'cardBackgroundImage', maxCount: 1 },
      { name: 'heroImage', maxCount: 1 },
      { name: 'trailerImage', maxCount: 1 },
      { name: 'ctaImage', maxCount: 1 },
      { name: 'featuredImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 10 },
      { name: 'overviewImage', maxCount: 1 },
      { name: 'techImages', maxCount: 10 },
      { name: 'resultImages', maxCount: 10 },
    ],
    'game'
  ),
  gameController.createGame
);

router.get('/games', gameController.getAllGames);
router.patch('/gamesOrder', authController.protect, gameController.updateGameOrder);
router.get('/gameNames', gameController.getGameNames);

router.get('/paginatedgames', gameController.getPaginatedGames);
router.get('/games/:id', gameController.getGameById);
// router.put('/games/:id', authController.protect, gameController.updateGame);

router.put(
  '/games/:id',
  authController.protect,
  helper.uploadAndResizeImagesGames(
    [
      { name: 'iconImage', maxCount: 1 },
      { name: 'cardBackgroundImage', maxCount: 1 },
      { name: 'heroImage', maxCount: 1 },
      { name: 'trailerImage', maxCount: 1 },
      { name: 'ctaImage', maxCount: 1 },
      { name: 'featuredImage', maxCount: 1 },
      { name: 'galleryImages', maxCount: 10 },
       { name: 'overviewImage', maxCount: 1 },
      { name: 'techImages', maxCount: 10 },
      { name: 'resultImages', maxCount: 10 },
    ],
    'game'
  ),
  gameController.updateGame
);

router.delete('/games/:id', authController.protect, gameController.deleteGame);

module.exports = router;

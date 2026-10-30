const express = require('express');
const authController = require('../../../controller/AuthController');
const teamController = require('../../../controller/tmgsControllers/teamController');
const helper = require('../../../controller/handlerFactory');

const router = express.Router();

// Routes
router.post(
  '/team',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'team'),
  teamController.createTeamMember
);

router.put(
  '/team/:id',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'team'),
  teamController.updateTeamMember
);

router.delete(
  '/team/:id',
  authController.protect,
  teamController.deleteTeamMember
);

router.get('/team', teamController.getPaginatedTeam);

router.get('/team/:id', teamController.getTeamMember);

module.exports = router;

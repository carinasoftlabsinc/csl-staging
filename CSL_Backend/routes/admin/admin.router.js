const express = require('express');
const adminController = require('../../controller/adminController');
const helper = require("../../controller/handlerFactory");
const authController = require('../../controller/AuthController');

const router = express.Router();

router.post('/login', authController.login);

// Admin accounts: only a SuperAdmin can list, create or deactivate them.
router.get('/users', authController.protect, authController.restrictTo('SuperAdmin'), authController.listUsers);
router.post('/users', authController.protect, authController.restrictTo('SuperAdmin'), authController.createAdminUser);
router.patch(
  '/users/:id/deactivate',
  authController.protect,
  authController.restrictTo('SuperAdmin'),
  authController.deactivateUser
);

router.patch(
  '/updateMyPassword',
  authController.protect,
  authController.updatePassword
);
router.get(
  '/me',
  authController.protect,
  adminController.getMe,
  adminController.getUser
);
router.patch(
  '/updateMe',
  authController.protect,
  helper.uploadAndResizeImage('profile_image', 'user'),
  adminController.updateMe
);

router.delete('/deleteMe', authController.protect, adminController.deleteMe);

module.exports = router;

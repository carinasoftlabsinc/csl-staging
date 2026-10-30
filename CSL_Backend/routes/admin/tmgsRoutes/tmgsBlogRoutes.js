const express = require("express");
const tmgsBlogController = require("../../../controller/tmgsControllers/tmgsBlogController");
const authController = require("../../../controller/AuthController");
const helper = require('../../../controller/handlerFactory');

const router = express.Router();

router.post(
  '/createTmgsBlog',
  authController.protect,
  helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'tmgsBlogs'),
  tmgsBlogController.createBlog
);

router.put(
    '/updateTmgsBlog/:id',
    authController.protect,
    helper.uploadAndResizeImages([{ name: 'image', maxCount: 1 }], 'tmgsBlogs'),
    tmgsBlogController.updateTmgsBlog
);

router.get("/getAllTmgsBlogs", tmgsBlogController.getAllBlogs);

router.get("/getTmgsBlogs", tmgsBlogController.getAll);

router.get("/getTmgsBlog/:id", tmgsBlogController.getBlogById);

router.delete("/deleteTmgsBlog/:id", authController.protect, tmgsBlogController.deleteBlog);

router.post('/reorderTmgsblogs', authController.protect, tmgsBlogController.updateBlogOrderIndex);

router.get('/init-tmgsblog-order', authController.protect, authController.restrictTo('SuperAdmin'), tmgsBlogController.initializeBlogOrder);

router.get('/getBlogTitles', tmgsBlogController.getBlogTitles);
router.patch('/updateBlogOrder', authController.protect, tmgsBlogController.updateBlogOrder);

router.patch('/increaseViews/:id', tmgsBlogController.increaseViews)

module.exports = router;

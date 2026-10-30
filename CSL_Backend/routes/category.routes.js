const express = require('express');
const Controller = require('../controller/categoryController');
const helper = require('../controller/handlerFactory');
const authController = require('../controller/AuthController');

const router = express.Router();

router.post("/addCategory", authController.protect, Controller.createCategory);

router.get("/getAllCategories", authController.protect, Controller.getAllCategories);

router.get("/getCategoryById/:id", authController.protect, Controller.getCategoryById);

router.put("/updateCategory/:id", authController.protect, Controller.updateCategory);

router.patch('/updateCategoryStatus/:id', authController.protect, Controller.updateCategoryStatus);

router.get('/getCategoriesWithBlogCount', Controller.getCategoriesWithBlogCount);

module.exports = router;

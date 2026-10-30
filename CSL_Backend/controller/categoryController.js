const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const helper = require('../controller/handlerFactory');
const Category = require('../model/Category');
const he = require('he');
const tmgsBlog = require('../model/tmgsModels/tmgsBlog.model');

exports.createCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
  
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return next(new AppError("This category already exists!", 400));
    }
  
    // Create new category
    const newCategory = await Category.create({
      name,
      description,
    });
  
    res.status(201).json({
      status: "success",
      data: newCategory,
    });
});

exports.getAllCategories = catchAsync(async (req, res, next) => {
    const categories = await Category.find().sort({createdAt: -1});
    
    res.status(200).json({
      status: "success",
      data: categories,
    });
});
  
exports.getCategoryById = catchAsync(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return next(new AppError("Category not found!", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: category,
    });
});
  

exports.updateCategory = catchAsync(async (req, res, next) => {
    const { name, description } = req.body;
  
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true, runValidators: true }
    );
  
    if (!updatedCategory) {
      return next(new AppError("Category not found!", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: updatedCategory,
    });
});
  

exports.updateCategoryStatus = catchAsync(async (req, res, next) => {
    const { isActive } = req.body;
  
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true, runValidators: true }
    );
  
    if (!updatedCategory) {
      return next(new AppError("Category not found!", 404));
    }
  
    res.status(200).json({
      status: "success",
      data: updatedCategory,  
    });
});


exports.getCategoriesWithBlogCount = catchAsync(async (req, res) => {
  try {
    const result = await tmgsBlog.aggregate([
      {
        $match: { active: true }
      },
      {
        $group: {
          _id: "$category",
          blogCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories", // Make sure this is the actual collection name in MongoDB
          // from: Category.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails"
        }
      },
      {
        $unwind: "$categoryDetails"
      },
      {
        $project: {
          _id: "$categoryDetails._id",
          name: "$categoryDetails.name",
          description: "$categoryDetails.description",
          isActive: "$categoryDetails.isActive",
          blogCount: 1 
        }
      },
      {
        $match: {
          blogCount: { $gt: 0 }
        }
      }
    ]);

    return res.status(200).json({
      status: true,
      message: "Categories with blog count fetched successfully",
      data: result
    });
  } catch (err) {
    console.error("Error fetching categories with blog count:", err);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch categories",
      error: err.message
    });
  }
});
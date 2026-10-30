const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../../controller/handlerFactory');
const TmgsCareer = require('../../model/tmgsModels/tmgsCareer.model');
const he = require('he');

exports.createTmgsJobPost = catchAsync(async (req, res, next) => {
    const { 
      title, 
      description,
      content,
      image, 
      employmentType, 
      location, 
      experience, 
      applicationDeadline, 
      applyLink, 
    } = req.body;
  
    const existingJob = await TmgsCareer.findOne({ title });
    if (existingJob) {
      return next(new AppError("A job post with this title already exists!", 400));
    }
  
    const decodedContent = he.decode(content);

    // Create new job post
    const newJob = await TmgsCareer.create({
      title,
      description,
      content: decodedContent,
      image,
      employmentType,
      location,
      experience,
      applicationDeadline,
      applyLink,
    });
  
    res.status(201).json({
      status: "success",
      data: newJob,
    });
  });
  
  exports.updateTmgsJobPost = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { 
      title, 
      description,
      image,
      content, 
      employmentType, 
      location, 
      experience, 
      applicationDeadline, 
      applyLink, 
      isFeatured, 
      active 
    } = req.body;

    // Find the job post by ID
    const jobPost = await TmgsCareer.findById(id);
    if (!jobPost) {
      return next(new AppError("Job post not found!", 404));
    }

    // Check if another job post with the same title exists (excluding current one)
    if (title && title !== jobPost.title) {
      const existingJob = await TmgsCareer.findOne({ title });
      if (existingJob) {
        return next(new AppError("A job post with this title already exists!", 400));
      }
    }

    // Decode content if provided
    const decodedContent = content ? he.decode(content) : jobPost.content;

    // Update job post fields
    jobPost.title = title || jobPost.title;
    jobPost.description = description || jobPost.description;
    jobPost.content = decodedContent;
    jobPost.image = image;
    jobPost.employmentType = employmentType || jobPost.employmentType;
    jobPost.location = location || jobPost.location;
    jobPost.experience = experience || jobPost.experience;
    jobPost.applicationDeadline = applicationDeadline || jobPost.applicationDeadline;
    jobPost.applyLink = applyLink || jobPost.applyLink;
    jobPost.isFeatured = isFeatured !== undefined ? isFeatured : jobPost.isFeatured;
    jobPost.active = active !== undefined ? active : jobPost.active;

    await jobPost.save();

    res.status(200).json({
      status: "success",
      data: jobPost,
    });
});

exports.getTmgsJobPostId = helper.getOne(TmgsCareer);

exports.getTmgsJobPostPagination = helper.pagination(TmgsCareer, 'title');

exports.getAllTmgsJobPost = helper.getAll(TmgsCareer);

exports.deleteTmgsJobPost = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find and delete the blog
    const blog = await TmgsCareer.findByIdAndDelete(id);

    // If the blog is not found
    if (!blog) {
        return next(new AppError("Job Post not found!", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Job Post deleted successfully!",
    });
});

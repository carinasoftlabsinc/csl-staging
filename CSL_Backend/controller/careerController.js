const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const helper = require('../controller/handlerFactory');
const Career = require('../model/career.model');
const he = require('he');
const { preparePostHtml } = require('../utills/postHtml');

// CREATE JOB POST
exports.createCareerJobPost = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    content,
    employmentType,
      location,
    roleCategory,
    experience,
    noOfPositions,
    applicationDeadline,
    salary,
    applyLink,
    isFeatured,
      active,
      image,
    skillImage,
  } = req.body;

//   const image = req.files?.image?.[0]?.path || req.body.image;
//   const skillImage = req.files?.skillImage?.map((file) => file.path) || [];

  const existingJob = await Career.findOne({ title });
  if (existingJob) {
    return next(
      new AppError('A job post with this title already exists!', 400)
    );
  }

  const decodedContent = await preparePostHtml(he.decode(content || ''));

  const newJob = await Career.create({
    title,
    description,
    content: decodedContent,
    image,
    skillImage: Array.isArray(skillImage) ? skillImage : [skillImage],
    employmentType,
      location,
    roleCategory,
    experience,
    noOfPositions,
    applicationDeadline,
    salary,
    applyLink,
    isFeatured,
    active,
  });

  res.status(201).json({
    status: 'success',
    data: newJob,
  });
});

// UPDATE JOB POST
exports.updateCareerJobPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const {
    title,
    description,
    content,
    employmentType,
      location,
    roleCategory,
    experience,
    noOfPositions,
    applicationDeadline,
    salary,
    applyLink,
    isFeatured,
      active,
    image,
    skillImage,
  } = req.body;

//   const image = req.files?.image?.[0]?.path || req.body.image;
//   const skillImage =
//     req.files?.skillImage?.map((file) => file.path) || undefined;

  const jobPost = await Career.findById(id);
  if (!jobPost) {
    return next(new AppError('Job post not found!', 404));
  }

  if (title && title !== jobPost.title) {
    const existingJob = await Career.findOne({ title });
    if (existingJob) {
      return next(
        new AppError('A job post with this title already exists!', 400)
      );
    }
  }

  const decodedContent = content ? await preparePostHtml(he.decode(content)) : jobPost.content;

  jobPost.title = title || jobPost.title;
  jobPost.description = description || jobPost.description;
  jobPost.content = decodedContent;
  jobPost.image = image || jobPost.image;
  if (skillImage) {
    jobPost.skillImage = skillImage;
  }
  //   jobPost.skillImage = Array.isArray(skillImage) ? skillImage : jobPost.skillImage;
  jobPost.employmentType = employmentType || jobPost.employmentType;
  jobPost.location = location || jobPost.location;
  jobPost.roleCategory = roleCategory || jobPost.roleCategory;
  jobPost.experience = experience || jobPost.experience;
  jobPost.noOfPositions =
    noOfPositions !== undefined ? noOfPositions : jobPost.noOfPositions;
  jobPost.applicationDeadline =
    applicationDeadline || jobPost.applicationDeadline;
  jobPost.salary = salary || jobPost.salary;
  jobPost.applyLink = applyLink || jobPost.applyLink;
  jobPost.isFeatured =
    isFeatured !== undefined ? isFeatured : jobPost.isFeatured;
  jobPost.active = active !== undefined ? active : jobPost.active;

  await jobPost.save();

  res.status(200).json({
    status: 'success',
    data: jobPost,
  });
});

// GET JOB POST BY ID
exports.getCareerJobPostId = helper.getOne(Career);

// GET JOB POSTS WITH PAGINATION
exports.getCareerJobPostPagination = helper.pagination(Career, 'title');

// GET ALL JOB POSTS
exports.getAllCareerJobPost = helper.getAll(Career);

// DELETE JOB POST
exports.deleteCareerJobPost = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const deleted = await Career.findByIdAndDelete(id);

  if (!deleted) {
    return next(new AppError('Job Post not found!', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Job Post deleted successfully!',
  });
});

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const mongoose = require('mongoose');
const Model = require('../model/caseStudy.model');
const APIFeatures = require('../utills/apiFeatures');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const helper = require('./handlerFactory');
const he = require('he');
const { preparePostHtml } = require('../utills/postHtml');

// const parseData = (data) => {
//   if (Array.isArray(data)) {
//     return data;
//   } else if (typeof data === 'string') {
//     return data.split(',').map((part) => part.trim());
//   } else {
//     throw new AppError('Invalid data format', 400);
//   }
// };

// exports.create = catchAsync(async (req, res, next) => {
//   const {
//     title,
//     titleLink,
//     category,
//     description,
//     about_title,
//     aboutDescription,
//     content,
//     solutionContent,
//     industry,
//     deliverables,
//     clientReview,
//     clientName,
//     designation,
//     title_1,
//     desc_1,
//     title_2,
//     desc_2,
//     title_3,
//     desc_3,
//     projectLogo,
//     tech,
//   } = req.body;

//   const decodedContent = he.decode(content);
//   const decodedContent_2 = he.decode(solutionContent);

//   const existingData = await Model.findOne({ title });
//   if (existingData) {
//     return next(new AppError('This news already exists!', 401));
//   }

//   const image = req.body.image || undefined;
//   const image_2 = req.body.image_2 || undefined;
//   const aboutBg = req.body.aboutBg || undefined;
//   const how_image = req.body.how_image || undefined;

//   const newData = await Model.create({
//     title,
//     titleLink,
//     description,
//     category,
//     about_title,
//     aboutDescription,
//     content: decodedContent,
//     solutionContent: decodedContent_2,
//     industry,
//     deliverables,
//     clientReview,
//     clientName,
//     designation,
//     projectLogo,
//     tech,
//     image,
//     image_2,
//     aboutBg,
//     how_image,
//     title_1,
//     desc_1,
//     title_2,
//     desc_2,
//     title_3,
//     desc_3,
//   });

//   // Send the response with the newly created data
//   res.status(201).json({
//     status: 'success',
//     data: newData,
//   });
// });

const parseData = (data) => {
  if (!data) return [];

  if (Array.isArray(data)) {
    return data.filter(Boolean); // Remove null/undefined/empty strings
  }

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {
      return data.split(',')
        .map((part) => part.trim())
        .filter(Boolean);
    }
  }

  return [];
};


exports.create = catchAsync(async (req, res, next) => {
  const {
    title,
    titleLink,
    category,
    description,
    about_title,
    aboutDescription,
    content,
    solutionContent,
    industry,
    deliverables,
    clientReview,
    clientName,
    designation,
    title_1,
    desc_1,
    title_2,
    desc_2,
    title_3,
    desc_3,
    tech,
    overviewPara,
    resultHeading_1,
    resultHeading_2,
    keyHeading,
    goalsHeading1,
    goalsHeading2,
    goalsHeading3,
    keyDescription,
    workSteps,
    developement,
    userFlowDescription,
  } = req.body;

  const decodedContent = await preparePostHtml(he.decode(content || ''));
  const decodedContent_2 = await preparePostHtml(he.decode(solutionContent || ''));

  const existingData = await Model.findOne({ title });
  if (existingData) {
    return next(new AppError('This case study already exists!', 401));
  }

  // Handle image fields
  const image = req.files?.image?.[0]?.path || req.body.image || undefined;
  const image_2 = req.files?.image_2?.[0]?.path || req.body.image_2 || undefined;
  const aboutBg = req.files?.aboutBg?.[0]?.path || req.body.aboutBg || undefined;
  const how_image = req.files?.how_image?.[0]?.path || req.body.how_image || undefined;
  const projectLogo = req.files?.projectLogo?.[0]?.path || req.body.projectLogo || undefined;
  const headingIcon = req.files?.headingIcon?.[0]?.path || req.body.headingIcon || undefined;
  const overviewImage = req.files?.overviewImage?.[0]?.path || req.body.overviewImage || undefined;

  // Handle image arrays
  const resultImages = req.body.resultImages || [];
  const uiImages = req.body.uiImages || [];
  const techImages = req.body.techImages || [];

  const newData = await Model.create({
    title,
    titleLink,
    category,
    description,
    about_title,
    aboutDescription,
    content: decodedContent,
    solutionContent: decodedContent_2,
    industry,
    deliverables,
    clientReview,
    clientName,
    designation,
    tech,
    projectLogo,
    image,
    image_2,
    aboutBg,
    how_image,
    title_1,
    desc_1,
    title_2,
    desc_2,
    title_3,
    desc_3,
    headingIcon,
    overviewImage,
    overviewPara,
    resultImages,
    resultHeading_1,
    resultHeading_2,
    keyHeading,
    goalsHeading1,
    goalsHeading2,
    goalsHeading3,
    keyDescription,
    workSteps: parseData(workSteps || []),
    developement: parseData(developement || []),
    userFlowDescription,
    uiImages,
    techImages,
  });

  res.status(201).json({
    status: 'success',
    data: newData,
  });
});



// exports.update = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const {
//     title,
//     titleLink,
//     category,
//     description,
//     about_title,
//     aboutDescription,
//     content,
//     solutionContent,
//     industry,
//     deliverables,
//     clientReview,
//     clientName,
//     designation,
//     title_1,
//     desc_1,
//     title_2,
//     desc_2,
//     title_3,
//     desc_3,
//     projectLogo,
//     tech,

//     // New fields
//     headingIcon,
//     overviewImage,
//     overviewPara,
//     resultImages,
//     resultHeading_1,
//     resultHeading_2,
//     keyHeading,
//     keyDescription,
//     workSteps,
//     developement,
//     userFlowDescription,
//     uiImages,
//     techImages,
//   } = req.body;

//   const image = req.body.image || undefined;
//   const image_2 = req.body.image_2 || undefined;
//   const aboutBg = req.body.aboutBg || undefined;
//   const how_image = req.body.how_image || undefined;

//   const decodedContent = he.decode(content);
//   const decodedContent_2 = he.decode(solutionContent);

//   const updatedData = await Model.findByIdAndUpdate(
//     id,
//     {
//       title,
//       titleLink,
//       description,
//       category,
//       about_title,
//       aboutDescription,
//       content: decodedContent,
//       solutionContent: decodedContent_2,
//       industry,
//       deliverables,
//       clientReview,
//       clientName,
//       designation,
//       projectLogo,
//       tech,
//       image,
//       image_2,
//       aboutBg,
//       how_image,
//       title_1,
//       desc_1,
//       title_2,
//       desc_2,
//       title_3,
//       desc_3,

//       // New fields
//       headingIcon,
//       overviewImage,
//       overviewPara,
//       resultImages: parseData(resultImages),
//       resultHeading_1,
//       resultHeading_2,
//       keyHeading,
//       keyDescription,
//       workSteps,
//       developement,
//       userFlowDescription,
//       uiImages: parseData(uiImages),
//       techImages: parseData(techImages),
//     },
//     { new: true, runValidators: true }
//   );

//   if (!updatedData) {
//     return next(new AppError('Data not found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: updatedData,
//   });
// });

// exports.update = catchAsync(async (req, res, next) => {
//   const { id } = req.params;

//   const {
//     title,
//     titleLink,
//     category,
//     description,
//     about_title,
//     aboutDescription,
//     content,
//     solutionContent,
//     industry,
//     deliverables,
//     clientReview,
//     clientName,
//     designation,
//     title_1,
//     desc_1,
//     title_2,
//     desc_2,
//     title_3,
//     desc_3,
//     overviewPara,
//     resultHeading_1,
//     resultHeading_2,
//     keyHeading,
//     keyDescription,
//     workSteps,
//     developement,
//     userFlowDescription,
//   } = req.body;

//   const decodedContent = he.decode(content || '');
//   const decodedContent_2 = he.decode(solutionContent || '');

//   // Image fields (uploaded or fallback to body string)
//   const image = req.files?.image?.[0]?.path || req.body.image || undefined;
//   const image_2 = req.files?.image_2?.[0]?.path || req.body.image_2 || undefined;
//   const aboutBg = req.files?.aboutBg?.[0]?.path || req.body.aboutBg || undefined;
//   const how_image = req.files?.how_image?.[0]?.path || req.body.how_image || undefined;
//   const projectLogo = req.files?.projectLogo?.[0]?.path || req.body.projectLogo || undefined;

//   // New image fields
//   const headingIcon = req.files?.headingIcon?.[0]?.path || req.body.headingIcon || undefined;
//   const overviewImage = req.files?.overviewImage?.[0]?.path || req.body.overviewImage || undefined;

//   // Array fields (images - multiple file uploads or comma-separated strings)
//   const resultImages = (req.files?.resultImages
//     ? req.files.resultImages.map((file) => file.path)
//     : parseData(req.body.resultImages)
//   ).filter(Boolean); // Remove null/undefined
  
//   const uiImages = (req.files?.uiImages
//     ? req.files.uiImages.map((file) => file.path)
//     : parseData(req.body.uiImages)
//   ).filter(Boolean);
  
//   const techImages = (req.files?.techImages
//     ? req.files.techImages.map((file) => file.path)
//     : parseData(req.body.techImages)
//   ).filter(Boolean);
  


//   const updatedData = await Model.findByIdAndUpdate(
//     id,
//     {
//       title,
//       titleLink,
//       description,
//       category,
//       about_title,
//       aboutDescription,
//       content: decodedContent,
//       solutionContent: decodedContent_2,
//       industry,
//       deliverables,
//       clientReview,
//       clientName,
//       designation,
//       projectLogo,
//       tech: req.body.tech, // if this is an array, ensure parseData
//       image,
//       image_2,
//       aboutBg,
//       how_image,
//       title_1,
//       desc_1,
//       title_2,
//       desc_2,
//       title_3,
//       desc_3,

//       // New fields
//       headingIcon,
//       overviewImage,
//       overviewPara,
//       resultImages,
//       resultHeading_1,
//       resultHeading_2,
//       keyHeading,
//       keyDescription,
//       workSteps: parseData(workSteps || []),
//       developement: parseData(developement || []),
//       userFlowDescription,
//       uiImages,
//       techImages,
//     },
//     { new: true, runValidators: true }
//   );

//   if (!updatedData) {
//     return next(new AppError('Data not found', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: updatedData,
//   });
// });

exports.update = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  
  const {
    title,
    titleLink,
    category,
    description,
    about_title,
    aboutDescription,
    content,
    solutionContent,
    industry,
    deliverables,
    clientReview,
    clientName,
    designation,
    title_1,
    desc_1,
    title_2,
    desc_2,
    title_3,
    desc_3,
    overviewPara,
    resultHeading_1,
    resultHeading_2,
    keyHeading,
    goalsHeading1,
    goalsHeading2,
    goalsHeading3,
    keyDescription,
    workSteps,
    developement,
    userFlowDescription,
  } = req.body;

  const decodedContent = await preparePostHtml(he.decode(content || ''));
  const decodedContent_2 = await preparePostHtml(he.decode(solutionContent || ''));

  // Handle image fields
  const image = req.files?.image?.[0]?.path || req.body.image || undefined;
  const image_2 = req.files?.image_2?.[0]?.path || req.body.image_2 || undefined;
  const aboutBg = req.files?.aboutBg?.[0]?.path || req.body.aboutBg || undefined;
  const how_image = req.files?.how_image?.[0]?.path || req.body.how_image || undefined;
  const projectLogo = req.files?.projectLogo?.[0]?.path || req.body.projectLogo || undefined;
  const headingIcon = req.files?.headingIcon?.[0]?.path || req.body.headingIcon || undefined;
  const overviewImage = req.files?.overviewImage?.[0]?.path || req.body.overviewImage || undefined;

  // Handle image arrays
  const resultImages = req.body.resultImages || [];
  const uiImages = req.body.uiImages || [];
  const techImages = req.body.techImages || [];
  

  const updatedData = await Model.findByIdAndUpdate(
    id,
    {
      title,
      titleLink,
      category,
      description,
      about_title,
      aboutDescription,
      content: decodedContent,
      solutionContent: decodedContent_2,
      industry,
      deliverables,
      clientReview,
      clientName,
      designation,
      projectLogo,
      image,
      image_2,
      aboutBg,
      how_image,
      title_1,
      desc_1,
      title_2,
      desc_2,
      title_3,
      desc_3,
      headingIcon,
      overviewImage,
      resultImages,
      uiImages,
      techImages,
      workSteps: parseData(workSteps || []),
      developement: parseData(developement || []),
      userFlowDescription,
      resultHeading_1,
      resultHeading_2,
      keyHeading,
      goalsHeading1,
      goalsHeading2,
      goalsHeading3,
      keyDescription,
      overviewPara,
    },
    { new: true, runValidators: true }
  );

  if (!updatedData) {
    return next(new AppError('Data not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedData,
  });
});



const SINGLE_IMAGE_FIELDS = ['image', 'image_2', 'aboutBg', 'how_image', 'projectLogo', 'headingIcon', 'overviewImage'];
const MULTI_IMAGE_FIELDS = ['resultImages', 'uiImages', 'techImages'];
const PROJECT_IMAGE_DIR = path.join(__dirname, '..', 'public', 'project');

/** Every uploaded image path ("/project/<file>") a project refers to. */
const projectImagePaths = (doc) =>
  [
    ...SINGLE_IMAGE_FIELDS.map((field) => doc[field]),
    ...MULTI_IMAGE_FIELDS.flatMap((field) => doc[field] || []),
  ].filter((value) => typeof value === 'string' && value.startsWith('/project/'));

// Deletes a project and the image files that only it used. A file another project still
// refers to is kept, and a file problem never blocks the delete itself.
exports.delete = catchAsync(async (req, res, next) => {
  const doc = await Model.findByIdAndDelete(req.params.id);
  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  for (const imagePath of new Set(projectImagePaths(doc))) {
    const stillUsed = await Model.exists({
      $or: [...SINGLE_IMAGE_FIELDS, ...MULTI_IMAGE_FIELDS].map((field) => ({ [field]: imagePath })),
    });
    if (stillUsed) continue;

    // Only a plain file name inside public/project, so a stored path can never point elsewhere.
    const file = path.join(PROJECT_IMAGE_DIR, path.basename(imagePath));
    try {
      await fs.promises.unlink(file);
    } catch (err) {
      if (err.code !== 'ENOENT') console.error('Could not delete project image', file, err.message);
    }
  }

  res.status(204).json({ status: 'success', data: null });
});

const PROJECT_CATEGORIES = ['game', 'app', 'web', 'digital-marketing', 'ai-emerging-technology'];
const escapeRegex = (text) => String(text).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Admin list: title search, optional category, ordered the way the website shows it.
exports.pagination = catchAsync(async (req, res) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 500);
  const query = { title: { $regex: escapeRegex(req.query.filter || ''), $options: 'i' } };
  if (PROJECT_CATEGORIES.includes(req.query.category)) query.category = req.query.category;

  const [data, totalCount] = await Promise.all([
    Model.find(query)
      .sort({ orderIndex: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Model.countDocuments(query),
  ]);

  res.json({ data, page, limit, totalCount });
});

// Public list for the website: active projects only, in the admin order.
exports.getAll = catchAsync(async (req, res) => {
  const queryString = { ...req.query, sort: req.query.sort || 'orderIndex,-createdAt' };
  const features = new APIFeatures(Model.find({ isActive: { $ne: false } }), queryString)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  res.status(200).json({ status: 'success', results: doc.length, data: { data: doc } });
});

// Saves a new order for one category: body { category, ids } with ids in display order.
exports.reorder = catchAsync(async (req, res, next) => {
  const { category, ids } = req.body;
  if (!PROJECT_CATEGORIES.includes(category)) {
    return next(new AppError('A valid category is required', 400));
  }
  if (!Array.isArray(ids) || !ids.length || !ids.every((id) => mongoose.isValidObjectId(id))) {
    return next(new AppError('ids must be a non-empty list of project ids', 400));
  }

  const result = await Model.bulkWrite(
    ids.map((id, index) => ({
      updateOne: { filter: { _id: id, category }, update: { $set: { orderIndex: index } } },
    }))
  );

  res.status(200).json({ status: 'success', data: { matched: result.matchedCount } });
});

// Shows or hides a project on the website: body { isActive: boolean }.
exports.setStatus = catchAsync(async (req, res, next) => {
  if (typeof req.body.isActive !== 'boolean') {
    return next(new AppError('isActive must be true or false', 400));
  }

  const updated = await Model.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true, runValidators: true }
  );
  if (!updated) {
    return next(new AppError('Data not found', 404));
  }

  res.status(200).json({ status: 'success', data: updated });
});
exports.getOne = helper.getOne(Model);

exports.addSection = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const { title, description, logo } = req.body;

  const data = await Model.findById(id);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  const newData = {
    title,
    description,
    logo,
  };

  data.developmentProcess.push(newData);

  await data.save();

  // Respond with success
  res.status(200).json({
    status: 'success',
    data: data,
  });
});

exports.deleteSection = catchAsync(async (req, res, next) => {
  const { id: _id, sectionId } = req.params;

  const data = await Model.findById(_id);
  if (!data) {
    return next(new AppError('Data not found', 404));
  }

  const data_2 = data.developmentProcess.id(sectionId);
  if (!data_2) {
    return next(new AppError('not found', 404));
  }

  data.developmentProcess.pull({ _id: sectionId });

  await data.save();

  res.status(204).json({
    status: 'success',
    message: 'Deleted successfully',
  });
});

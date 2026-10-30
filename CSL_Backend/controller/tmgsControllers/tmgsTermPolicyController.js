const TmgsTermPolicy = require('../../model/tmgsModels/tmgsTermPolicy.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const he = require('he');
const allowedTypes = ['terms', 'privacy'];

exports.createOrUpdateTmgsTermPolicy = catchAsync(async (req, res, next) => {
    const { type, content } = req.body;

    console.log("Body " + req.body);

    console.log("Type " + req.body.type);
  
    const allowedTypes = ['terms', 'privacy'];
  
    if (!type || !content) {
      return next(new AppError('Both type and content are required.', 400));
    }
  
    if (!allowedTypes.includes(type)) {
      return next(new AppError('Invalid type. Allowed values are "terms" or "privacy".', 400));
    }
  
    const existingPolicy = await TmgsTermPolicy.findOne({ type });
  
    const decodedContent = he.decode(content);
  
    if (existingPolicy) {
      existingPolicy.content = decodedContent;
      await existingPolicy.save();
  
      return res.status(200).json({
        status: 'success',
        message: 'Policy data updated successfully.',
        data: existingPolicy,
      });
    }
  
    const newPolicy = await TmgsTermPolicy.create({ type, content: decodedContent });
  
    res.status(201).json({
      status: 'success',
      message: 'Policy data created successfully.',
      data: newPolicy,
    });
  });

exports.getTmgsTermsPolicy = catchAsync(async (req, res, next) => {
  const { type } = req.query;

  if (!type) {
    return next(new AppError('Type is required to fetch the policy.', 400));
  }

  if (!allowedTypes.includes(type)) {
    return next(new AppError('Invalid type. Allowed values are "terms" or "privacy".', 400));
  }

  const policy = await TmgsTermPolicy.findOne({ type });

  if (!policy) {
    return next(new AppError('No policy found for the given type.', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Policy fetched successfully.',
    data: policy,
  });
});

const SocialLink = require('../../model/tmgsModels/socialLinks.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');

exports.createSocialLink = catchAsync(async (req, res, next) => {
  const { name, url } = req.body;

  if (!name || !url) {
    return next(new AppError('Both name and URL are required!', 400));
  }

  const socialLink = await SocialLink.create({ name, url });

  res.status(201).json({
    status: 'success',
    data: { socialLink },
  });
});

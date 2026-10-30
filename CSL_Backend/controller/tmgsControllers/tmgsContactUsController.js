const TmgsContactUs = require('../../model/tmgsModels/tmgsContactus.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../../controller/handlerFactory');

exports.createTmgsContactUs = catchAsync(async (req, res, next) => {
  const { name, email, phone, subject, message } = req.body;

  const newContact = await TmgsContactUs.create({
    name,
    email,
    phone,
    subject,
    message
  });

  res.status(201).json({
    status: 'success',
    message: 'Your message has been sent successfully!',
    data: newContact
  });
});

exports.getAllTmgsContactUsPagination = helper.pagination(TmgsContactUs, 'name');

exports.getTmgsContactUs = helper.getOne(TmgsContactUs);

exports.deleteTmgsContactUs = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find and delete the blog
    const blog = await TmgsContactUs.findByIdAndDelete(id);

    // If the blog is not found
    if (!blog) {
        return next(new AppError("Contact us not found!", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Contact Us deleted successfully!",
    });
});


const catchAsync  = require('../utills/catchAsync');
const Model = require('../model/contactDetails.model'); 
const Email = require('../utills/email');
const AppError = require('../utills/appError');
const helper = require('../controller/handlerFactory');
// const validateContactData = (data) => {
//   const { name, email, phone, message } = data;
//   if (!name || !email || !phone || !message) {
//     return false;
//   }
//   return true;
// };

exports.contactDetails = catchAsync(async (req, res, next) => {
  const { name, email, phone, address, message, service, budget } = req.body;

  try {
    const newData = await Model.create({
      name,
      email,
      phone,
      address,
      message,
      service,
      budget,
      from: 'Contact Form',
    });

    if (newData) {
      const emailService = new Email();
      await emailService.sendContactDetails(
        name,
        email,
        phone,
        address,
        message,
        service,
        budget
      );
      await emailService.sendThankYou(name, email);
    }

    res.status(200).json({
      status: 'success',
      message: 'Contact details sent successfully!',
    });
  } catch (err) {
    return next(new AppError('Failed to send contact details.', 500));
  }
});

exports.serviceDetails = catchAsync(async (req, res, next) => {
  const { name, email, phone, message, service, budget } = req.body;

  try {
    const newData = await Model.create({
      name,
      email,
      phone,
      message,
      service,
      budget,
      from: 'Service Form',
    });

    if (newData) {
      const emailService = new Email();
      await emailService.sendServiceDetails(name, email, phone, message);
      await emailService.sendThankYou(name, email);
    }

    res.status(200).json({
      status: 'success',
      message: 'Service details sent successfully!',
    });
  } catch (err) {
    return next(new AppError('Failed to send service details.', 500));
  }
});

exports.delete = helper.HarddeleteOne(Model);

exports.pagination = helper.pagination(Model, 'name');
exports.getOne = helper.getOne(Model);

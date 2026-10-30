const helper = require('../handlerFactory');
const Partner = require('../../model/tmgsModels/partners.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');


exports.createPartner = catchAsync(async (req, res, next) => {
    const body = req.body;
  
    // Check if logo exists in `req.body`
    if (!body.logo || (Array.isArray(body.logo) && body.logo.length === 0)) {
      return next(new AppError('Logo image is required!', 400));
    }
  
    // If logo is an array (due to multiple uploads), take the first one
    if (Array.isArray(body.logo)) {
      body.logo = body.logo[0];
    }
  
  
    // Create the partner entry
    const newPartner = await Partner.create(body);
  
    res.status(201).json({
      status: 'success',
      data: { partner: newPartner },
    });
  });
  

  exports.updatePartner = catchAsync(async (req, res, next) => {
    const { id } = req.params; // Get partner ID from URL
    const body = req.body;


    // Ensure the logo is properly set if provided
    if (body.logo && Array.isArray(body.logo)) {
        body.logo = body.logo[0];
    }


    // Use findOneAndReplace to fully replace the document with the new data
    const updatedPartner = await Partner.findOneAndUpdate(
        { _id: id }, // Find partner by ID
        body, 
        { 
            new: true,  // Return the updated document
            runValidators: true, // Ensure validation rules are applied
            overwrite: true // Ensure full replacement (PUT behavior)
        }
    );

    if (!updatedPartner) {
        return next(new AppError('No partner found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: { partner: updatedPartner },
    });
});



exports.deletePartner = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    const partner = await Partner.findByIdAndDelete(id);

    if (!partner) {
        return next(new AppError('No partner found with that ID', 404));
    }

    res.status(200).json({ 
        status: 'success', 
        message: 'Partner deleted successfully' 
    });
});



// Get all partners
// exports.getAllPartners = catchAsync(async (req, res) => {
//   const partners = await Partner.find().sort({ createdAt: -1 });
//   res.status(200).json({
//     status: "success",
//     results: partners.length,
//     data: { partners },
//   });
// });



exports.getPaginatedPartners = helper.pagination(Partner, 'url');

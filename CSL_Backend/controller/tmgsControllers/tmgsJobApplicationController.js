const TmgsJobApplication = require('../../model/tmgsModels/tmgsJobApplication.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../../controller/handlerFactory');

exports.applyForJob = catchAsync(async (req, res, next) => {
    const { jobId, name, email, contact, designation, resume } = req.body;

    // If jobId is provided, check if the user has already applied for the same job
    if (jobId) {
        const existingApplication = await TmgsJobApplication.findOne({ jobId, email });

        if (existingApplication) {
            return next(new AppError("You have already applied for this job.", 400));
        }
    }

    // Create a new job application
    const newApplication = await TmgsJobApplication.create({
        jobId,
        name,
        email,
        contact,
        designation,
        resume,
    });

    res.status(201).json({
        status: 'success',
        message: 'Job application submitted successfully!',
        data: newApplication,
    });
});

exports.getTmgsJobApplicationsPagination = helper.pagination(TmgsJobApplication, 'name', { populate: 'jobId' });

exports.updateTmgsJobApplicationStatus = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Pending", "Reviewed", "Rejected", "Accepted"].includes(status)) {
    return next(new AppError('Invalid status value!', 400));
  }

  const updatedApp = await TmgsJobApplication.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!updatedApp) {
    return next(new AppError('Application not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'Application status updated!',
    data: updatedApp,
  });
});

exports.getTmgsJobApplication = helper.getOne(TmgsJobApplication, "jobId");

exports.deleteTmgsJobApplication = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    // Find and delete the blog
    const blog = await TmgsJobApplication.findByIdAndDelete(id);

    // If the blog is not found
    if (!blog) {
        return next(new AppError("Job Application not found!", 404));
    }

    res.status(200).json({
        status: "success",
        message: "Job Application deleted successfully!",
    });
});

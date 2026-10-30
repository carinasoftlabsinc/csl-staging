const multer = require('multer');
const sharp = require('sharp');
const User = require('../model/admin.model');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const factory = require('./handlerFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('Not an image! Please upload only images.', 400), false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single('profile_image');

// exports.uploadDocuments = upload.fields([
//     { name: 'aadhar_card', maxCount: 1 },
//     { name: 'pan_card', maxCount: 1 }
// ]);

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
    if (!req.file) return next();
    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
        // .resize(500, 500)
        // .toFormat('jpeg')
        // .jpeg({ quality: 90 })
        .toFile(`public/img/users/${req.file.filename}`);

    next();
});

// exports.resizeDocuments = catchAsync(async (req, res, next) => {
//     if (!req.files) return next();

//     const promises = [];

//     Object.keys(req.files).forEach(field => {
//         const file = req.files[field][0];
//         const filename = `user-${req.user.id}-${field}-${Date.now()}.jpeg`;

//         const promise = sharp(file.buffer)
//             .resize(500, 500)
//             .toFormat('jpeg')
//             .jpeg({ quality: 90 })
//             .toFile(`public/img/${filename}`)
//             .then(() => {
//                 req.files[field][0].filename = filename;
//             })
//             .catch(err => {
//                 console.error('Error while processing image:', err);
//                 // You might want to handle the error here
//             });

//         promises.push(promise);
//     });

//     // Wait for all promises to finish
//     await Promise.all(promises);

//     console.log('Image processing promises resolved.'); // Add this line

//     next();
// });


const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    // const filteredBody = filterObj(req.body, 'name', 'email');
    
     req.body.image = req.file ? req.body.profile_image : undefined;
 
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

exports.updateData = catchAsync(async (req, res, next) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route is not for password updates. Please use /updateMyPassword.',
                400
            )
        );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const allowedFields = ['bankDetails'];
    const filteredBody = filterObj(req.body, ...allowedFields);

    // 3) Handle file uploads and store filenames
    const files = {};
    if (req.files) {
        Object.keys(req.files).forEach(field => {
            if (req.files[field][0].size > 0) {
                files[field] = req.files[field][0].filename;
            }
        });
    }
    
    // 4) Merge filteredBody and files
    const updatedData = { ...filteredBody, ...files };
    // 5) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updatedData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
        status: 'success',
        data: null
    });
});

exports.getUser = factory.getOne(User);
exports.getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
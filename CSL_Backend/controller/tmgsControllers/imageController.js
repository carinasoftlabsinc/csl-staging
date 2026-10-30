const ImageModel = require('../../model/tmgsModels/image.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const path = require('path'); 
const fs = require('fs');

const pagination = (Model, filterName, options = {}) =>
  catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || '';

    const sortField = req.query.sortField || 'uploadedAt'; // default to 'uploadedAt' for images
    const sortOrder = req.query.sortOrder?.toLowerCase() === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;
    const sortOptions = { [sortField]: sortOrder };

    let filterQuery = {};
    if (options.transformFilter) {
      const transformed = options.transformFilter(filter);
      if (filter) {
        filterQuery[filterName] = transformed;
      }
    } else if (filter) {
      filterQuery[filterName] = { $regex: filter, $options: 'i' };
    }
    

    let query = Model.find(filterQuery).sort(sortOptions).skip(skip).limit(limit);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    const [data, totalCount] = await Promise.all([
      query.exec(),
      Model.countDocuments(filterQuery),
    ]);

    res.json({
      data,
      page,
      limit,
      totalCount,
    });
  });


exports.uploadImage = catchAsync(async (req, res, next) => {
  const images = [];

  if (!req.body.image) {
    return next(new AppError('No image files uploaded!', 400));
  }

  // Handle both single image path and array of paths
  const imagePaths = Array.isArray(req.body.image) ? req.body.image : [req.body.image];

  for (const path of imagePaths) {
    const filename = path.split('/').pop();

    const imageDoc = await ImageModel.create({
      filename,
      path
    });

    images.push(imageDoc);
  }

  res.status(201).json({
    status: 'success',
    data: images,
  });
});
exports.uploadImageEditor = catchAsync(async (req, res, next) => {
  if (!req.body.image) {
    return next(new AppError('No image files uploaded!', 400));
  }

  const imagePaths = Array.isArray(req.body.image) ? req.body.image : [req.body.image];
  const filename = imagePaths[0].split('/').pop();

  await ImageModel.create({
    filename,
    path: imagePaths[0],
  });

  const host = req.get('host');
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');

  const publicUrl = isLocal
    ? `${req.protocol}://${host}${imagePaths[0]}` 
    : `https://${host}/web/web/file${imagePaths[0]}`;

  res.status(200).json({
    url: publicUrl, 
  });
});



// Get all images OR images by folder
// exports.getImages = catchAsync(async (req, res, next) => {
//   const { folder } = req.params;

//   let filter = {};

//   if (folder) {
//     filter = {
//       path: { $regex: `^/${folder}/` }
//     };
//   }

//   const images = await ImageModel.find(filter).sort({ uploadedAt: -1 }); ;

//   res.status(200).json({
//     status: 'success',
//     results: images.length,
//     data: images
//   });
// });


// Pagination-enhanced getImages API
exports.getImages = pagination(ImageModel, 'path', {
  transformFilter: (folder) => ({
    $regex: `^/${folder}/`,
    $options: 'i'
  }),
});

exports.paginatedImages = catchAsync(async (req, res, next) => {
  const { folder } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = req.query.filter || '';

  const sortField = req.query.sortField || 'uploadedAt';
  const sortOrder = req.query.sortOrder?.toLowerCase() === 'asc' ? 1 : -1;

  const skip = (page - 1) * limit;
  const sortOptions = { [sortField]: sortOrder };

  let queryFilter = {
    path: folder ? { $regex: `^/${folder}/` } : { $exists: true },
  };

  if (filter) {
    queryFilter['path'].$regex += filter; // Append filter to folder if present
    queryFilter['path'].$options = 'i';
  }

  const [data, totalCount] = await Promise.all([
    ImageModel.find(queryFilter).sort(sortOptions).skip(skip).limit(limit),
    ImageModel.countDocuments(queryFilter),
  ]);

  res.status(200).json({
    data,
    page,
    limit,
    totalCount,
  });
});


exports.getAvailableFolders = catchAsync(async (req, res, next) => {
  const publicDir = path.join(process.cwd(), 'public'); 

  if (!fs.existsSync(publicDir)) {
    return res.status(404).json({
      status: 'fail',
      message: 'Public directory not found!',
    });
  }

  // Define folders you want to exclude
  const excludedFolders = ['.git', '.DS_Store', 'node_modules', '__MACOSX', 'temp', 'system'];

  const folders = fs.readdirSync(publicDir, { withFileTypes: true })
    .filter(dirent => 
      dirent.isDirectory() &&
      !excludedFolders.includes(dirent.name) &&  
      !dirent.name.startsWith('.')                
    )
    .map(dirent => dirent.name);

  res.status(200).json({
    status: 'success',
    data: folders,
  });
});


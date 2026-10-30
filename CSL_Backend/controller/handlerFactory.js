const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const APIFeatures = require('../utills/apiFeatures');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith('image')) {
//     cb(null, true);
//   } else {
//     cb(new AppError('Not an image! Please upload only images.', 400), false);
//   }
// };

const multerFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/jpg',
     'image/gif',      
    'video/mp4',
    'video/webm',
    'video/ogg',
    'video/mov',
    'video/quicktime'
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Unsupported file type!', 400), false);
  }
};


const multerStorage = multer.memoryStorage();

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const createUploadMiddleware = (fieldName) => {
  return upload.single(fieldName);
};

const resizeImage = async (buffer, filename, folder) => {
  const filePath = `public/${folder}/${filename}`;

  if (!fs.existsSync(`public/${folder}`)) {
    fs.mkdirSync(`public/${folder}`, { recursive: true });
  }

  await sharp(buffer).toFormat('png').toFile(filePath);

  return filePath;
};

exports.uploadAndResizeImage = (fieldName, folder) => {
  return (req, res, next) => {
    const upload = createUploadMiddleware(fieldName);
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.file) return next();

      const fileExtension = 'png';
      req.file.filename = `${fieldName}-${
        req.user.id
      }-${Date.now()}.${fileExtension}`;

      try {
        await resizeImage(req.file.buffer, req.file.filename, folder);

        req.body[fieldName] = `/${folder}/${req.file.filename}`;

        next();
      } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ error: 'Error processing image' });
      }
    });
  };
};

// upload multiple images
// `limits` (optional) are multer limits for this route, e.g. a larger fieldSize for long post text.
const createMultiUploadMiddleware = (fields, limits) => {
  const uploader = limits ? multer({ storage: multerStorage, fileFilter: multerFilter, limits }) : upload;
  return uploader.fields(fields);
};

// current
// const resizeImages = async (files, folder) => {
//   const resizePromises = [];

//   // Process each file
//   files.forEach((file) => {
//     const fileExtension = 'png';
//     const filename = `${file.fieldname}-${Date.now()}.${fileExtension}`;
//     const filePath = `public/${folder}/${filename}`;

//     if (!fs.existsSync(`public/${folder}`)) {
//       fs.mkdirSync(`public/${folder}`, { recursive: true });
//     }

//     resizePromises.push(
//       sharp(file.buffer)
//         .toFormat('png')
//         .toFile(filePath)
//         .then(() => {
//           return { field: file.fieldname, path: `/${folder}/${filename}` };
//         })
//     );
//   });

//   // Wait for all images to be resized
//   return Promise.all(resizePromises);
// };

// new
// const resizeImages = async (files, folder) => {
//   const resizePromises = [];

//   // Ensure target folder exists
//   const targetDir = `public/${folder}`;
//   if (!fs.existsSync(targetDir)) {
//     fs.mkdirSync(targetDir, { recursive: true });
//   }

//   files.forEach((file) => {
//     const fileExtension = 'png';
//     const uniqueId = uuidv4(); // 💡 Generate unique identifier
//     const filename = `${file.fieldname}-${uniqueId}.${fileExtension}`;
//     const filePath = `${targetDir}/${filename}`;

//     resizePromises.push(
//       sharp(file.buffer)
//         .toFormat('png')
//         .toFile(filePath)
//         .then(() => {
//           return { field: file.fieldname, path: `/${folder}/${filename}` };
//         })
//     );
//   });

//   return Promise.all(resizePromises);
// };

const resizeImages = async (files, folder) => {
  const resizePromises = [];

  // Ensure target folder exists
  const targetDir = `public/${folder}`;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  files.forEach((file) => {
    const fileExtension = path.extname(file.originalname); // Preserve original extension
    const uniqueId = uuidv4();
    const filename = `${file.fieldname}-${uniqueId}${fileExtension}`;
    const filePath = `${targetDir}/${filename}`;

    resizePromises.push(
      fs.promises.writeFile(filePath, file.buffer).then(() => {
        return { field: file.fieldname, path: `/${folder}/${filename}` };
      })
    );
  });

  return Promise.all(resizePromises);
};

// exports.uploadAndResizeImages = (fields, folder) => {
//   return (req, res, next) => {
//     const upload = createMultiUploadMiddleware(fields);

//     upload(req, res, async (err) => {
//       if (err) {
//         return res.status(400).json({ error: err.message });
//       }

//       if (!req.files) return next();

//       try {
//         const resizedImages = await resizeImages(
//           Object.values(req.files).flat(),
//           folder
//         );

//         // resizedImages.forEach(({ field, path }) => {
//         //   req.body[field] = path;
//         // });

//         resizedImages.forEach(({ field, path }) => {
//           if (!req.body[field]) {
//             req.body[field] = fields.some(
//               (f) => f.name === field && f.maxCount > 1
//             )
//               ? [path]
//               : path;
//           } else if (Array.isArray(req.body[field])) {
//             req.body[field].push(path);
//           } else {
//             req.body[field] = [req.body[field], path];
//           }
//         });

//         next();
//       } catch (error) {
//         console.error('Error processing images:', error);
//         return res.status(500).json({ error: 'Error processing images' });
//       }
//     });
//   };
// };

exports.uploadAndResizeImages = (fields, folder, limits) => {
  return (req, res, next) => {
    const upload = createMultiUploadMiddleware(fields, limits);

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files) return next();

      try {
        const resizedImages = await resizeImages(
          Object.values(req.files).flat(),
          folder
        );

        resizedImages.forEach(({ field, path }) => {
          const fieldParts = field.split('.');

          // Handle nested fields like "ourPartners.logo"
          // if (fieldParts.length > 1) {
          //   const [mainField, subField] = fieldParts;

          //   // Ensure mainField is an array
          //   if (!Array.isArray(req.body[mainField])) {
          //     req.body[mainField] = [];
          //   }

          //   // Check if an object already exists at this index
          //   const existingPartner = req.body[mainField].find(
          //     (partner) => partner[subField]
          //   );

          //   if (existingPartner) {
          //     existingPartner[subField] = path;
          //   } else {
          //     req.body[mainField].push({ [subField]: path });
          //   }
          // }
          if (fieldParts.length > 1) {
            const [mainField, subField] = fieldParts;
          
            // If it's not an object, initialize it as an object (not array)
            if (typeof req.body[mainField] !== 'object' || Array.isArray(req.body[mainField])) {
              req.body[mainField] = {};
            }
          
            req.body[mainField][subField] = path;
          }          
          else {
            // Handle non-nested fields
            if (!req.body[field]) {
              req.body[field] = path;
            } else if (Array.isArray(req.body[field])) {
              req.body[field].push(path);
            } else {
              req.body[field] = [req.body[field], path];
            }
          }
        });

        next();
      } catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Error processing images' });
      }
    });
  };
};


// Largest size kept per case-study image field (about 2x the size shown on the website).
// Images are shrunk to fit inside these bounds, never enlarged.
const CASE_STUDY_MAX_SIZES = {
  image: [2000, 1400], // header image
  image_2: [1600, 1000], // portfolio card preview (shown 16:9)
  projectLogo: [800, 400],
  overviewImage: [800, 1200], // portrait 2:3 mockup
  uiImages: [1600, 1600],
  resultImages: [1600, 1600],
  techImages: [256, 256],
  headingIcon: [256, 256],
};
const DEFAULT_MAX_SIZE = [2000, 2000];

// Shrinks raster uploads and saves them as WebP (transparency kept). SVG and GIF are saved as uploaded.
const optimizeImages = async (files, folder) => {
  const targetDir = `public/${folder}`;
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  return Promise.all(
    files.map(async (file) => {
      const id = uuidv4();
      const keepAsIs = /^image\/(svg\+xml|gif)$/.test(file.mimetype);

      if (keepAsIs) {
        const filename = `${file.fieldname}-${id}${path.extname(file.originalname)}`;
        await fs.promises.writeFile(`${targetDir}/${filename}`, file.buffer);
        return { field: file.fieldname, path: `/${folder}/${filename}` };
      }

      const [width, height] = CASE_STUDY_MAX_SIZES[file.fieldname] || DEFAULT_MAX_SIZE;
      const filename = `${file.fieldname}-${id}.webp`;
      await sharp(file.buffer)
        .rotate() // apply the photo's EXIF orientation
        .resize({ width, height, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(`${targetDir}/${filename}`);
      return { field: file.fieldname, path: `/${folder}/${filename}` };
    })
  );
};

exports.uploadAndResizeImagesCase = (fields, folder) => {
  return (req, res, next) => {
    const upload = createMultiUploadMiddleware(fields);

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files) return next();

      try {
        const resizedImages = await optimizeImages(
          Object.values(req.files).flat(),
          folder
        );

        resizedImages.forEach(({ field, path }) => {
          const fieldParts = field.split('.');

          if (fieldParts.length > 1) {
            const [mainField, subField] = fieldParts;

            if (typeof req.body[mainField] !== 'object' || Array.isArray(req.body[mainField])) {
              req.body[mainField] = {};
            }

            req.body[mainField][subField] = path;
          } else {
            // Handling multiple file uploads for galleryImages or other arrays
            if ( field === 'resultImages' || field === 'uiImages' || field === 'techImages') {
              if (!Array.isArray(req.body[field])) {
                req.body[field] = [];
              }
              req.body[field].push(path);
            } else {
              // Default behavior for single-image fields
              req.body[field] = path;
            }
          }
        });

        next();
      } catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Error processing images' });
      }
    });
  };
};



// for games
exports.uploadAndResizeImagesGames = (fields, folder) => {
  return (req, res, next) => {
    const upload = createMultiUploadMiddleware(fields);

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files) return next();

      try {
        const resizedImages = await resizeImages(
          Object.values(req.files).flat(),
          folder
        );

        resizedImages.forEach(({ field, path }) => {
          const fieldParts = field.split('.');
        
          if (fieldParts.length > 1) {
            const [mainField, subField] = fieldParts;
        
            if (typeof req.body[mainField] !== 'object' || Array.isArray(req.body[mainField])) {
              req.body[mainField] = {};
            }
        
            req.body[mainField][subField] = path;
          } else {
            // ✅ Always treat galleryImages as an array
            if (field === 'galleryImages' || field === 'techImages' || field === 'resultImages' ) {
              if (!Array.isArray(req.body[field])) {
                req.body[field] = [];
              }
              req.body[field].push(path);
            } else {
              // Default behavior for other single-image fields
              req.body[field] = path;
            }
          }
        });
        

        next();
      } catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Error processing images' });
      }
    });
  };
};

exports.uploadAndResizeImagesWithPath = (fields, folderResolver) => {
  return (req, res, next) => {
    const upload = createMultiUploadMiddleware(fields);

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files) return next();

      const folder = typeof folderResolver === 'function' ? folderResolver(req) : folderResolver;

      try {
        const resizedImages = await resizeImages(Object.values(req.files).flat(), folder);

        resizedImages.forEach(({ field, path }) => {
          const fieldParts = field.split('.');
          if (fieldParts.length > 1) {
            const [mainField, subField] = fieldParts;
            if (typeof req.body[mainField] !== 'object' || Array.isArray(req.body[mainField])) {
              req.body[mainField] = {};
            }
            req.body[mainField][subField] = path;
          } else {
            if (!req.body[field]) {
              req.body[field] = path;
            } else if (Array.isArray(req.body[field])) {
              req.body[field].push(path);
            } else {
              req.body[field] = [req.body[field], path];
            }
          }
        });

        next();
      } catch (error) {
        console.error('Error processing images:', error);
        return res.status(500).json({ error: 'Error processing images' });
      }
    });
  };
};


exports.uploadMediaFiles = (fields, folder) => {
  return (req, res, next) => {
    const upload = createMultiUploadMiddleware(fields);

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }

      if (!req.files) return next();

      try {
        const allFiles = Object.values(req.files).flat();

        // Create folder if not exists
        const folderPath = `public/${folder}`;
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }

        for (const file of allFiles) {
          const timestamp = Date.now();
          const ext = file.mimetype.startsWith('image/') ? 'png' : path.extname(file.originalname);
          const filename = `${file.fieldname}-${req.user?.id || 'guest'}-${timestamp}${ext}`;
          const fullPath = `${folderPath}/${filename}`;
          const publicPath = `/${folder}/${filename}`;

          // Resize if image
          if (file.mimetype.startsWith('image/')) {
            await sharp(file.buffer).toFormat('png').toFile(fullPath);
          } else {
            // Write video file directly
            fs.writeFileSync(fullPath, file.buffer);
          }

          // Assign to req.body
          if (!req.body[file.fieldname]) {
            req.body[file.fieldname] = publicPath;
          } else if (Array.isArray(req.body[file.fieldname])) {
            req.body[file.fieldname].push(publicPath);
          } else {
            req.body[file.fieldname] = [req.body[file.fieldname], publicPath];
          }
        }

        next();
      } catch (error) {
        console.error('Error processing media:', error);
        return res.status(500).json({ error: 'Error processing media files' });
      }
    });
  };
};


exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { active: false },
      { new: true }
    );

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.HarddeleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

exports.getAllOr = (Model, options = {}) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    if (req.params.userId) filter = { user: req.params.userId };

    let query = Model.find(filter);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    const features = new APIFeatures(query, req.query)
      .filter()
      .sortOrder()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });


// exports.pagination = (Model, filterName) =>
//   catchAsync(async (req, res, next) => {
//     const page = parseInt(req.query.page) || 1;
//     const limit = parseInt(req.query.limit) || 10;
//     const filter = req.query.filter || '';

//     const sortField = req.query.sortField || 'createdAt';
//     const sortOrder = req.query.sortOrder
//       ? req.query.sortOrder.toLowerCase()
//       : 'desc';

//     const skip = (page - 1) * limit;
//     const sortOptions = {};
//     sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

//     const query = Model.find({
//       [filterName]: { $regex: filter, $options: 'i' },
//     })
//       .sort(sortOptions)
//       .skip(skip)
//       .limit(limit)
//       .exec();

//     await Promise.all([
//       query,
//       Model.countDocuments({
//         [filterName]: { $regex: filter, $options: 'i' },
//       }),
//     ])
//       .then(([data, totalCount]) => {
//         res.json({
//           data,
//           page,
//           limit,
//           totalCount,
//         });
//       })
//       .catch((err) => {
//         console.error('Error retrieving data:', err);
//         res.status(500).json({ error: 'An error occurred' });
//       });
//   });

exports.pagination = (Model, filterName, options = {}) =>
  catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || '';

    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder.toLowerCase()
      : 'desc';

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    let query = Model.find({
      [filterName]: { $regex: filter, $options: 'i' },
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // Apply populate dynamically if options.populate is provided
    if (options.populate) {
      query = query.populate(options.populate);
    }

    await Promise.all([
      query.exec(),
      Model.countDocuments({
        [filterName]: { $regex: filter, $options: 'i' },
      }),
    ])
      .then(([data, totalCount]) => {
        res.json({
          data,
          page,
          limit,
          totalCount,
        });
      })
      .catch((err) => {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

  exports.paginationOrder = (Model, filterName, options = {}) =>
  catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || '';

    // Default to orderIndex sorting
    const sortField = req.query.sortField || 'orderIndex';
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder.toLowerCase()
      : 'asc'; // ascending orderIndex by default

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    let query = Model.find({
      [filterName]: { $regex: filter, $options: 'i' },
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    await Promise.all([
      query.exec(),
      Model.countDocuments({
        [filterName]: { $regex: filter, $options: 'i' },
      }),
    ])
      .then(([data, totalCount]) => {
        res.json({
          data,
          page,
          limit,
          totalCount,
        });
      })
      .catch((err) => {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });

   exports.paginationOrder2 = (Model, filterName, options = {}) =>
  catchAsync(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const filter = req.query.filter || '';

    // Default to orderIndex sorting
    const sortField = req.query.sortField || 'orderId';
    const sortOrder = req.query.sortOrder
      ? req.query.sortOrder.toLowerCase()
      : 'asc'; // ascending orderIndex by default

    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortField] = sortOrder === 'desc' ? -1 : 1;

    let query = Model.find({
      [filterName]: { $regex: filter, $options: 'i' },
    })
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    if (options.populate) {
      query = query.populate(options.populate);
    }

    await Promise.all([
      query.exec(),
      Model.countDocuments({
        [filterName]: { $regex: filter, $options: 'i' },
      }),
    ])
      .then(([data, totalCount]) => {
        res.json({
          data,
          page,
          limit,
          totalCount,
        });
      })
      .catch((err) => {
        console.error('Error retrieving data:', err);
        res.status(500).json({ error: 'An error occurred' });
      });
  });
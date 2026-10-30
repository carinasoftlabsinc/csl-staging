const multer = require('multer');
const catchAsync = require('../utills/catchAsync');
const AppError = require('../utills/appError');
const { saveImage, MAX_INPUT_BYTES } = require('../utills/contentImages');

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_INPUT_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
    else cb(new AppError('Only JPG, PNG, WebP, GIF or AVIF images can be uploaded.', 400), false);
  },
});

// Reads the editor's upload (form field "file", the name angular-editor uses).
exports.readImage = (req, res, next) => {
  upload.single('file')(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
      return next(new AppError(`The image is larger than ${MAX_INPUT_BYTES / 1024 / 1024} MB.`, 400));
    }
    return next(err instanceof AppError ? err : new AppError(err.message, 400));
  });
};

// Saves an image picked or pasted in a post editor and returns its URL ({ imageUrl } is what angular-editor reads).
exports.uploadContentImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next(new AppError('No image was sent.', 400));

  let saved;
  try {
    saved = await saveImage(req.file.buffer);
  } catch (err) {
    return next(new AppError(`The image could not be saved: ${err.message}`, 400));
  }

  res.status(201).json({
    status: 'success',
    imageUrl: saved.url,
    width: saved.width,
    height: saved.height,
  });
});

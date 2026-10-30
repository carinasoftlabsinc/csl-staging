const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Resume file filter (only PDF, DOC, DOCX)
const resumeFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed!'), false);
  }
};

// Multer memory storage
const resumeStorage = multer.memoryStorage();

// Upload middleware
const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
}).single('resume');

// Middleware to handle resume upload
exports.uploadResumeMiddleware = (req, res, next) => {
  uploadResume(req, res, (err) => {
    if (err) {
      return res.status(400).json({ error: err.message });
    }

    if (!req.file) return next(); // No file uploaded, move to next middleware

    // Define resume filename with timestamp
    const ext = path.extname(req.file.originalname); // Get file extension
    const resumeFilename = `resume-${Date.now()}${ext}`;

    const folderPath = path.join(__dirname, '../public/tmgsJobApplications');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const filePath = path.join(folderPath, resumeFilename);

    // Save the file
    fs.writeFileSync(filePath, req.file.buffer);

    // Attach filename to request body
    req.body.resume = `/tmgsJobApplications/${resumeFilename}`;

    next(); // Proceed to the next function (applyForJob)
  });
};

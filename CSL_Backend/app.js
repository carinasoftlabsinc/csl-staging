const path = require('path');
const fs = require('fs')
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');

const AppError = require('./utills/appError');
const GlobalError = require('./utills/errorController');
require('dotenv').config();
// Routes
const AdminRoutes = require("./routes/AdminRoutes");
// const contactRoutes = require("./userController/main.Router");

// Start express app
const app = express();

app.enable('trust proxy');


app.use(cors());

app.options('*', cors());

app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    next();
});


const PUBLIC_DIR = path.resolve(__dirname, 'public');
const { createBlogCardHandler } = require('./utills/blogCardImages');
app.get('/web/file/blog-card/:filename', createBlogCardHandler(path.join(PUBLIC_DIR, 'blog'), path.join(PUBLIC_DIR, 'blog-card')));

// A folder or file name must be a single plain name: no slashes, no "." or "..", no hidden files.
const isSafeSegment = (segment) =>
  typeof segment === 'string' &&
  segment.length > 0 &&
  segment !== '.' &&
  segment !== '..' &&
  !segment.startsWith('.') &&
  !/[\\/\0]/.test(segment);

app.get("/web/file/:folder/:filename", (req, res) => {
    const { folder, filename } = req.params;

    if (!isSafeSegment(folder) || !isSafeSegment(filename)) {
      return res.status(404).json({ error: "File not found" });
    }

    const filePath = path.resolve(PUBLIC_DIR, folder, filename);

    // The resolved path must stay inside the public folder.
    if (!filePath.startsWith(PUBLIC_DIR + path.sep)) {
      return res.status(404).json({ error: "File not found" });
    }

    res.sendFile(filePath, { dotfiles: 'deny' }, (err) => {
      if (!err) return;
      // The browser cancelled the download (page change, reload) or part of the file was already sent:
      // there is nothing left to answer. Sending a 404 now would throw and crash the server.
      if (res.headersSent || err.code === 'ECONNABORTED') return;
      console.error("File not found:", err.message);
      res.status(404).json({ error: "File not found" });
    });
  });

app.use(helmet());

// Development logging
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production') {
    app.use(morgan('dev'));
}


// Body parser, reading data from body into req.body
app.use(express.json({limit: '200mb'}));
app.use(express.urlencoded({ extended: true, limit:'200mb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

app.use(compression());

// Test middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.cookies);
    next();
});


// 3) ROUTES
app.use('/web/v1', 
// contactRoutes,
AdminRoutes);

app.get('/web/v1/versionChecker', (req, res) => {
  const clientVersion = req.query.version;
  const serverVersion = process.env.VERSION;

  if (!clientVersion) {
      return res.status(400).json({
          success: false,
          message: 'Version is required.',
      });
  }

  const isMatch = clientVersion === serverVersion;

  res.json({
      isMatch,
      message: isMatch ? 'Version matched.' : `Version mismatch.`,
  });
});

app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalError);

module.exports = app;

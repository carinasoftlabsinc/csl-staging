const HomePage = require('../../model/tmgsModels/homepage.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../handlerFactory');

exports.createHomePage = catchAsync(async (req, res, next) => {

  req.body = convertDotNotationToNestedObject(req.body);

  // Check if data already exists
  const existingData = await HomePage.findOne();
  if (existingData) {
    return next(new AppError('Homepage data already exists!', 400));
  }

  // Instead of overwriting, check if req.body.about exists.
  // If it's an array (which might happen if keys are misconfigured), log a warning.
  if (Array.isArray(req.body.about)) {
    console.warn("Received about as an array; please send as an object using dot notation keys.");
    // Optionally, you could merge the fields instead of overwriting.
    req.body.about = Object.assign({}, ...req.body.about);
  }
  
  if (Array.isArray(req.body.cta)) {
    console.warn("Received cta as an array; converting to object.");
    req.body.cta = Object.assign({}, ...req.body.cta);
  }

  if (Array.isArray(req.body.visitedEvents)) {
    console.warn("Received visitedEvents as an array; converting to object.");
    req.body.visitedEvents = Object.assign({}, ...req.body.visitedEvents);
    // Ensure eventImages is still an array.
    if (req.body.visitedEvents.eventImages && !Array.isArray(req.body.visitedEvents.eventImages)) {
      req.body.visitedEvents.eventImages = [req.body.visitedEvents.eventImages];
    }
  }

  // Validate required fields in nested objects
  const { cta, visitedEvents, about } = req.body;
  if (!cta || !cta.heading || !visitedEvents || !visitedEvents.heading || !about || !about.heading) {
    return next(new AppError('Required fields are missing!', 400));
  }

  // Parse about.points if it exists and is a string
  if (about.points && typeof about.points === 'string') {
    try {
      req.body.about.points = JSON.parse(about.points);
    } catch (error) {
      return next(new AppError('Invalid JSON format in about.points', 400));
    }
  }

  if (Array.isArray(req.body.about)) {
  req.body.about = {
    heading: req.body.about[0]?.heading || 'Default About Heading',
    cardBackgroundImage: req.body.about[0]?.cardBackgroundImage,
  };
}


  // // Ensure about.points is an array; if undefined, default to an empty array
  // if (!Array.isArray(req.body.about.points)) {
  //   req.body.about.points = [];
  // } else {
  //   // Optionally, map over the points to set defaults if necessary
  //   req.body.about.points = req.body.about.points.map((point) => ({
  //     pointHeading: point.pointHeading || 'Default Heading',
  //     pointDescription: point.pointDescription || 'Default Description'
  //   }));
  // }

  

  // Parse other JSON fields if needed
  req.body.heroSection.mainTopics = parseField(req.body.heroSection.mainTopics);
  req.body.visitedEvents.eventImages = parseField(req.body.visitedEvents.eventImages);
  // req.body.ourPartners = parseField(req.body.ourPartners);

  // Create document
  const newHomePage = await HomePage.create(req.body);
  res.status(201).json({
    status: 'success',
    data: { homepage: newHomePage },
  });
});

exports.updateHomePage = catchAsync(async (req, res, next) => {

  req.body = convertDotNotationToNestedObject(req.body);

  // Merge arrays if file upload keys introduced them
  if (Array.isArray(req.body.about)) {
    console.warn("Received about as an array; converting to object.");
    req.body.about = Object.assign({}, ...req.body.about);
  }
  if (Array.isArray(req.body.cta)) {
    console.warn("Received cta as an array; converting to object.");
    req.body.cta = Object.assign({}, ...req.body.cta);
  }
  if (Array.isArray(req.body.visitedEvents)) {
    console.warn("Received visitedEvents as an array; converting to object.");
    req.body.visitedEvents = Object.assign({}, ...req.body.visitedEvents);
    // Ensure eventImages is still an array.
    if (
      req.body.visitedEvents.eventImages &&
      !Array.isArray(req.body.visitedEvents.eventImages)
    ) {
      req.body.visitedEvents.eventImages = [req.body.visitedEvents.eventImages];
    }
  }

  // Parse about.points if it exists and is a string
  if (
    req.body.about &&
    req.body.about.points &&
    typeof req.body.about.points === "string"
  ) {
    try {
      req.body.about.points = JSON.parse(req.body.about.points);
    } catch (error) {
      return next(new AppError("Invalid JSON format in about.points", 400));
    }
  }

  // Parse other JSON fields if needed
  req.body.heroSection.mainTopics = parseField(req.body.heroSection.mainTopics);
  req.body.visitedEvents.eventImages = parseField(
    req.body.visitedEvents.eventImages
  );

  // Find the existing homepage document
  let homePageDoc = await HomePage.findOne();
  if (!homePageDoc) {
    return next(new AppError("Homepage data not found", 404));
  }

  // Update the document using findByIdAndUpdate to apply validators and return the updated doc
  homePageDoc = await HomePage.findByIdAndUpdate(homePageDoc._id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: { homepage: homePageDoc },
  });
});

exports.deleteHomePage = catchAsync(async (req, res, next) => {
  // Find the existing homepage document
  const homePageDoc = await HomePage.findOne();
  if (!homePageDoc) {
    return next(new AppError("Homepage data not found", 404));
  }

  // Delete the document
  await HomePage.findByIdAndDelete(homePageDoc._id);

  res.status(200).json({
    status: "success",
    message: "Homepage data deleted successfully",
  });
});


exports.getPaginatedHome = helper.pagination(HomePage, 'heroSection.heading');

exports.getHomePage = catchAsync(async (req, res, next) => {
  // Find the HomePage document. Assuming only one document exists.
  const homePageDoc = await HomePage.findOne();
  
  if (!homePageDoc) {
    return next(new AppError("Homepage data not found", 404));
  }
  
  res.status(200).json({
    status: "success",
    data: { homepage: homePageDoc },
  });
});


// function convertDotNotationToNestedObject(obj) {
//   const result = {};
//   Object.keys(obj).forEach((key) => {
//     const parts = key.split('.');
//     let current = result;
//     parts.forEach((part, index) => {
//       if (index === parts.length - 1) {
//         current[part] = obj[key];
//       } else {
//         if (!current[part]) {
//           current[part] = {};
//         }
//         current = current[part];
//       }
//     });
//   });
//   return result;
// }

function convertDotNotationToNestedObject(obj) {
  const result = {};
  Object.keys(obj).forEach(key => {
    const keys = key.split('.');
    keys.reduce((acc, currentKey, index) => {
      if (index === keys.length - 1) {
        acc[currentKey] = obj[key];
      } else {
        if (!acc[currentKey]) {
          acc[currentKey] = {};
        }
      }
      return acc[currentKey];
    }, result);
  });
  return result;
}


// Helper Function to Parse JSON Safely
const parseField = (field) => {
  try {
    return typeof field === 'string' ? JSON.parse(field) : field;
  } catch (error) {
    console.warn('Invalid JSON format:', field);
    return field; // Return as-is if JSON.parse fails
  }
};

const Platform = require('../../model/tmgsModels/platform.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const Game = require('../../model/tmgsModels/game.model');


exports.createPlatform = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new AppError('Platform name is required!', 400));
  }

  const existingPlatform = await Platform.findOne({ name });
  if (existingPlatform) {
    return next(new AppError('This platform already exists!', 400));
  }

  const platform = await Platform.create({ name });

  res.status(201).json({
    status: 'success',
    data: { platform },
  });
});

exports.getAllPlatforms = catchAsync(async (req, res) => {
  const platforms = await Platform.find().sort({ createdAt: -1 });
  res.status(200).json({
    status: 'success',
    results: platforms.length,
    data: { platforms },
  });
});


// exports.getPlatformsWithGames = catchAsync(async (req, res) => {
//   const platformIds = await Game.distinct('platforms', { platforms: { $exists: true, $ne: [] } });

//     const platforms = await Platform.find({ _id: { $in: platformIds } });

//   res.status(200).json({
//     status: 'success',
//     results: platforms.length,
//     data: { platforms },
//   });
// });

exports.getPlatformsWithGames = catchAsync(async (req, res) => {
  // Step 1: Get all games with platforms
  const gamesWithPlatforms = await Game.find(
    { 'platforms.0': { $exists: true } }, // only games with at least one platform
    { 'platforms.name': 1 } // only project the platform names
  );

  // Step 2: Extract all platform names
  const platformNamesSet = new Set();
  gamesWithPlatforms.forEach(game => {
    game.platforms.forEach(platform => {
      if (platform.name) platformNamesSet.add(platform.name);
    });
  });

  const platformNames = [...platformNamesSet];

  // Step 3: Find platforms in the Platform collection with matching names
  const platforms = await Platform.find({ name: { $in: platformNames } });

  res.status(200).json({
    status: 'success',
    results: platforms.length,
    data: { platforms },
  });
});



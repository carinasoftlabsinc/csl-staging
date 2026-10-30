const Game = require('../../model/tmgsModels/game.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../handlerFactory');
const he = require('he');


// exports.createGame = catchAsync(async (req, res, next) => {
//   const body = req.body;
//   // 🚫 Validate galleryImages length
//   if (req.files?.galleryImages?.length > 10) {
//     return next(new AppError('You can upload a maximum of 10 gallery images.', 400));
//   }
  
//   const existingGame = await Game.findOne({ name: body.name });
//   if (existingGame) {
//     return next(new AppError('This game already exists!', 401));
//   }

//   // Parse JSON inputs from Postman
//   body.keywords = JSON.parse(body.keywords);
//   body.platforms = JSON.parse(body.platforms);
//   body.socialLinks = JSON.parse(body.socialLinks);

//   body.content = he.decode(body.content);

//   // Create the game
//   const newGame = await Game.create(body);

//   res.status(201).json({
//     status: 'success',
//     data: { game: newGame },
//   });
// });

exports.createGame = catchAsync(async (req, res, next) => {
  const body = req.body;

  // 🚫 Validate galleryImages length
  if (req.files?.galleryImages?.length > 10) {
    return next(new AppError('You can upload a maximum of 10 gallery images.', 400));
  }

  const existingGame = await Game.findOne({ name: body.name });
  if (existingGame) {
    return next(new AppError('This game already exists!', 401));
  }

  // ✅ Parse JSON fields if they exist
  ['keywords', 'platforms', 'socialLinks', 'keytasks', 'goals', 'workSteps'].forEach((field) => {
    if (body[field]) {
      try {
        body[field] = JSON.parse(body[field]);
      } catch (e) {
        return next(new AppError(`Invalid JSON format in ${field}`, 400));
      }
    }
  });

  // ✅ Decode HTML content if provided
  if (body.content) {
    body.content = he.decode(body.content);
  }

  const newGame = await Game.create(body);

  res.status(201).json({
    status: 'success',
    data: { game: newGame },
  });
});


exports.updateGame = catchAsync(async (req, res, next) => {
  try {
    const { id } = req.params;
    let body = req.body;

    if (req.files?.galleryImages?.length > 10) {
      return next(new AppError('You can upload a maximum of 10 gallery images.', 400));
    }

    const game = await Game.findById(id);
    if (!game) {
      return next(new AppError('Game not found!', 404));
    }

    // 🚫 Prevent duplicate name
    if (body.name && body.name !== game.name) {
      const existingGame = await Game.findOne({ name: body.name });
      if (existingGame) {
        return next(new AppError('This game name is already in use!', 400));
      }
    }

    // ✅ Parse JSON fields safely
    ['keywords', 'platforms', 'socialLinks', 'keytasks', 'goals', 'workSteps'].forEach((field) => {
      if (body[field]) {
        try {
          body[field] = JSON.parse(body[field]);
        } catch (error) {
          return next(new AppError(`Invalid JSON format in ${field}`, 400));
        }
      }
    });

    if (body.content) {
      body.content = he.decode(body.content);
    }

    const updatedGame = await Game.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: { game: updatedGame },
    });
  } catch (error) {
    next(error);
  }
});


// exports.getAllGames = catchAsync(async (req, res) => {
//   const games = await Game.find().populate('platforms').sort({ createdAt: -1 });
//   res.status(200).json({
//     status: 'success',
//     results: games.length,
//     data: { games },
//   });
// });

exports.getAllGames = catchAsync(async (req, res) => {
  const games = await Game.find()
    .populate('platforms')
    .sort({ orderId: 1 }); // sort by orderId

  res.status(200).json({
    status: 'success',
    results: games.length,
    data: { games },
  });
});

exports.getGameNames = catchAsync(async (req, res) => {
  const games = await Game.find({}, '_id name orderId').sort({ orderId: 1 });

  res.status(200).json({
    status: 'success',
    results: games.length,
    data: { games },
  });
});


exports.updateGameOrder = catchAsync(async (req, res) => {
  const updates = req.body.orders; // Expecting [{ gameId: '...', orderId: 1 }, ...]

  if (!Array.isArray(updates)) {
    return res.status(400).json({ status: 'fail', message: 'Invalid format' });
  }

  const bulkOps = updates.map(({ gameId, orderId }) => ({
    updateOne: {
      filter: { _id: gameId },
      update: { orderId },
    },
  }));

  await Game.bulkWrite(bulkOps);

  res.status(200).json({ status: 'success', message: 'Order updated successfully' });
});



// exports.getAllGa = helper.getAll(Game);

exports.getPaginatedGames = helper.paginationOrder2(Game, 'name', {
  populate: 'platforms',
});

exports.getGameById = catchAsync(async (req, res, next) => {
  const game = await Game.findById(req.params.id);
  if (!game) {
    return next(new AppError('Game not found!', 404));
  }
  res.status(200).json({
    status: 'success',
    data: { game },
  });
});

// exports.updateGame = catchAsync(async (req, res, next) => {
//   const game = await Game.findByIdAndUpdate(req.params.id, req.body, { new: true });
//   if (!game) {
//     return next(new AppError('Game not found!', 404));
//   }
//   res.status(200).json({
//     status: 'success',
//     data: { game }
//   });
// });

// exports.updateGame = catchAsync(async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     let body = req.body;

//   // 🚫 Validate galleryImages length
//   if (req.files?.galleryImages?.length > 10) {
//     return next(new AppError('You can upload a maximum of 10 gallery images.', 400));
//   }
//     const game = await Game.findById(id);
//     if (!game) {
//       return next(new AppError('Game not found!', 404));
//     }

//     // Prevent updating to an existing game name
//     if (body.name && body.name !== game.name) {
//       const existingGame = await Game.findOne({ name: body.name });
//       if (existingGame) {
//         return next(new AppError('This game name is already in use!', 400));
//       }
//     }

//     // Parse JSON inputs safely
//     ['keywords', 'platforms', 'socialLinks'].forEach((field) => {
//       if (body[field]) {
//         try {
//           body[field] = JSON.parse(body[field]);
//         } catch (error) {
//           return next(new AppError(`Invalid JSON format in ${field}`, 400));
//         }
//       }
//     });

//     // Update game details efficiently
//     const updatedGame = await Game.findByIdAndUpdate(id, body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       status: 'success',
//       data: { game: updatedGame },
//     });
//   } catch (error) {
//     next(error);
//   }
// });

exports.deleteGame = catchAsync(async (req, res, next) => {
  const game = await Game.findByIdAndDelete(req.params.id);
  if (!game) {
    return next(new AppError('Game not found!', 404));
  }

  res.status(200).json({
    // Changed from 204 to 200
    status: 'success',
    message: 'Game deleted successfully',
    // data: { id: req.params.id },  // Optional: Include deleted game's ID
  });
});

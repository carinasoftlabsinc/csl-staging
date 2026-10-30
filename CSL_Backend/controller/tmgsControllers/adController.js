const Ad = require('../../model/tmgsModels/ad.model');
const catchAsync = require('../../utills/catchAsync');
const AppError = require('../../utills/appError');
const helper = require('../handlerFactory');
const moment = require('moment');

// GET + INCREMENT Ad Play Count
exports.playAd = async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id);
      if (!ad || !ad.active) {
        return res.status(404).json({ status: 'fail', message: 'Ad not found or inactive' });
      }
  
      // Increment play count
      ad.playCount += 1;
      await ad.save();
  
      res.status(200).json({ status: 'success', data: ad });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };

  
  // POST /ads/:adId/platforms/:platformIndex/click
// exports.trackPlatformClick = async (req, res) => {
//     try {
//       const { adId, platformIndex } = req.params;
//       const ad = await Ad.findById(adId);
//       if (!ad) return res.status(404).json({ status: 'fail', message: 'Ad not found' });
  
//       const index = parseInt(platformIndex);
//       if (!ad.platforms[index]) {
//         return res.status(400).json({ status: 'fail', message: 'Invalid platform index' });
//       }
  
//       ad.platforms[index].clicks += 1;
//       await ad.save();
  
//       res.status(200).json({
//         status: 'success',
//         clicks: ad.platforms[index].clicks,
//         platform: ad.platforms[index]
//       });
//     } catch (err) {
//       res.status(500).json({ status: 'error', message: err.message });
//     }
//   };
  
exports.trackPlatformClick = catchAsync(async (req, res, next) => {
  const { adId, platformId } = req.params;

  const ad = await Ad.findById(adId);
  if (!ad) return next(new AppError('Ad not found.', 404));

  const platform = ad.platforms.id(platformId); // assuming platforms is a subdocument array
  if (!platform) return next(new AppError('Platform not found.', 404));

  platform.clicks = (platform.clicks || 0) + 1;
  await ad.save();

  res.status(200).json({ status: 'success', message: 'Click tracked.' });
});


  // Create Ad
exports.createAd = async (req, res) => {
    try {
      const {
        name,
        orientation,
        videoUrl,
        duration,
        active,
        viewThreshold,
        platforms
      } = req.body;
  
        console.log(req.body);
        
      const newAd = await Ad.create({
        name,
        orientation,
        image: req.body.image,
        videoFile: req.body.videoFile,
        videoUrl,
        duration,
        active: active ?? false,
        viewThreshold: viewThreshold ?? 7,
        platforms: platforms ? JSON.parse(platforms) : []
      });
  
      res.status(201).json({ status: 'success', data: newAd });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };
  
  // Get All Ads
  exports.getAllAds = async (req, res) => {
    try {
      const ads = await Ad.find();
      res.status(200).json({ status: 'success', results: ads.length, data: ads });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };
  
  // Get Only Active Ads
exports.getActiveAds = async (req, res) => {
  try {
    const activeAds = await Ad.find({ active: true });
    res.status(200).json({
      status: 'success',
      results: activeAds.length,
      data: activeAds,
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
};


  exports.getPaginatedAds = helper.pagination(Ad, 'name');

  // Get Single Ad
  exports.getAd = async (req, res) => {
    try {
      const ad = await Ad.findById(req.params.id);
      if (!ad) return res.status(404).json({ message: 'Ad not found' });
  
      res.status(200).json({ status: 'success', data: ad });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };
  
  // Update Ad
  exports.updateAd = async (req, res) => {
    try {
      const data = {
        ...req.body,
        platforms: req.body.platforms ? JSON.parse(req.body.platforms) : undefined
      };
  
      const updatedAd = await Ad.findByIdAndUpdate(req.params.id, data, {
        new: true,
        runValidators: true
      });
  
      if (!updatedAd) return res.status(404).json({ message: 'Ad not found' });
  
      res.status(200).json({ status: 'success', data: updatedAd });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };
  
  // Delete Ad
  exports.deleteAd = async (req, res) => {
    try {
      const deletedAd = await Ad.findByIdAndDelete(req.params.id);
      if (!deletedAd) {
        return res.status(404).json({ message: 'Ad not found' });
      }
  
      res.status(200).json({
        status: 'success',
        message: 'Ad deleted successfully',
        // data: deletedAd, // optional
      });
    } catch (err) {
      res.status(400).json({ status: 'fail', message: err.message });
    }
  };
  
  
  // Check if ad should play (based on viewThreshold)
  exports.shouldPlayAd = async (req, res) => {
    try {
      const { id } = req.params;
      const { gamePlayCount } = req.query;
  
      const ad = await Ad.findById(id);
      if (!ad || !ad.active) {
        return res.status(404).json({ status: 'fail', message: 'Ad not found or inactive' });
      }
  
      const shouldPlay = parseInt(gamePlayCount) >= ad.viewThreshold;
  
      res.status(200).json({
        status: 'success',
        shouldPlay,
        threshold: ad.viewThreshold
      });
    } catch (err) {
      res.status(500).json({ status: 'error', message: err.message });
    }
  };
  

  exports.updateAdStatus = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { active } = req.body;
  
    if (typeof active !== 'boolean') {
      return next(new AppError('Active field must be a boolean value.', 400));
    }
  
    const updatedAd = await Ad.findByIdAndUpdate(
      id,
      { active },
      { new: true, runValidators: true }
    );
  
    if (!updatedAd) {
      return next(new AppError('No ad found with that ID', 404));
    }
  
    res.status(200).json({
      status: 'success',
      data: updatedAd,
    });
  });
  

  // Get Analytics for All Ads
// exports.getAdsAnalytics = async (req, res) => {
//   try {
//     const ads = await Ad.find({}, 'name playCount platforms');

//     const analytics = ads.map((ad) => ({
//       adId: ad._id,
//       name: ad.name,
//       playCount: ad.playCount,
//       platformClicks: ad.platforms.map((p) => ({
//         platform: p.name,
//         clicks: p.clicks,
//       })),
//     }));

//     res.status(200).json({
//       status: 'success',
//       results: analytics.length,
//       data: analytics,
//     });
//   } catch (err) {
//     res.status(500).json({
//       status: 'fail',
//       message: err.message,
//     });
//   }
// };


exports.getAdsAnalytics = async (req, res) => {
  try {
    const { range } = req.query; // 'monthly' or 'weekly'
    const filter = {};

    // If you have a timestamp field like createdAt or updatedAt
    if (range === 'monthly') {
      filter.createdAt = {
        $gte: moment().startOf('month').toDate(),
        $lte: moment().endOf('month').toDate()
      };
    } else if (range === 'weekly') {
      filter.createdAt = {
        $gte: moment().startOf('week').toDate(),
        $lte: moment().endOf('week').toDate()
      };
    }

    const ads = await Ad.find(filter, 'name playCount platforms createdAt');

    const analytics = ads.map((ad) => ({
      adId: ad._id,
      name: ad.name,
      playCount: ad.playCount,
      platformClicks: ad.platforms.map((p) => ({
        platform: p.name,
        clicks: p.clicks,
      })),
    }));

    res.status(200).json({
      status: 'success',
      range: range || 'all',
      results: analytics.length,
      data: analytics,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

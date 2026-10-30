const Blog = require('../model/blog.model');
const Career = require('../model/career.model');
const NewsRoom = require('../model/newsRoom.model');
const CaseStudy = require('../model/caseStudy.model');

const Game = require('../model/tmgsModels/game.model');
const tmgsBlog = require('../model/tmgsModels/tmgsBlog.model');
const TmgsCareer = require('../model/tmgsModels/tmgsCareer.model');
const Ad = require('../model/tmgsModels/ad.model');

exports.getAnalyticsCounts = async (req, res) => {
  try {
    const [blogCount, careerCount, newsCount, caseStudyCount] = await Promise.all([
      Blog.countDocuments(),
      Career.countDocuments(),
      NewsRoom.countDocuments(),
      CaseStudy.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalBlogs: blogCount,
        totalCareers: careerCount,
        totalNews: newsCount,
        totalCaseStudies: caseStudyCount,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};



exports.getTmgsAnalyticsCounts = async (req, res) => {
  try {
    const [gameCount, blogCount, careerCount, adCount] = await Promise.all([
      Game.countDocuments(),
      tmgsBlog.countDocuments(),
      TmgsCareer.countDocuments(),
      Ad.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalGames: gameCount,
        totalBlogs: blogCount,
        totalCareers: careerCount,
        totalAds: adCount,
      },
    });
  } catch (error) {
    console.error('Error fetching analytics counts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics data',
    });
  }
};

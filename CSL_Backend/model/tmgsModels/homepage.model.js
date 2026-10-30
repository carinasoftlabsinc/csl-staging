const mongoose = require('mongoose');

const HomePageSchema = new mongoose.Schema({
  heroSection: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    mainTopics: [{ type: String }], // Array of main topics
    description: { type: String },
  },
  // ourPartners: [
  //   {
  //     logo: { type: String, required: true }, // Image URL or file path
  //     link: { type: String, required: true }
  //   }
  // ],
  about: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
    experience: { type: String }, // Years of experience
    points: [
      {
        pointHeading: { type: String, required: true },
        pointDescription: { type: String },
      },
    ],
  },
  aboutCardBackgroundImage: { type: String },
  games: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
  },
  ourTeam: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
    statistics: {
      uniqueDailyUsers: { type: String, default: '5000+' },
      downloads: { type: String, default: '50K' },
      gamesLaunched: { type: String, default: '8+' },
      upcomingGames: { type: String, default: '10' },
    },
  },
  visitedEvents: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
    joinHeading: { type: String },
    joinDescription: { type: String },
  },
  eventImages: [{ type: String }],  // Array of image URLs (max 5)
  career: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
  },
  cta: {
    heading: { type: String, required: true },
    subHeading: { type: String },
    description: { type: String },
  },
  ctaImage: { type: String }, // Image URL or file path
});

const HomePage = mongoose.model('HomePage', HomePageSchema);
module.exports = HomePage;

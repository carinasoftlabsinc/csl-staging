const express = require('express');
const adminRouter = require('./admin/admin.router');
const blogRouter = require('./admin/blog.router');
const newsRouter = require('./admin/news.router');
const contactRouter = require('./admin/contact.router');
const projectRouter = require('./admin/caseStudy.router');
const gameRouter = require('./admin/tmgsRoutes/game.router');
const platformRouter = require('./admin/tmgsRoutes/platform.router');
const socialLinksRouter = require('./admin/tmgsRoutes/socialLinks.router');
const homePageRouter = require('./admin/tmgsRoutes/homePage.router');
const partnersRouter = require('./admin/tmgsRoutes/partners.router');
const teamRouter = require('./admin/tmgsRoutes/team.router');
const categoryRouter = require('./category.routes');
const tmgsblogRoutes = require('./admin/tmgsRoutes/tmgsBlogRoutes');
const tmgsCareerRoutes = require('./admin/tmgsRoutes/tmgsCareerRoutes');
const tmgsJobApplicationRoutes = require('./admin/tmgsRoutes/tmgsJobApplicationRoutes');
const tmgsContactUsRoutes = require('./admin/tmgsRoutes/tmgsContactUsRoutes');
const tmgsTermPolicyRoutes = require('./admin/tmgsRoutes/tmgsTermPolicyRoutes');
const adRoutes = require('./admin/tmgsRoutes/ad.router');
const imageRouter = require('./admin/tmgsRoutes/image.router');
const careerRouter = require('./admin/career.router');
const jobApplicationRoutes = require('./admin/jobApplicationRoutes');
const analyticsRouter = require('./admin/analytics.router');
const contentImageRouter = require('./admin/contentImage.router');

const router = express.Router();

router.use(
  '/admin',
  adminRouter,
  blogRouter,
  newsRouter,
  contactRouter,
  projectRouter,
  gameRouter,
  platformRouter,
  socialLinksRouter,
  homePageRouter,
  partnersRouter,
  teamRouter,
  categoryRouter,
  tmgsblogRoutes,
  tmgsCareerRoutes,
  tmgsJobApplicationRoutes,
  tmgsContactUsRoutes,
  tmgsTermPolicyRoutes,
  adRoutes,
  imageRouter,
  careerRouter,
  jobApplicationRoutes,
  analyticsRouter,
  contentImageRouter
);

module.exports = router;

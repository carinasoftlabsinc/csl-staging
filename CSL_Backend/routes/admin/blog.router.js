const express = require('express');
const blogController = require('../../controller/blogController');
const helper = require('../../controller/handlerFactory');
const authController = require('../../controller/AuthController');
const path = require('path');
const { generateUploadedBlogCard } = require('../../utills/blogCardImages');
const generateCard = generateUploadedBlogCard(path.join(__dirname, '../../public/blog-card'));

const router = express.Router();

router.post(
  '/create_blog',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 }
    ],
    'blog'
  ),
  generateCard,
  blogController.createBlog
);

router.post(
  '/update_blog/:id',
  authController.protect,
  helper.uploadAndResizeImages(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 }
    ],
    'blog'
  ),
  generateCard,
  blogController.updateBlog
);

// Full blog save from the admin's blog page: details, covers, sections and FAQs in one request.
// Sections and FAQs are sent as JSON text, so the text field limit is raised to 20 MB.
const fullBlogUpload = helper.uploadAndResizeImages(
  [
    { name: 'image', maxCount: 1 },
    { name: 'image_2', maxCount: 1 }
  ],
  'blog',
  { fieldSize: 20 * 1024 * 1024 }
);

router.post('/create_blog_full', authController.protect, fullBlogUpload, generateCard, blogController.createBlogFull);

router.post('/update_blog_full/:id', authController.protect, fullBlogUpload, generateCard, blogController.updateBlogFull);

router.post(
  '/delete_blog/:id',
  authController.protect,
  blogController.deleteBlog
);

router.post(
    '/add_sections/:id',
    authController.protect,
    blogController.addSection
  );
  
  router.post(
    '/update_blog_section/:_id/:sectionId',
    authController.protect,
    blogController.updateBlogSection
  );

  router.get(
    '/get_blog_section/:blogId/:sectionId',
    authController.protect,
    blogController.getBlogSections
  );

  router.post(
    '/delete_blog_section/:_id/:sectionId',
    authController.protect,
    blogController.deleteSection
  );



router.get('/get_blog/:id', blogController.getOne);
router.get('/getAll_blog', blogController.getAll);
router.get(
  '/blog_pagination',
  authController.protect,
  blogController.pagination
);

router.get('/getAll_blogTitles', blogController.getAllBlogTitles);

router.post('/reorder-blogs', authController.protect, blogController.updateBlogOrderIndex);

router.get('/init-blog-order', authController.protect, authController.restrictTo('SuperAdmin'), blogController.initializeBlogOrder);

router.get('/getBlogTitlesWithOrder', blogController.getBlogTitlesWithOrder);

router.patch('/updateCslBlogOrder', authController.protect, blogController.updateCslBlogOrder);


router.post("/faq/:id",authController.protect, blogController.addFaq);
router.get("/faq/:blogId/:faqId",authController.protect, blogController.getFaq);
router.put("/faq/:blogId/:faqId",authController.protect, blogController.updateFaq);
router.delete("/faq/:blogId/:faqId",authController.protect, blogController.deleteFaq);

router.get('/getLatestBlogs', blogController.getLatestBlogs);

module.exports = router;

const express = require('express');
const Controller = require('../../controller/caseStudyController');
const helper = require('../../controller/handlerFactory');
const authController = require('../../controller/AuthController');

const router = express.Router();

// router.post(
//   '/create_project',
//   authController.protect,
//   helper.uploadAndResizeImages(
//     [
//       { name: 'image', maxCount: 1 },
//       { name: 'image_2', maxCount: 1 },
//       { name: 'aboutBg', maxCount: 1 },
//       { name: 'how_image', maxCount: 1 },
//       { name: 'projectLogo', maxCount: 1 }
//     ],
//     'project'
//   ),
//   Controller.create
// );


router.post(
  '/create_project',
  authController.protect,
  helper.uploadAndResizeImagesCase(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 },
      { name: 'aboutBg', maxCount: 1 },
      { name: 'how_image', maxCount: 1 },
      { name: 'projectLogo', maxCount: 1 },

      // New fields
      { name: 'headingIcon', maxCount: 1 },
      { name: 'overviewImage', maxCount: 1 },
      { name: 'resultImages', maxCount: 10 },
      { name: 'uiImages', maxCount: 10 },
      { name: 'techImages', maxCount: 10 },
    ],
    'project'
  ),
  Controller.create
);

router.post(
  '/update_project/:id',
  authController.protect,
  helper.uploadAndResizeImagesCase(
    [
      { name: 'image', maxCount: 1 },
      { name: 'image_2', maxCount: 1 },
      { name: 'aboutBg', maxCount: 1 },
      { name: 'how_image', maxCount: 1 },
      { name: 'projectLogo', maxCount: 1 },

      // New fields
      { name: 'headingIcon', maxCount: 1 },
      { name: 'overviewImage', maxCount: 1 },
      { name: 'resultImages', maxCount: 10 },
      { name: 'uiImages', maxCount: 10 },
      { name: 'techImages', maxCount: 10 },
    ],
    'project'
  ),
  Controller.update
);

// router.post(
//   '/update_project/:id',
//   authController.protect,
//   helper.uploadAndResizeImages(
//     [
//       { name: 'image', maxCount: 1 },
//       { name: 'image_2', maxCount: 1 },
//       { name: 'aboutBg', maxCount: 1 },
//       { name: 'how_image', maxCount: 1 },
//       { name: 'projectLogo', maxCount: 1 }
//     ],
//     'project'
//   ),
//   Controller.update
// );

router.post(
  '/create_project_section/:id',
  authController.protect,
  helper.uploadAndResizeImage('logo', 'project'),
  Controller.addSection
);

router.post(
  '/delete_project_section/:id/:sectionId',
  authController.protect,
  Controller.deleteSection
);

router.post('/delete_project/:id', authController.protect, Controller.delete);
router.post('/reorder_projects', authController.protect, Controller.reorder);
router.post('/project_status/:id', authController.protect, Controller.setStatus);

router.get('/get_/:id', Controller.getOne);
router.get('/getAll_project', Controller.getAll);
router.get(
  '/project_pagination',
  authController.protect,
  Controller.pagination
);

module.exports = router;

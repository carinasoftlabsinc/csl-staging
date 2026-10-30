const express = require('express');
const Controller = require('../../controller/contactController');
const authController = require('../../controller/AuthController');

const router = express.Router();

router.post('/getContactDetails', Controller.contactDetails);
router.post('/getServiceDetails', Controller.serviceDetails);


router.post(
  '/delete_contact_data/:id',
  authController.protect,
  Controller.delete
);

router.get('/get_contact_data/:id', Controller.getOne);
router.get('/getAll_contact_details', authController.protect, Controller.pagination);


module.exports = router;

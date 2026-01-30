const express = require('express');
const router = express.Router();
const { getInviteController, loginController } = require('../controllers/authController.js');
const inviteUserController  = require('../controllers/adminController.js');


router.post('/admin/invit', inviteUserController);

router.post('/login' , loginController);



module.exports = router;
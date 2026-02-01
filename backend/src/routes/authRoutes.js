const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController } = require('../controllers/authController.js');
const inviteUserController  = require('../controllers/adminController.js');


router.post('/admin/invite', inviteUserController);

router.get('/invitation', getInviteController)

router.post('/register', registerController );

router.post('/login' , loginController);



module.exports = router;
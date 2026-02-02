const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController, updateUserController, deleteUserController } = require('../controllers/user/authController.js');
const inviteUserController  = require('../controllers/admin/adminController.js');


router.post('/admin/invite', inviteUserController);

router.get('/invitation', getInviteController)

router.post('/register', registerController );

router.post('/login' , loginController);

router.put('/update_profile' , updateUserController); // modification du user par le user

router.put('/admin/user_update/:id' , updateUserController); // modification du user par le super-admin

router.delete('/admin/user_delete/:id', deleteUserController)


module.exports = router;
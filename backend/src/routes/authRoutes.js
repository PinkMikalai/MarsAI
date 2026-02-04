const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController, updateUserController, deleteUserController } = require('../controllers/user/authController.js');
const inviteUserController  = require('../controllers/admin/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/checkRoleMiddleware.js');
const { validate} = require('../middlewares/validate.js')
const {inviteSchema, passwordSchema} = require('../validators/authSchema.js')
const loginSchema = require('../validators/loginShema.js')



router.post('/admin/invite',authMiddleware,checkRole(['Super-admin']),validate(inviteSchema), inviteUserController);

router.get('/invitation', getInviteController)

router.post('/register', validate(passwordSchema), registerController );

router.post('/login' , validate(loginSchema), loginController);

router.put('/update_profile' , authMiddleware,  updateUserController); // modification du user par le user

router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super-admin', 'Admin']) , updateUserController); // modification du user par le super-admin

router.delete('/admin/user_delete/:id',authMiddleware, checkRole(['Super-admin', 'Admin']), deleteUserController)


module.exports = router;

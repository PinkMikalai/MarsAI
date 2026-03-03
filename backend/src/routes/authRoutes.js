import { Router } from 'express';

<<<<<<< HEAD
import { getInviteController, registerController, loginController, updateUserController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } from '../controllers/user/authController.js';
=======
import { getInviteController, registerController, loginController, updateUserController, updateUserBySuperAdminController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } from '../controllers/user/authController.js';
>>>>>>> 5130f1082994f660d9baf7631f065267e6e68921
import {inviteUserController} from '../controllers/admin/adminController.js';

const router = Router();

import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema, updateUserShema } from '../validators/authSchema.js';
import loginSchema from '../validators/loginShema.js';


router.post('/admin/invite', authMiddleware, checkRole(['Super-admin']), validate(inviteSchema), inviteUserController);
router.get('/invitation', getInviteController);
router.post('/register', validate(passwordSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

router.get('/profile', authMiddleware, profileUserController);

router.put('/update_profile', authMiddleware, validate(updateUserShema), updateUserController);
router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super-admin']), updateUserBySuperAdminController);
router.delete('/admin/user_delete/:id', authMiddleware, checkRole(['Super-admin']), deleteUserController);
router.post('/forgot_password', forgotPasswordController);
router.post('/reset_password', validate(resetPasswordSchema), resetPasswordController);
router.put('/update_password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);

export default router;

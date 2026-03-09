import { Router } from 'express';

import { getInviteController, registerController, loginController, updateUserController, updateUserBySuperAdminController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } from '../controllers/user/authController.js';
import {inviteUserController} from '../controllers/admin/adminController.js';

const router = Router();

import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema, updateUserShema } from '../validators/authSchema.js';
import loginSchema from '../validators/loginShema.js';


router.post('/admin/invite', authMiddleware, checkRole([3]), validate(inviteSchema), inviteUserController);
router.get('/invitation', getInviteController);
router.post('/register', validate(passwordSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

router.get('/profile', authMiddleware, profileUserController);

router.put('/update_profile', authMiddleware, validate(updateUserShema), updateUserController);
router.put('/admin/user_update/:id', authMiddleware, checkRole([3]), updateUserBySuperAdminController);
router.delete('/admin/user_delete/:id', authMiddleware, checkRole([3]), deleteUserController);
router.post('/forgot_password', forgotPasswordController);
router.post('/reset_password', validate(resetPasswordSchema), resetPasswordController);
router.put('/update_password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);

export default router;

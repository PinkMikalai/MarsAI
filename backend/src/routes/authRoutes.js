import { Router } from 'express';

import { getInviteController, registerController, loginController, updateUserController, updateUserBySuperAdminController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } from '../controllers/user/authController.js';
import {inviteUserController, getAllSelectorsController} from '../controllers/admin/adminController.js';

const router = Router();

import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema, updateUserSchema } from '../validators/authSchema.js';
import loginSchema from '../validators/loginShema.js';


router.post('/admin/invite', authMiddleware, checkRole(['Super_admin']), validate(inviteSchema), inviteUserController);
router.get('/invitation', getInviteController);
router.post('/register', validate(passwordSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

router.get('/profile', authMiddleware, profileUserController);

router.put('/update_profile', authMiddleware, validate(updateUserSchema), updateUserController);
router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super_admin']), updateUserBySuperAdminController);
router.delete('/admin/user_delete/:id', authMiddleware, checkRole(['Super_admin']), deleteUserController);
router.post('/forgot_password', forgotPasswordController);
router.post('/reset_password', validate(resetPasswordSchema), resetPasswordController);
router.put('/update_password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);
router.get('/admin/get_selectors', authMiddleware, checkRole(['Admin', 'Super_admin']),getAllSelectorsController);
export default router;

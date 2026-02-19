import { Router } from 'express';
import { getInviteController, registerController, loginController, updateUserController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } from '../controllers/user/authController.js';
import {inviteUserController} from '../controllers/admin/adminController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import checkRole from '../middlewares/checkRoleMiddleware.js';
import { validate } from '../middlewares/validate.js';
import { inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema } from '../validators/authSchema.js';
import loginSchema from '../validators/loginShema.js';

const router = Router();

router.post('/admin/invite', authMiddleware, checkRole(['Super-admin']), validate(inviteSchema), inviteUserController);
router.get('/invitation', getInviteController);
router.post('/register', validate(passwordSchema), registerController);
router.post('/login', validate(loginSchema), loginController);

router.get('/profile', authMiddleware, profileUserController);

router.put('/update_profile', authMiddleware, updateUserController);
router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super-admin', 'Admin']), updateUserController);
router.delete('/admin/user_delete/:id', authMiddleware, checkRole(['Super-admin', 'Admin']), deleteUserController);
router.post('/forgot_password', forgotPasswordController);
router.post('/reset_password', validate(resetPasswordSchema), resetPasswordController);
router.put('/update_password', authMiddleware, validate(updatePasswordSchema), updatePasswordController);

export default router;

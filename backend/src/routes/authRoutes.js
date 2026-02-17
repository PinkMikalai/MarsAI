const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController, updateUserController, deleteUserController, profileUserController, forgotPasswordController, resetPasswordController, updatePasswordController } = require('../controllers/user/authController.js');
const inviteUserController  = require('../controllers/admin/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/checkRoleMiddleware.js');
const { validate} = require('../middlewares/validate.js')
const {inviteSchema, passwordSchema, resetPasswordSchema, updatePasswordSchema} = require('../validators/authSchema.js')
const loginSchema = require('../validators/loginShema.js');



router.post('/admin/invite',authMiddleware,checkRole(['Super-admin']),validate(inviteSchema), inviteUserController);
//route de la reception de l'invitation : décodage du token qi contient email et role
router.get('/invitation', getInviteController);
//route de la création du profil user
router.post('/register', validate(passwordSchema), registerController );
// route pour le login 
router.post('/login' , validate(loginSchema), loginController);

router.get('/profile',authMiddleware, profileUserController);

router.put('/update_profile' , authMiddleware,  updateUserController); // modification du user par le user
// route pour modifier les infos user par les admins
router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super-admin', 'Admin']) , updateUserController); // modification du user par le super-admin
// route pour supprimer le user par les admins
router.delete('/admin/user_delete/:id',authMiddleware, checkRole(['Super-admin', 'Admin']), deleteUserController)
// route pour réinitialiser un mot de passe oublié
router.post('/forgot_password',forgotPasswordController );
// route pour recréer un nouveau mot de passe 
router.post('/reset_password' , validate(resetPasswordSchema), resetPasswordController);
// route pour update du mot de passe si connecté à son compte
router.put('/update_password', authMiddleware, validate(updatePasswordSchema), updatePasswordController )

module.exports = router;

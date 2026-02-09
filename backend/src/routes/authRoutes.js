const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController, updateUserController, deleteUserController, profileUserController } = require('../controllers/user/authController.js');
const inviteUserController  = require('../controllers/admin/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/checkRoleMiddleware.js');
const { validate} = require('../middlewares/validate.js')
const {inviteSchema, passwordSchema} = require('../validators/authSchema.js')
const loginSchema = require('../validators/loginShema.js')


// route de l'envoie de l'invitation à créer son profil par le super-admin
router.post('/admin/invite',authMiddleware,checkRole(['Super-admin']),validate(inviteSchema), inviteUserController);
//route de la reception de l'invitation : décodage du token qi contient email et role
router.get('/invitation', getInviteController);
//route de la création du profil user
router.post('/register', validate(passwordSchema), registerController );
// route pour le login 
router.post('/login' , validate(loginSchema), loginController);
// route pour accéder à la page profil du user
router.get('/profile/', authMiddleware, profileUserController );
// route pour modifier les infos user par le user
router.put('/update_profile' , authMiddleware,  updateUserController); // modification du user par le user
// route pour modifier les infos user par les admins
router.put('/admin/user_update/:id', authMiddleware, checkRole(['Super-admin', 'Admin']) , updateUserController); // modification du user par le super-admin
// route pour supprimer le user par les admins
router.delete('/admin/user_delete/:id',authMiddleware, checkRole(['Super-admin', 'Admin']), deleteUserController)


module.exports = router;

const express = require('express');
const router = express.Router();
const { getInviteController, registerController ,loginController, updateUserController, deleteUserController } = require('../controllers/user/authController.js');
const inviteUserController  = require('../controllers/admin/adminController.js');
const authMiddleware = require('../middlewares/authMiddleware.js');
const checkRole = require('../middlewares/checkRoleMiddleware.js');
const { validate} = require('../middlewares/validate.js')
const {inviteSchema, passwordSchema} = require('../validators/authSchema.js')
const loginSchema = require('../validators/loginShema.js')



router.post('/admin/invite',authMiddleware,checkRole(['Super_admin']),validate(inviteSchema), inviteUserController);

router.get('/invitation', getInviteController)

router.post('/register', registerController );

router.post('/login' , loginController);

router.put('/update_profile' , updateUserController); // modification du user par le user

router.put('/admin/user_update/:id' , updateUserController); // modification du user par le super-admin

router.delete('/admin/user_delete/:id', deleteUserController)


module.exports = router;


// const express = require('express');
// const router = express.Router();

// // Controllers
// const { getInviteController, registerController, loginController, updateUserController, deleteUserController } = require('../controllers/user/authController.js');
// const inviteUserController = require('../controllers/admin/adminController.js');

// // Middlewares
// const authMiddleware = require('../middlewares/authMiddleware');
// const checkRole = require('../middlewares/checkRole');
// const { validate } = require('../middlewares/validate');

// // Schémas Zod
// const inviteSchema = require('../schemas/inviteSchema');
// const { PasswordSchema } = require('../schemas/authSchema');
// // (Ajoute un loginSchema simple dans tes fichiers si besoin)

// // --- ROUTES ---

// // 1. Inviter un membre (Réservé au Super-Admin)
// router.post('/admin/invite', 
//     authMiddleware, 
//     checkRole(['super-admin']), 
//     validate(inviteSchema), 
//     inviteUserController
// );

// // 2. Vérifier le token du mail (Public)
// // On valide que le token est présent dans les "query params" (?token=...)
// router.get('/invitation', getInviteController); 

// // 3. Finaliser l'inscription (Public)
// router.post('/register', 
//     validate(PasswordSchema), 
//     registerController
// );

// // 4. Connexion (Public)
// router.post('/login', loginController);

// // 5. Modifier son propre profil (Tout utilisateur connecté)
// router.put('/update_profile', 
//     authMiddleware, 
//     updateUserController
// );

// // 6. Gestion administrative des users (Admin/Super-Admin)
// router.put('/admin/user_update/:id', 
//     authMiddleware, 
//     checkRole(['super-admin', 'admin']), 
//     updateUserController
// );

// router.delete('/admin/user_delete/:id', 
//     authMiddleware, 
//     checkRole(['super-admin']), 
//     deleteUserController
// );

// module.exports = router;
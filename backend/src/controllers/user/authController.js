const authService = require('../../services/user/authService');

// Vérification du token 
const getInviteController = async (req, res, next) => {
    try {
        const { token } = req.query;
        const info = await authService.decodeInvitationToken(token);
        res.json(info);
    } catch (error) {
        next(error);
    }
};

// Création du compte par le nouvel user et enregistrement dans la db
const registerController = async (req, res, next) => {
    try {
        const newUser = await authService.register(req.body);
        res.status(201).json({
            status: "success",
            message: "User created with success",
            data : newUser
        });
    } catch (error) {
        next(error);
    }
};

// Login au compte user
const loginController = async (req, res, next) => {
    try {
        const token = await authService.login(req.body);
        res.json({ token });
    } catch (error) {
        next(error);
    }
};
//modification du user 
const updateUserController = async (req, res, next) => {
    try {

        const id = req.params.id || req.user.id;
        const result = await authService.updateUser(id, req.body);
        res.status(200).json({
            status: "success",
            message: `User n° ${id}  updated with success`,
            result: result
        });
    } catch (error) {
        next(error);
    }
};
// suppression du user 

const deleteUserController = async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await authService.deleteUser(id);

        res.status(200).json({
            status: "success",
            message: `User n° ${id}  delated with success`,
            result: result
        })

    } catch (error) {
        next(error);
    }
}

const profileUserController = async (req, res) => {
    try {
        const id = req.user.id;

        const result = await authService.profileUser(id);

        res.status(200).json({
            status: 'success',
            message: `User n° ${id} connected`,
            result: result
        })
        
    } catch (error){

        console.error(error);
        res.status(500).json({message : ` the requested profile dosen't  exist `})
       }
 }
const forgotPasswordController = async (req, res, next) => {
    // obtenir un lien d reinitialisation
    try {
        const { email } = req.body;
        const result = await authService.passwordReset(email);

        res.status(200).json( {
            status: 'success',
            message : 'Link to reset password created',
            result : result

        })

    } catch(error) {
        next(error)

    }
}
const resetPasswordController = async (req, res, next) =>{
    try{
        const { token, newPassword} = req.body;

        const result = await authService.confirmPasswordReset(token, newPassword);

        res.status(200).json( {
            status : 'success',
            message : 'New password created',
            result : result

        })


    } catch(error){
        next(error)

    }
}
const updatePasswordController = async (req, res, next) =>{
    try{
        const userId = req.user.id;
        const { oldPassword, newPassword} = req.body

        const result = await authService.updatePassword(userId,oldPassword, newPassword);

        res.status(200).json( {
            status : 'success',
            message : 'Password updated successfully',
            result : result

        })


    } catch(error){
        next(error)

    }
}


module.exports = {
    getInviteController,
    registerController,
    loginController,
    updateUserController,
    deleteUserController,
    profileUserController,
    forgotPasswordController,
    resetPasswordController,
    updatePasswordController
};
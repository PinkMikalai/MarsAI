const authService = require('../services/authService');

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
        res.status(201).json(newUser);
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

module.exports = {
    getInviteController,
    registerController,
    loginController
};
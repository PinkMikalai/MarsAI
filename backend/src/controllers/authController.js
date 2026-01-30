import {createInvitationToken , register,login} from '../services/authService.js';

// Étape 1 : Le frontend demande "C'est quoi ce token ?" au chargement de la page
export const getInviteController = async (req, res, next) => {
    try {
        const { token } = req.query;
        // Décodage du JWT pour renvoyer l'email et le rôle au formulaire
        const info = await authService.decodeInvitationToken(token);
        res.json(info);
    } catch (error) {
        next(error);
    }
 
};

//user soumet le formuliare de création de compte
export const registerController = async (req, res, next) => {
    try {
        const { token, firstname, lastname, password } = req.body;

        // Le service vérifie le token, hashe le MDP et fait l'INSERT
        const newUser = await authService.registerWithInvitation({
            token,
            firstname,
            lastname,
            password
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

// // Login par le lien dissimulé dans le footer
export const loginController = async (req, res, next) => {
    try {
        const result = await login(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
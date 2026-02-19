import api from "./api" ;

export const authService = {
    // verifyInvitation , vérification token et récupération email/role //
    verifyInvitation: (token) => api(`/auth/invitation?token=${token}`, {
        method: 'GET',
        checkAuth : false

    }),
    
    // register , finalisation création compte (prénom, nom, mot de passe) //
    register: (userData) => api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
        checkAuth : false

    }),

    // login , connexion utilisateur //
    login: (credentials) => api('/auth/login', {
        method : 'POST',
        body: JSON.stringify(credentials)
    }),
    // profil , récupération profil utilisateur//
    profile: () => api(`/auth/profile`, {
     method: 'GET'
    }),

    // mot de passe oublié : envoi du lien par email //
    forgotPassword: (email) => api('/auth/forgot_password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        checkAuth: false,
    }),

    // réinitialisation du mot de passe (avec token reçu par email) //
    resetPassword: (data) => api('/auth/reset_password', {
        method: 'POST',
        body: JSON.stringify(data),
        checkAuth: false,
    }),

    // mise à jour du mot de passe (depuis le profil, utilisateur connecté) //
    updatePassword: (data) => api('/auth/update_password', {
        method: 'PUT',
        body: JSON.stringify(data),
    }),
};

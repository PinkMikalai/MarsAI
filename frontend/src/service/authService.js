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
    })

};

import api from "./api" ;

export const authService = {
    // verifyInvitation , vérification token et récupération email/role //
    verifyInvitation: (token) => api.get(`/auth/invitation`, {
        params: {token}

    }),
    
    // register , finalisation création compte (prénom, nom, mot de passe) //
    register: (userData) => api.post('/auth/register', userData),

    // login , connexion utilisateur //
    login: (credentials) => api.post('/auth/login', credentials),

    // accés à l'espace user qui contient toutes ces infos et permet d'accéder aux fonctionnalités liées à son rôle //

    profile : () => api.get(`/auth/profile`)

};

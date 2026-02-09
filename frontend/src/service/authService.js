import api from "./api" ;

export const authService = {
    // verifyInvitation , vérification token et récupération email/role ------------//
    verifyInvitation: (token) => api.get(`/auth/invitation`, {
        params: {token}

    }),
    
    // register , finalisation création compte (prénom, nom, mot de passe) ------------//
    register: (userData) => api.post('/auth/register', userData),

    // login , connexion utilisateur ------------//
    login: (credentials) => api.post('/auth/login', credentials),
    // profile , récupération profil utilisateur ------------//
    profile: (id, token) => api.get(`/auth/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    })

};

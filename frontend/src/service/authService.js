import api from "./api" ;

export const authService = {
    // Vérification de la validité du token et récupéreration de l'email et role 
    verifyInvitation: (token) => api.get(`/auth/invitation`, {
        params: {token}

    }),
    
    // Finalisation de la création du compte par le user : compléte le prénom,le nom, le mot de passe
    register: (userData) => api.post('/auth/register', userData),

    // Connexion (POST)
    login: (credentials) => api.post('/auth/login', credentials)

};

/* api.js - Instance Axios configurée */
import axios from 'axios'; 
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;



// /* api.js - Instance Axios Intelligente */
// import axios from 'axios';

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || '/api',
//   timeout: 120000,
//   headers: { 'Content-Type': 'application/json' },
// });

// // --- INTERCEPTEUR DE REQUÊTE ---
// // S'exécute AVANT chaque envoi de requête au serveur
// api.interceptors.request.use(
//   (config) => {
//     // On récupère le token stocké (on l'appellera 'token' dans le localStorage)
//     const token = localStorage.getItem('token');
    
//     if (token) {
//       // On l'ajoute dans le header Authorization au format standard Bearer
//       config.headers.Authorization = `Bearer ${token}`;
//     }
    
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // --- INTERCEPTEUR DE RÉPONSE (Optionnel mais recommandé) ---
// // S'exécute à la réception de la réponse du serveur
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Si le serveur répond 401 (Non autorisé) ou 403 (Token expiré)
//     if (error.response && [401, 403].includes(error.response.status)) {
//       console.warn("Session expirée ou accès refusé. Déconnexion...");
//       // Optionnel : localStorage.removeItem('token');
//       // Optionnel : window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );

// export default api;
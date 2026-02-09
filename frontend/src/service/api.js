// api , instance Axios configurée , automatisation de l'intégration du oken dans le haeders, gestion des erreurs liées au token pour les request et les responses//
import axios from 'axios'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
  headers: { 'Content-Type': 'application/json' },
});

export default api;




import axios from 'axios'; 

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai',
  timeout: 120000,
});

export default api;




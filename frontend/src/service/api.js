const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai';

const api = async ( endpoint , options = {}) => {
  const token = localStorage.getItem('token');

  // configuration des headers 
  const headers = { 'Content-Type': 'application/json' , ...options.headers,};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = { ...options , headers,};

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config)

    // gestion des réponses :
    if(response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }
    if(!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "ServEr error")
    }
    const data = await response.json();
    return data; 
  } catch (error) {
    console.error("API error", error.message)
     throw error }
}

export default api;




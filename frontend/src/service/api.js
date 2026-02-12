const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai';

const api = async ( endpoint , options = {}) => {
  const { checkAuth = true , ... fetchOptions } = options;
  const token = localStorage.getItem('token');

  // configuration des headers 

  const headers = { ...options.headers};
  if(!(options.body instanceof FormData)) {

    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, { ...fetchOptions, headers })

    // gestion des réponses :
    if(response.status === 401 && checkAuth) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return;
    }

 

    if (!response.ok) {
      if (response.status === 413) {
        throw new Error('Le fichier ou les fichiers sont trop volumineux. Réduisez la taille (vidéo, images) ou contactez l’équipe.');
      }

      const contentType = response.headers.get('Content-Type') || '';
      let message = 'Erreur serveur';

      try {
        if (contentType.includes('application/json')) {
          const error = await response.json();
          message = error.message || message;
        } else {
          const text = await response.text();
          if (text && !text.trimStart().startsWith('<')) {
            message = text.slice(0, 200);
          }
        }
      } catch (_) {}

      throw new Error(message);
    }

    const contentType = response.headers.get('Content-Type') || '';
    if (contentType.includes('application/json')) {
      return await response.json();

    }
    return await response.text();
  } catch (error) {
    console.error("API error", error.message)
     throw error }
}

export default api;
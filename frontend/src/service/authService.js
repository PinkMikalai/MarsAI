/* authService.js - Services d'authentification (login, register, logout) */

/**
 * Connexion pour tous les profils (admin, sélectionneurs, participants).
 * En production : appeler l'API réelle et renvoyer { user, token }.
 */
export const login = async ({ email, password }) => {
  // Simule un délai réseau
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock : accepte n'importe quel email + mot de passe non vide
  if (!email || !password) {
    throw new Error('Email et mot de passe requis.');
  }

  return {
    user: {
      id: '1',
      email,
      role: 'user', // En prod : renvoyé par l'API (admin, selectionneur, participant)
    },
    token: 'mock-jwt-token',
  };
};

export const logout = () => {
  // En prod : invalider le token côté serveur si besoin
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('marsai_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => {
  return localStorage.getItem('marsai_token');
};

export const setSession = (user, token) => {
  if (user) localStorage.setItem('marsai_user', JSON.stringify(user));
  if (token) localStorage.setItem('marsai_token', token);
};

export const clearSession = () => {
  localStorage.removeItem('marsai_user');
  localStorage.removeItem('marsai_token');
};

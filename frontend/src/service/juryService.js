import api from './api';

const getApi = () => (import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai').replace(/\/marsai\/?$/, '');

const buildJuryImageUrl = (filename) => {
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  const origin = getApi();
  const path = filename.includes('assets/uploads') ? filename.replace(/^\//, '') : `assets/uploads/images/${filename.replace(/^\//, '')}`;
  return `${origin}/${path}`;
};

export const juryService = {
  getAll: () => api('/jury', { method: 'GET' }),

  getById: (id) => api(`/jury/${id}`, { method: 'GET' }),

  create: (formData) =>
    api('/jury', {
      method: 'POST',
      body: formData,
    }),

  update: (id, formData) =>
    api(`/jury/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (id) => api(`/jury/${id}`, { method: 'DELETE' }),

  getJuryImageUrl: buildJuryImageUrl,
};

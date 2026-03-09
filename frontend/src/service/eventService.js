import api from './api';

const getApi = () => (import.meta.env.VITE_API_URL || 'http://localhost:3000/marsai').replace(/\/marsai\/?$/, '');

const buildEventImageUrl = (filename) => {
  if (!filename) return null;
  if (/^https?:\/\//.test(filename)) return filename;
  const origin = getApi();
  const path = filename.includes('assets/uploads')
    ? filename.replace(/^\//, '')
    : `assets/uploads/images/${filename.replace(/^\//, '')}`;
  return `${origin}/${path}`;
};

export const eventService = {
  getAll: () => api('/events', { method: 'GET' }),

  getById: (id) => api(`/events/${id}`, { method: 'GET' }),

  create: (formData) =>
    api('/events', {
      method: 'POST',
      body: formData,
    }),

  update: (id, formData) =>
    api(`/events/${id}`, {
      method: 'PUT',
      body: formData,
    }),

  delete: (id) =>
    api(`/events/${id}`, {
      method: 'DELETE',
    }),

  getEventImageUrl: buildEventImageUrl,
};

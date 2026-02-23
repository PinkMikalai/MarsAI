import api from './api';

export const searchService = {
  searchVideos: (search) => api('/videos/search', { method: 'GET', body: search }),
};


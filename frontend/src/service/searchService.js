import api from './api';

export const searchService = {
    getSearchVideos: (q) => api(`/videos?q=${encodeURIComponent(q ?? '')}`, { method: 'GET' }),
};
